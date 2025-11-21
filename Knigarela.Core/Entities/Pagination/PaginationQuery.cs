namespace Knigarela.Core.Pagination
{
    public class PaginationQuery<TSort>
    {
        public int Page { get; set; } = 1;

        public int ItemsPerPage { get; set; } = 10;

        public string SearchQuery { get; set; } = "";

        public string FilterValue { get; set; } = "";

        public TSort SortColumn { get; set; }

        public string SortDirection { get; set; } = "asc"; // asc/desc
    }
}
