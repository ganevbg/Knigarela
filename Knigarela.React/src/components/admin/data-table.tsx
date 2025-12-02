"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface FilterConfig {
  key: string
  label: string
  type: "text" | "number" | "select" | "date"
  placeholder?: string
  options?: { label: string; value: string }[]
  defaultValue?: string
}

export interface CustomAction<T> {
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: (item: T | null) => void
  href?: (item: T | null) => string
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export interface DataTableConfig<T> {
  title: string
  description: string
  columns: Column<T>[]
  createUrl: string
  editUrl: (id: string) => string
  fetchData: (params: {
    filters: Record<string, string>
    sortColumn: keyof T
    sortDirection: "asc" | "desc"
    page: number
    itemsPerPage: number
  }) => Promise<{ data: T[]; total: number }>
  deleteItem?: (id: string) => Promise<void>
  filters?: FilterConfig[]
  itemsPerPage?: number
  enableCreate?: boolean
  enableEdit?: boolean
  enableDelete?: boolean
  deleteConfirmation?: {
    title: string
    description: (item: T) => string
  }
  customActions?: CustomAction<T>[]
  massCustomActions?: CustomAction<T>[]
}

export function DataTable<T extends { id: string }>({ config, reloadKey }: { config: DataTableConfig<T>, reloadKey: number }) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initialFilters: Record<string, string> = {}
    config.filters?.forEach((filter) => {
      initialFilters[filter.key] = filter.defaultValue || ""
    })
    return initialFilters
  })

  const [sortColumn, setSortColumn] = useState<keyof T>(config.columns[0].key)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<T | null>(null)
  const itemsPerPage = config.itemsPerPage || 10

  const enableCreate = config.enableCreate !== false
  const enableEdit = config.enableEdit !== false
  const enableDelete = config.enableDelete !== false

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const result = await config.fetchData({
          filters,
          sortColumn,
          sortDirection,
          page: currentPage,
          itemsPerPage,
        })
        setItems(result.data)
        setTotalPages(Math.ceil(result.total / itemsPerPage))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [filters, sortColumn, sortDirection, currentPage, reloadKey])

  const handleSort = (column: keyof T) => {
    const columnConfig = config.columns.find((col) => col.key === column)
    if (columnConfig?.sortable === false) return

    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleDelete = (item: T) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete && config.deleteItem) {
      try {
        await config.deleteItem(itemToDelete.id)
        setItems(items.filter((item) => item.id !== itemToDelete.id))
        setDeleteDialogOpen(false)
        setItemToDelete(null)
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    }
  }

  const SortIcon = ({ column }: { column: keyof T }) => {
    if (sortColumn !== column) return null
    return sortDirection === "asc" ? "↑" : "↓"
  }

  const hasActions = enableEdit || enableDelete || (config.customActions && config.customActions.length > 0)

  const renderFilter = (filter: FilterConfig) => {
    const value = filters[filter.key] || ""

    switch (filter.type) {
      case "text":
        return (
          <div key={filter.key} className="min-w-[200px] flex-1">
            <label className="mb-2 block text-sm font-medium text-[var(--knigarela-text)]">{filter.label}</label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={filter.placeholder || filter.label}
                value={value}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )

      case "number":
        return (
          <div key={filter.key} className="min-w-[200px] flex-1">
            <label className="mb-2 block text-sm font-medium text-[var(--knigarela-text)]">{filter.label}</label>
            <Input
              type="number"
              placeholder={filter.placeholder || filter.label}
              value={value}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            />
          </div>
        )

      case "select":
        return (
          <div key={filter.key} className="min-w-[200px] flex-1">
            <label className="mb-2 block text-sm font-medium text-[var(--knigarela-text)]">{filter.label}</label>
            <Select value={value} onValueChange={(val) => handleFilterChange(filter.key, val)}>
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder || filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "date":
        return (
          <div key={filter.key} className="min-w-[200px] flex-1">
            <label className="mb-2 block text-sm font-medium text-[var(--knigarela-text)]">{filter.label}</label>
            <Input
              type="date"
              placeholder={filter.placeholder || filter.label}
              value={value}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[var(--knigarela-bg)]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--knigarela-text)]">{config.title}</h1>
              <p className="mt-1 text-[var(--knigarela-text-light)]">{config.description}</p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {config.massCustomActions?.map((action, index) => {
                const Icon = action.icon
                const buttonContent = (
                  <>
                    {Icon && <Icon className="mr-2 h-5 w-5" />}
                    {action.label}
                  </>
                )

                if (action.href) {
                  return (
                    <Link key={index} href={action.href(null)} className="flex-1 sm:flex-initial">
                      <Button
                        variant={action.variant || "default"}
                        className={
                          action.className ||
                          "w-full bg-[var(--knigarela-pink)] text-white hover:bg-[var(--knigarela-pink)]/90"
                        }
                      >
                        {buttonContent}
                      </Button>
                    </Link>
                  )
                }

                return (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    onClick={() => action.onClick?.(null)}
                    className={
                      action.className ||
                      "flex-1 sm:flex-initial bg-[var(--knigarela-pink)] text-white hover:bg-[var(--knigarela-pink)]/90"
                    }
                  >
                    {buttonContent}
                  </Button>
                )
              })}
              {enableCreate && (
                <Link href={config.createUrl} className="flex-1 sm:flex-initial">
                  <Button className="w-full bg-[var(--knigarela-pink)] text-white hover:bg-[var(--knigarela-pink)]/90">
                    <Plus className="mr-2 h-5 w-5" />
                    Създай Нов
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {config.filters && config.filters.length > 0 && (
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col flex-wrap gap-4 md:flex-row">
              {config.filters.map((filter) => renderFilter(filter))}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="container mx-auto px-4 pb-6">
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--knigarela-pink)]"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-[var(--knigarela-text-light)]">Няма намерени резултати</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--knigarela-pink-light)]/20 hover:bg-[var(--knigarela-pink-light)]/20">
                    {config.columns.map((column) => (
                      <TableHead
                        key={String(column.key)}
                        className={`font-semibold text-[var(--knigarela-text)] ${
                          column.sortable !== false ? "cursor-pointer select-none" : ""
                        }`}
                        onClick={() => column.sortable !== false && handleSort(column.key)}
                      >
                        <div className="flex items-center gap-2">
                          {column.label} {column.sortable !== false && <SortIcon column={column.key} />}
                        </div>
                      </TableHead>
                    ))}
                    {hasActions && (
                      <TableHead className="text-right font-semibold text-[var(--knigarela-text)]">Действия</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-[var(--knigarela-bg)]">
                      {config.columns.map((column) => (
                        <TableCell key={String(column.key)} className="text-[var(--knigarela-text-light)]">
                          {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                        </TableCell>
                      ))}
                      {hasActions && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {config.customActions?.map((action, index) => {
                              const Icon = action.icon
                              const buttonContent = (
                                <>
                                  {Icon && <Icon className="h-4 w-4" />}
                                  {action.label && <span className="ml-1">{action.label}</span>}
                                </>
                              )

                              if (action.href) {
                                return (
                                  <Link key={index} href={action.href(item)}>
                                    <Button
                                      variant={action.variant || "outline"}
                                      size="sm"
                                      className={
                                        action.className ||
                                        "border-[var(--knigarela-pink)] text-[var(--knigarela-pink)] hover:bg-[var(--knigarela-pink-light)]/50 bg-transparent"
                                      }
                                    >
                                      {buttonContent}
                                    </Button>
                                  </Link>
                                )
                              }

                              return (
                                <Button
                                  key={index}
                                  variant={action.variant || "outline"}
                                  size="sm"
                                  onClick={() => action.onClick?.(item)}
                                  className={
                                    action.className ||
                                    "border-[var(--knigarela-pink)] text-[var(--knigarela-pink)] hover:bg-[var(--knigarela-pink-light)]/50 bg-transparent"
                                  }
                                >
                                  {buttonContent}
                                </Button>
                              )
                            })}
                            {enableEdit && (
                              <Link href={config.editUrl(item.id)}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[var(--knigarela-pink)] bg-transparent text-[var(--knigarela-pink)] hover:bg-[var(--knigarela-pink-light)]/50"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                            {enableDelete && config.deleteItem && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(item)}
                                className="border-red-500 text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                <p className="text-sm text-[var(--knigarela-text-light)]">
                  Страница {currentPage} от {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border-gray-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Назад
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="border-gray-300"
                  >
                    Напред
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {config.deleteConfirmation && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{config.deleteConfirmation.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {itemToDelete && config.deleteConfirmation.description(itemToDelete)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отказ</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
                Изтриване
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
