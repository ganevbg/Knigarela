namespace Knigarela.Core.Pagination
{
    public class DataQuery<TSort>
    {
        public int Page { get; set; } = 1;

        public int ItemsPerPage { get; set; } = 10;

        public Dictionary<string, string> Filters { get; set; } = new();

        public TSort? SortColumn { get; set; }

        public string SortDirection { get; set; } = "asc"; // asc/desc
    }
}
