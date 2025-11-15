export interface PaginationParams<TSort> {
    searchQuery: string;
    filterValue: string;
    sortColumn: TSort;
    sortDirection: "asc" | "desc";
    page: number;
    itemsPerPage: number;
}