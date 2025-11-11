"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { getAllAdmin, deleteBox } from "@/api/boxes"

interface Box {
    id: string
    title: string
    isActive: boolean
    count: number
    singlePrice: number
    subscriptionPrice: number
}

export default function AdminBoxesPage() {
    const [boxes, setBoxes] = useState<Box[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
    const [sortColumn, setSortColumn] = useState<keyof Box>("title")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [boxToDelete, setBoxToDelete] = useState<Box | null>(null)
    const itemsPerPage = 10

    // Simulate fetching boxes with server-side filtering, sorting, and pagination
    useEffect(() => {
        const fetchBoxes = async () => {
            setLoading(true)

            const boxes = await getAllAdmin() as Box[];

            // Apply filtering
            const filteredBoxes = boxes.filter((box) => {
                const matchesSearch = box.title.toLowerCase().includes(searchQuery.toLowerCase())
                const matchesStatus =
                    filterStatus === "all" ||
                    (filterStatus === "active" && box.isActive) ||
                    (filterStatus === "inactive" && !box.isActive)
                return matchesSearch && matchesStatus
            })

            // Apply sorting
            filteredBoxes.sort((a, b) => {
                const aValue = a[sortColumn]
                const bValue = b[sortColumn]

                if (typeof aValue === "boolean") {
                    return sortDirection === "asc"
                        ? aValue === bValue
                            ? 0
                            : aValue
                                ? 1
                                : -1
                        : aValue === bValue
                            ? 0
                            : aValue
                                ? -1
                                : 1
                }

                if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
                if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
                return 0
            })

            // Calculate pagination
            const total = Math.ceil(filteredBoxes.length / itemsPerPage)
            setTotalPages(total)

            // Get current page items
            const startIndex = (currentPage - 1) * itemsPerPage
            const paginatedBoxes = filteredBoxes.slice(startIndex, startIndex + itemsPerPage)

            setBoxes(paginatedBoxes)
            setLoading(false)
        }

        fetchBoxes()
    }, [searchQuery, filterStatus, sortColumn, sortDirection, currentPage])

    const handleSort = (column: keyof Box) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    const handleDelete = (box: Box) => {
        setBoxToDelete(box)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (boxToDelete) {
            // Simulate API call
            await deleteBox(boxToDelete.id)


            // Remove box from list
            setBoxes(boxes.filter((box) => box.id !== boxToDelete.id))
            setDeleteDialogOpen(false)
            setBoxToDelete(null)
        }
    }

    const SortIcon = ({ column }: { column: keyof Box }) => {
        if (sortColumn !== column) return null
        return sortDirection === "asc" ? "↑" : "↓"
    }

    return (
        <>
            {/* Header */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--knigarela-text)]">Управление на Кутии</h1>
                            <p className="mt-1 text-[var(--knigarela-text-light)]">
                                Създавайте и управлявайте вашите книжни колекции
                            </p>
                        </div>
                        <Link href="/admin/boxes/create">
                            <Button className="bg-[var(--knigarela-pink)] text-white hover:bg-[var(--knigarela-pink)]/90">
                                <Plus className="mr-2 h-5 w-5" />
                                Нова Кутия
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Търсене по име..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="w-full md:w-48">
                            <Select
                                value={filterStatus}
                                onValueChange={(value: "all" | "active" | "inactive") => {
                                    setFilterStatus(value)
                                    setCurrentPage(1)
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Статус" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Всички</SelectItem>
                                    <SelectItem value="active">Активни</SelectItem>
                                    <SelectItem value="inactive">Неактивни</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--knigarela-pink)]"></div>
                        </div>
                    ) : boxes.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-lg text-[var(--knigarela-text-light)]">Няма намерени кутии</p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[var(--knigarela-pink-light)]/20 hover:bg-[var(--knigarela-pink-light)]/20">
                                        <TableHead
                                            className="cursor-pointer font-semibold text-[var(--knigarela-text)] select-none"
                                            onClick={() => handleSort("title")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Заглавие <SortIcon column="title" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer font-semibold text-[var(--knigarela-text)] select-none"
                                            onClick={() => handleSort("isActive")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Статус <SortIcon column="isActive" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer font-semibold text-[var(--knigarela-text)] select-none"
                                            onClick={() => handleSort("count")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Наличност <SortIcon column="count" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer font-semibold text-[var(--knigarela-text)] select-none"
                                            onClick={() => handleSort("singlePrice")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Единична Цена <SortIcon column="singlePrice" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer font-semibold text-[var(--knigarela-text)] select-none"
                                            onClick={() => handleSort("subscriptionPrice")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Абонаментна Цена <SortIcon column="subscriptionPrice" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-right font-semibold text-[var(--knigarela-text)]">Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {boxes.map((box) => (
                                        <TableRow key={box.id} className="hover:bg-[var(--knigarela-bg)]">
                                            <TableCell className="font-medium text-[var(--knigarela-text)]">{box.title}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={box.isActive ? "default" : "secondary"}
                                                    className={
                                                        box.isActive
                                                            ? "bg-[var(--knigarela-pink-light)] text-[var(--knigarela-pink)] border-[var(--knigarela-pink)]"
                                                            : "bg-gray-100 text-gray-600 border-gray-300"
                                                    }
                                                >
                                                    {box.isActive ? "Активна" : "Неактивна"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[var(--knigarela-text-light)]">{box.count} бр.</TableCell>
                                            <TableCell className="text-[var(--knigarela-text-light)]">
                                                {box.singlePrice.toFixed(2)} лв.
                                            </TableCell>
                                            <TableCell className="text-[var(--knigarela-text-light)]">
                                                {box.subscriptionPrice.toFixed(2)} лв.
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/boxes/${box.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-[var(--knigarela-pink)] bg-transparent text-[var(--knigarela-pink)] hover:bg-[var(--knigarela-pink-light)]/50"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(box)}
                                                        className="border-red-500 text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
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
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Изтриване на кутия</AlertDialogTitle>
                        <AlertDialogDescription>
                            Сигурни ли сте, че искате да изтриете кутията "{boxToDelete?.title}"? Това действие не може да бъде
                            отменено.
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
        </>
    )
}
