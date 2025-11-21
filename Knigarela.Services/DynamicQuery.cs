namespace Knigarela.Services
{
    using Knigarela.Core.Pagination;
    using Microsoft.EntityFrameworkCore;
    using System.Linq.Expressions;

    public static class DynamicQuery
    {
        public static async Task<PagedResult<TResult>> ApplyAsync<TEntity, TResult>(
            IQueryable<TEntity> query,
            PaginationQuery<string> pagination,
            Expression<Func<TEntity, bool>>? filterExpression,
            Expression<Func<TEntity, TResult>> selectExpression,
            params Expression<Func<TEntity, string>>[] searchableFields)
        {
            // SEARCH (case-insensitive LIKE)
            if (!string.IsNullOrWhiteSpace(pagination.SearchQuery) && searchableFields.Any())
            {
                string search = pagination.SearchQuery.ToLower();
                var entityParam = Expression.Parameter(typeof(TEntity), "e");

                Expression? combined = null;

                foreach (var field in searchableFields)
                {
                    // Rebind parameter (b => b.Title) => (e => e.Title)
                    var rebounded = ReplaceParameter(field, entityParam);

                    // lower(field)
                    var toLowerMethod = typeof(string).GetMethod(nameof(string.ToLower), Type.EmptyTypes)!;
                    var fieldToLower = Expression.Call(rebounded.Body, toLowerMethod);

                    // pattern: "%search%"
                    var pattern = Expression.Constant($"%{search}%");

                    // EF.Functions.Like(lower(field), "%search%")
                    var likeMethod = typeof(DbFunctionsExtensions).GetMethod(
                        nameof(DbFunctionsExtensions.Like),
                        new[] { typeof(DbFunctions), typeof(string), typeof(string) }
                    )!;

                    var likeCall = Expression.Call(
                        likeMethod,
                        Expression.Property(null, typeof(EF), nameof(EF.Functions)),
                        fieldToLower,
                        pattern
                    );

                    combined = combined == null
                        ? likeCall
                        : Expression.OrElse(combined, likeCall);
                }

                if (combined != null)
                {
                    var lambda = Expression.Lambda<Func<TEntity, bool>>(combined, entityParam);
                    query = query.Where(lambda);
                }
            }

            // FILTER
            if (filterExpression != null)
                query = query.Where(filterExpression);

            // SORT
            if (!string.IsNullOrEmpty(pagination.SortColumn))
                query = ApplySorting(query, pagination.SortColumn, pagination.SortDirection == "asc");

            // COUNT
            var total = await query.CountAsync();

            // PAGE + SELECT
            var data = await query
                .Skip((pagination.Page - 1) * pagination.ItemsPerPage)
                .Take(pagination.ItemsPerPage)
                .Select(selectExpression)
                .ToListAsync();

            return new PagedResult<TResult>
            {
                Total = total,
                Data = data
            };
        }

        private static IQueryable<TEntity> ApplySorting<TEntity>(
            IQueryable<TEntity> query, string propertyName, bool asc)
        {
            var parameter = Expression.Parameter(typeof(TEntity), "x");
            var property = Expression.Property(parameter, propertyName);
            var lambda = Expression.Lambda(property, parameter);

            string method = asc ? "OrderBy" : "OrderByDescending";

            var result = typeof(Queryable)
                .GetMethods()
                .First(m => m.Name == method && m.GetParameters().Length == 2)
                .MakeGenericMethod(typeof(TEntity), property.Type)
                .Invoke(null, new object[] { query, lambda });

            return (IQueryable<TEntity>)result!;
        }

        private static Expression<Func<T, TOut>> ReplaceParameter<T, TOut>(
            Expression<Func<T, TOut>> expr,
            ParameterExpression newParam)
        {
            var visitor = new ReplaceParameterVisitor(expr.Parameters[0], newParam);
            var newBody = visitor.Visit(expr.Body)!;
            return Expression.Lambda<Func<T, TOut>>(newBody, newParam);
        }
    }

    internal class ReplaceParameterVisitor : ExpressionVisitor
    {
        private readonly ParameterExpression _oldParam;
        private readonly ParameterExpression _newParam;

        public ReplaceParameterVisitor(ParameterExpression oldParam, ParameterExpression newParam)
        {
            _oldParam = oldParam;
            _newParam = newParam;
        }

        protected override Expression VisitParameter(ParameterExpression node)
            => node == _oldParam ? _newParam : base.VisitParameter(node);
    }
}
