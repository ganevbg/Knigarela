namespace Knigarela.Services
{
    using Knigarela.Core.Pagination;
    using Microsoft.EntityFrameworkCore;
    using System.Linq.Expressions;

    public static class DynamicQuery
    {
        public static async Task<PagedResult<TResult>> ApplyAsync<TEntity, TResult>(
            IQueryable<TEntity> dbData,
            DataQuery<string> query,
            Expression<Func<TEntity, TResult>> selectExpression,
            Dictionary<string, Func<IQueryable<TEntity>, string, IQueryable<TEntity>>> filterMap)
        {
            // FILTERS
            dbData = ApplyFilters(dbData, query.Filters, filterMap);

            // SORT
            if (!string.IsNullOrEmpty(query.SortColumn))
            {
                dbData = ApplySorting(dbData, query.SortColumn, query.SortDirection == "asc");
            }

            // TOTAL COUNT
            var total = await dbData.CountAsync();

            // PAGING + SELECT
            var data = await dbData
                .Skip((query.Page - 1) * query.ItemsPerPage)
                .Take(query.ItemsPerPage)
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

        private static IQueryable<TEntity> ApplyFilters<TEntity>(
            IQueryable<TEntity> query,
            Dictionary<string, string> filters,
            Dictionary<string, Func<IQueryable<TEntity>, string, IQueryable<TEntity>>> filterMap)
        {
            foreach (var (key, raw) in filters)
            {
                if (string.IsNullOrWhiteSpace(raw)) continue;
                if (!filterMap.TryGetValue(key, out var apply)) continue;

                query = apply(query, raw);
            }

            return query;
        }
    }
}
