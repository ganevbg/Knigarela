"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import { getAdminOrder, create, update } from "@/api/orders"
import { getAllClients } from "@/api/clients"
import { getAllAdmin } from "@/api/boxes"
import { AdminOrder, OrderItem, ClientAllDto, Box } from "@/types/api"
import AddressPicker from "@/components/address/AddressPicker"
import { PaginationParams } from "@/types/common/PaginationParams"
import { formatPrice } from "../../../../lib/utils"

const searchClients = async (query: string) => {
    var params: PaginationParams<keyof ClientAllDto> = {
        filters: {
            name: query
        },
        sortColumn: "fullName",
        sortDirection: "asc",
        page: 1,
        itemsPerPage: 10,
    }

    var result = await getAllClients(params);
    return result.data;
}

const searchBoxes = async (query: string) => {
    var params: PaginationParams<keyof Box> = {
        filters: {
            title: query
        },
        sortColumn: "title",
        sortDirection: "asc",
        page: 1,
        itemsPerPage: 10,
    }

    var result = await getAllAdmin(params);
    return result.data;
}

export default function AdminOrderFormPage() {
    const router = useRouter()
    const params = useParams()
    const isEdit = params.id !== "create"
    const orderId = params.id as string

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    const [clientQuery, setClientQuery] = useState("")
    const [clientResults, setClientResults] = useState<ClientAllDto[]>([])
    const [showClientResults, setShowClientResults] = useState(false)

    const [boxQuery, setBoxQuery] = useState("")
    const [boxResults, setBoxResults] = useState<Box[]>([])
    const [showBoxResults, setShowBoxResults] = useState(false)
    const [selectedBox, setSelectedBox] = useState<Box | null>(null)
    const [purchaseType, setPurchaseType] = useState<"single" | "subscription">("single")
    const [quantity, setQuantity] = useState(1)

    const [formData, setFormData] = useState<AdminOrder>({
        id: "",
        fullName: "",
        email: "",
        phone: "",
        address: {
            deliveryType: "courier",
            siteId: null,
            siteName: "",
            addressText: "",
            officeId: null,
            officeName: "",
            isDefault: true,
        },
        items: [],
    })

    useEffect(() => {
        if (isEdit) {
            const loadOrder = async () => {
                debugger;
                setLoading(true)
                const data = await getAdminOrder(orderId)
                setFormData({ ...data })
                setClientQuery(data.fullName)
                setLoading(false)
            }
            loadOrder()
        }
    }, [isEdit, orderId])

    const handleClientSearch = async (query: string) => {
        setClientQuery(query)
        if (query.length < 2) {
            setClientResults([])
            setShowClientResults(false)
            return
        }

        const results = await searchClients(query)
        setClientResults(results)
        setShowClientResults(true)
    }

    const selectClient = (client: any) => {
        setFormData({
            ...formData,
            fullName: client.fullName,
            email: client.email,
            phone: client.phone,
            address: {
                ...formData.address,
                ...client.defaultAddress,
            },
        })
        setClientQuery(client.fullName)
        setShowClientResults(false)
    }

    const handleBoxSearch = async (query: string) => {
        setBoxQuery(query)
        if (query.length < 2) {
            setBoxResults([])
            setShowBoxResults(false)
            return
        }

        const results = await searchBoxes(query)
        setBoxResults(results)
        setShowBoxResults(true)
    }

    const selectBox = (box: any) => {
        setSelectedBox(box)
        setBoxQuery(box.title)
        setShowBoxResults(false)
    }

    const addItemToOrder = () => {
        if (!selectedBox) return

        const newItem: OrderItem = {
            id: crypto.randomUUID(),
            boxId: selectedBox.id,
            boxTitle: selectedBox.title,
            purchaseType: purchaseType,
            price: purchaseType === "single" ? selectedBox.singlePrice : selectedBox.subscriptionPrice,
            quantity,
        }

        setFormData({
            ...formData,
            items: [...formData.items, newItem],
        })

        // Reset selection
        setSelectedBox(null)
        setBoxQuery("")
        setPurchaseType("single")
        setQuantity(1)
    }

    const removeItem = (itemId: string) => {
        setFormData({
            ...formData,
            items: formData.items.filter((item) => item.id !== itemId),
        })
    }

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    const handleInputChange = (field: keyof AdminOrder, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            let savedOrder: AdminOrder
            if (isEdit) {
                savedOrder = await update(formData)
            } else {
                savedOrder = await create(formData)
                setFormData((prev) => ({ ...prev, id: savedOrder.id }))
                router.replace(`/admin/orders/${savedOrder.id}`)
            }
            router.push("/admin/orders")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--knigarela-bg)]">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--knigarela-pink)]"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--knigarela-bg)]">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/orders">
                            <Button variant="outline" size="icon" className="border-gray-300 bg-transparent">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--knigarela-text)]">
                                {isEdit ? "Редактиране на Поръчка" : "Създаване на Нова Поръчка"}
                            </h1>
                            <p className="mt-1 text-[var(--knigarela-text-light)]">
                                {isEdit ? "Актуализирайте информацията за поръчка" : "Добавете нова поръчка"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-[var(--knigarela-text)]">
                            Основна Информация
                        </h2>

                        <div className="relative space-y-2">
                            <Label htmlFor="fullName" className="text-[var(--knigarela-text)]">
                                Имена <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                value={clientQuery}
                                onChange={(e) => { handleClientSearch(e.target.value); handleInputChange("fullName", e.target.value); } }
                                onFocus={() => clientQuery.length >= 2 && setShowClientResults(true)}
                                placeholder="Започнете да пишете име на клиент..."
                                required
                                className="border-gray-300"
                                autoComplete="off"
                            />
                            {showClientResults && clientResults.length > 0 && (
                                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                                    {clientResults.map((client) => (
                                        <button
                                            key={client.id}
                                            type="button"
                                            onClick={() => selectClient(client)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                        >
                                            <div className="font-medium text-[var(--knigarela-text)]">{client.fullName}</div>
                                            <div className="text-sm text-[var(--knigarela-text-light)]">
                                                {client.email} • {client.phone}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[var(--knigarela-text)]">
                                Електронна поща <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="Въведете електронна поща на клиента"
                                required
                                className="border-gray-300"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-[var(--knigarela-text)]">
                                Телефон <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="Въведете телефон на клиента"
                                required
                                className="border-gray-300"
                            />
                        </div>

                        <div className="space-y-4">
                            <AddressPicker
                                value={{
                                    siteId: formData.address.siteId || null,
                                    siteName: formData.address.siteName,
                                    officeId: formData.address.officeId || null,
                                    officeName: formData.address.officeName,
                                    addressText: formData.address.addressText,
                                    deliveryType: formData.address.deliveryType,
                                }}
                                onChange={(partial) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        address: {
                                            ...prev.address,
                                            ...partial,
                                        },
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-[var(--knigarela-text)]">
                            Артикули в Поръчката
                        </h2>

                        {/* Add Item Form */}
                        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                            <h3 className="font-medium text-[var(--knigarela-text)]">Добавяне на артикул</h3>

                            {/* Box Search */}
                            <div className="relative space-y-2">
                                <Label htmlFor="box" className="text-[var(--knigarela-text)]">
                                    Кутия
                                </Label>
                                <Input
                                    id="box"
                                    type="text"
                                    value={boxQuery}
                                    onChange={(e) => handleBoxSearch(e.target.value)}
                                    onFocus={() => boxQuery.length >= 2 && setShowBoxResults(true)}
                                    placeholder="Започнете да пишете име на кутия..."
                                    className="border-gray-300"
                                    autoComplete="off"
                                />
                                {showBoxResults && boxResults.length > 0 && (
                                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                                        {boxResults.map((box) => (
                                            <button
                                                key={box.id}
                                                type="button"
                                                onClick={() => selectBox(box)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                            >
                                                <div className="font-medium text-[var(--knigarela-text)]">{box.title}</div>
                                                <div className="text-sm text-[var(--knigarela-text-light)]">
                                                    Единична: {box.singlePrice} лв. • Абонамент: {box.subscriptionPrice} лв./месец
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedBox && (
                                <>
                                    {/* Purchase Type */}
                                    <div className="space-y-2">
                                        <Label className="text-[var(--knigarela-text)]">Тип покупка</Label>
                                        <div className="flex gap-4">
                                            <label className="flex cursor-pointer items-center gap-2">
                                                <input
                                                    type="radio"
                                                    value="single"
                                                    checked={purchaseType === "single"}
                                                    onChange={(e) => setPurchaseType(e.target.value as "single" | "subscription")}
                                                    className="w-4 h-4 text-[var(--knigarela-pink)] focus:ring-[var(--knigarela-pink)]"
                                                />
                                                <span className="text-[var(--knigarela-text)]">Единична ({selectedBox.singlePrice} лв.)</span>
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-2">
                                                <input
                                                    type="radio"
                                                    value="subscription"
                                                    checked={purchaseType === "subscription"}
                                                    onChange={(e) => setPurchaseType(e.target.value as "single" | "subscription")}
                                                    className="w-4 h-4 text-[var(--knigarela-pink)] focus:ring-[var(--knigarela-pink)]"
                                                />
                                                <span className="text-[var(--knigarela-text)]">
                                                    Абонамент ({selectedBox.subscriptionPrice} лв./месец)
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity" className="text-[var(--knigarela-text)]">
                                            Количество
                                        </Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                                            className="border-gray-300 w-32"
                                        />
                                    </div>

                                    {/* Add Button */}
                                    <Button
                                        type="button"
                                        onClick={addItemToOrder}
                                        className="bg-[var(--knigarela-pink)] text-white hover:bg-[var(--knigarela-pink)]/90"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Добавяне
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Items List */}
                        {formData.items.length > 0 ? (
                            <div className="space-y-3">
                                {formData.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                                        <div className="flex-1">
                                            <div className="font-medium text-[var(--knigarela-text)]">{item.boxTitle}</div>
                                            <div className="text-sm text-[var(--knigarela-text-light)]">
                                                {item.purchaseType === "single" ? "Единична покупка" : "Месечен абонамент"} •{item.quantity} бр.
                                                × {formatPrice(item.price, true)} = {formatPrice((item.price * item.quantity), true)}
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                {/* Total */}
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <span className="text-lg font-semibold text-[var(--knigarela-text)]">Обща сума:</span>
                                    <span className="text-2xl font-bold text-[var(--knigarela-pink)]">
                                        {formatPrice(calculateTotal(), true)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="py-8 text-center text-[var(--knigarela-text-light)]">
                                Няма добавени артикули. Използвайте формата по-горе за да добавите кутии към поръчката.
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href="/admin/orders">
                            <Button type="button" variant="outline" className="border-gray-300 bg-transparent">
                                Отказ
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={saving || formData.items.length === 0}
                            className="min-w-32 bg-[var(--knigarela-pink)] text-white hover:bg-[var(--knigarela-pink)]/90"
                        >
                            {saving ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                    <span>Записване...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    <span>{isEdit ? "Запазване" : "Създаване"}</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
