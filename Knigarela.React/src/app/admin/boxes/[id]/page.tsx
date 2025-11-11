"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, X, GripVertical, Save } from "lucide-react"
import { getById, create, update } from "@/api/boxes"

interface BoxImage {
    id: string
    url: string
    order: number
}

interface BoxFormData {
    id: string
    title: string
    description: string
    singlePrice: string
    subscriptionPrice: string
    isActive: boolean
    count: string
    //images: BoxImage[]
}

export default function AdminBoxFormPage() {
    const router = useRouter()
    const params = useParams()
    const isEdit = params.id !== "create"
    const boxId = params.id as string

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

    const [formData, setFormData] = useState<BoxFormData>({
        id:"",
        title: "",
        description: "",
        singlePrice: "",
        subscriptionPrice: "",
        isActive: true,
        count: "",
        //images: [],
    })

    // Load box data if editing
    useEffect(() => {
        if (isEdit) {
            const loadBox = async () => {
                setLoading(true)

                var data = await getById(boxId);
                setFormData(data as BoxFormData)
                setLoading(false)
            }

            loadBox()
        }
    }, [isEdit])

    const handleInputChange = (field: keyof BoxFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    //const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //    const files = e.target.files
    //    if (!files) return

    //    // In production, upload images to server and get URLs
    //    const newImages: BoxImage[] = Array.from(files).map((file, index) => ({
    //        id: `new-${Date.now()}-${index}`,
    //        url: URL.createObjectURL(file),
    //        order: formData.images.length + index,
    //    }))

    //    setFormData((prev) => ({
    //        ...prev,
    //        images: [...prev.images, ...newImages],
    //    }))
    //}

    //const handleImageDelete = (imageId: string) => {
    //    setFormData((prev) => ({
    //        ...prev,
    //        images: prev.images.filter((img) => img.id !== imageId).map((img, index) => ({ ...img, order: index })),
    //    }))
    //}

    //const handleDragStart = (index: number) => {
    //    setDraggedIndex(index)
    //}

    //const handleDragOver = (e: React.DragEvent, index: number) => {
    //    e.preventDefault()

    //    if (draggedIndex === null || draggedIndex === index) return

    //    const newImages = [...formData.images]
    //    const draggedImage = newImages[draggedIndex]

    //    newImages.splice(draggedIndex, 1)
    //    newImages.splice(index, 0, draggedImage)

    //    // Update order
    //    const reorderedImages = newImages.map((img, idx) => ({ ...img, order: idx }))

    //    setFormData((prev) => ({ ...prev, images: reorderedImages }))
    //    setDraggedIndex(index)
    //}

    //const handleDragEnd = () => {
    //    setDraggedIndex(null)
    //}

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)


        if (isEdit) {
            await update(formData);
        } else {
            await create(formData);
        }
        setSaving(false)
        router.push("/admin/boxes")
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
                        <Link href="/admin/boxes">
                            <Button variant="outline" size="icon" className="border-gray-300 bg-transparent">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--knigarela-text)]">
                                {isEdit ? "Редактиране на Кутия" : "Създаване на Нова Кутия"}
                            </h1>
                            <p className="mt-1 text-[var(--knigarela-text-light)]">
                                {isEdit ? "Актуализирайте информацията за кутията" : "Добавете нова книжна колекция"}
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

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-[var(--knigarela-text)]">
                                Заглавие <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Въведете заглавие на кутията"
                                required
                                className="border-gray-300"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-[var(--knigarela-text)]">
                                Описание <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Въведете подробно описание на кутията"
                                required
                                rows={6}
                                className="border-gray-300 resize-none"
                            />
                            <p className="text-sm text-[var(--knigarela-text-light)]">{formData.description.length} знака</p>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
                                className="border-[var(--knigarela-pink)] data-[state=checked]:bg-[var(--knigarela-pink)] data-[state=checked]:text-white"
                            />
                            <Label htmlFor="isActive" className="cursor-pointer text-[var(--knigarela-text)]">
                                Активна кутия (показва се в сайта)
                            </Label>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-[var(--knigarela-text)]">
                            Цени и Наличност
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Single Price */}
                            <div className="space-y-2">
                                <Label htmlFor="singlePrice" className="text-[var(--knigarela-text)]">
                                    Единична Цена (лв.) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="singlePrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.singlePrice}
                                    onChange={(e) => handleInputChange("singlePrice", e.target.value)}
                                    placeholder="49.99"
                                    required
                                    className="border-gray-300"
                                />
                            </div>

                            {/* Subscription Price */}
                            <div className="space-y-2">
                                <Label htmlFor="subscriptionPrice" className="text-[var(--knigarela-text)]">
                                    Абонаментна Цена (лв.) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="subscriptionPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.subscriptionPrice}
                                    onChange={(e) => handleInputChange("subscriptionPrice", e.target.value)}
                                    placeholder="44.99"
                                    required
                                    className="border-gray-300"
                                />
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                                <Label htmlFor="quantity" className="text-[var(--knigarela-text)]">
                                    Наличност (бр.) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="0"
                                    value={formData.count}
                                    onChange={(e) => handleInputChange("count", e.target.value)}
                                    placeholder="150"
                                    required
                                    className="border-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    {/*<div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">*/}
                    {/*    <div className="flex items-center justify-between border-b border-gray-200 pb-3">*/}
                    {/*        <h2 className="text-xl font-semibold text-[var(--knigarela-text)]">Снимки на Продукти</h2>*/}
                    {/*        <Label htmlFor="imageUpload" className="cursor-pointer">*/}
                    {/*            <div className="flex items-center gap-2 rounded-lg bg-[var(--knigarela-pink-light)]/30 px-4 py-2 text-[var(--knigarela-pink)] transition-colors hover:bg-[var(--knigarela-pink-light)]/50">*/}
                    {/*                <Upload className="h-4 w-4" />*/}
                    {/*                <span className="text-sm font-medium">Качете Снимки</span>*/}
                    {/*            </div>*/}
                    {/*            <Input*/}
                    {/*                id="imageUpload"*/}
                    {/*                type="file"*/}
                    {/*                accept="image/*"*/}
                    {/*                multiple*/}
                    {/*                onChange={handleImageUpload}*/}
                    {/*                className="hidden"*/}
                    {/*            />*/}
                    {/*        </Label>*/}
                    {/*    </div>*/}

                    {/*    <p className="text-sm text-[var(--knigarela-text-light)]">*/}
                    {/*        Качете снимки на продуктите в кутията. Плъзгайте снимките, за да ги подредите.*/}
                    {/*    </p>*/}

                    {/*    {formData.images.length === 0 ? (*/}
                    {/*        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">*/}
                    {/*            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />*/}
                    {/*            <p className="mb-2 text-[var(--knigarela-text-light)]">Няма качени снимки</p>*/}
                    {/*            <Label htmlFor="imageUpload" className="cursor-pointer">*/}
                    {/*                <span className="text-[var(--knigarela-pink)] hover:underline">Качете снимки</span>*/}
                    {/*            </Label>*/}
                    {/*        </div>*/}
                    {/*    ) : (*/}
                    {/*        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">*/}
                    {/*            {formData.images.map((image, index) => (*/}
                    {/*                <div*/}
                    {/*                    key={image.id}*/}
                    {/*                    draggable*/}
                    {/*                    onDragStart={() => handleDragStart(index)}*/}
                    {/*                    onDragOver={(e) => handleDragOver(e, index)}*/}
                    {/*                    onDragEnd={handleDragEnd}*/}
                    {/*                    className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-move ${draggedIndex === index*/}
                    {/*                            ? "border-[var(--knigarela-pink)] opacity-50"*/}
                    {/*                            : "border-gray-200 hover:border-[var(--knigarela-pink)]"*/}
                    {/*                        }`}*/}
                    {/*                >*/}
                    {/*                    <div className="relative aspect-square bg-gray-100">*/}
                    {/*                        <Image*/}
                    {/*                            src={image.url || "/placeholder.svg"}*/}
                    {/*                            alt={`Product ${index + 1}`}*/}
                    {/*                            fill*/}
                    {/*                            className="object-cover"*/}
                    {/*                        />*/}
                    {/*                    </div>*/}

                    {/*                    */}{/* Order Badge */}
                    {/*                    <div className="absolute top-2 left-2 rounded bg-white/90 px-2 py-1 text-xs font-semibold text-[var(--knigarela-text)] backdrop-blur-sm">*/}
                    {/*                        #{index + 1}*/}
                    {/*                    </div>*/}

                    {/*                    */}{/* Drag Handle */}
                    {/*                    <div className="absolute top-2 right-2 rounded bg-white/90 p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">*/}
                    {/*                        <GripVertical className="h-4 w-4 text-[var(--knigarela-text)]" />*/}
                    {/*                    </div>*/}

                    {/*                    */}{/* Delete Button */}
                    {/*                    <button*/}
                    {/*                        type="button"*/}
                    {/*                        onClick={() => handleImageDelete(image.id)}*/}
                    {/*                        className="absolute bottom-2 right-2 bg-red-500 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"*/}
                    {/*                    >*/}
                    {/*                        <X className="h-4 w-4" />*/}
                    {/*                    </button>*/}
                    {/*                </div>*/}
                    {/*            ))}*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</div>*/}

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href="/admin/boxes">
                            <Button type="button" variant="outline" className="border-gray-300 bg-transparent">
                                Отказ
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={saving}
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
