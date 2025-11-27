export interface PaginationParams<TSort> {
    filters: Record<string, string>
    sortColumn: TSort;
    sortDirection: "asc" | "desc";
    page: number;
    itemsPerPage: number;
}