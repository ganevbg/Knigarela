"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, X, GripVertical, Save, Star } from "lucide-react";
import { getById, create, update } from "@/api/boxes";
import {
    listImages,
    uploadImage,
    deleteImage,
    reorderImages,
    setMainImage,
} from "@/api/boxImages";

import { resolveImageUrl } from "@/lib/utils";

interface BoxImage {
    id: string;
    url: string;
    sortOrder: number;
    isMain: boolean;
}

interface BoxFormData {
    id: string;
    title: string;
    description: string;
    singlePrice: string;
    subscriptionPrice: string;
    isActive: boolean;
    count: string;
    images: BoxImage[];
}

export default function AdminBoxFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = params.id !== "create";
    const boxId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const [formData, setFormData] = useState<BoxFormData>({
        id: "",
        title: "",
        description: "",
        singlePrice: "",
        subscriptionPrice: "",
        isActive: false,
        count: "",
        images: [],
    });

    // Load box + images when editing
    useEffect(() => {
        if (isEdit) {
            const loadBox = async () => {
                setLoading(true);
                const data = await getById(boxId);
                const imgs = await listImages(boxId);
                setFormData({ ...data, images: imgs });
                setLoading(false);
            };
            loadBox();
        }
    }, [isEdit]);

    const handleInputChange = (field: keyof BoxFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Ensure box exists before uploading
    const ensureBoxExists = async (): Promise<string> => {
        if (formData.id) return formData.id;

        const created = await create({
            title: formData.title || "Нова кутия",
            description: formData.description || "",
            singlePrice: formData.singlePrice || "0",
            subscriptionPrice: formData.subscriptionPrice || "0",
            isActive: false,
            count: formData.count || "0",
        });

        setFormData((prev) => ({ ...prev, id: created.id }));

        router.replace(`/admin/boxes/${created.id}`); // Move to edit mode
        return created.id;
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const ensuredId = await ensureBoxExists();

        // Upload all images in parallel
        const uploadedImages = await Promise.all(
            Array.from(files).map(async (file) => {
                const uploaded = await uploadImage(ensuredId, file);
                return uploaded as BoxImage;
            })
        );

        // Update form data once after all uploads complete
        setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), ...uploadedImages],
        }));
    };


    const handleImageDelete = async (imageId: string) => {
        if (!formData.id) return;
        await deleteImage(formData.id, imageId);
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img.id !== imageId),
        }));
    };

    const handleSetMainImage = async (imageId: string) => {
        await setMainImage(formData.id, imageId);

        setFormData((prev) => ({
            ...prev,
            images: prev.images.map((img) => ({
                ...img,
                isMain: img.id === imageId,
            })),
        }));
    }

    const handleDragStart = (index: number) => setDraggedIndex(index);

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...formData.images];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);

        const reordered = newImages.map((img, i) => ({ ...img, order: i }));
        setFormData((prev) => ({ ...prev, images: reordered }));
        setDraggedIndex(index);
    };

    const handleDragEnd = async () => {
        if (!formData.id || !formData.images.length) return;
        setDraggedIndex(null);
        await reorderImages(
            formData.id,
            formData.images.map((img, idx) => ({
                imageId: img.id,
                sortOrder: idx,
            }))
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let savedBox: BoxFormData;
            if (isEdit) {
                savedBox = await update(formData);
            } else {
                savedBox = await create(formData);
                setFormData((prev) => ({ ...prev, id: savedBox.id }));
                router.replace(`/admin/boxes/${savedBox.id}`);
            }
            router.push("/admin/boxes");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--knigarela-bg)]">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--knigarela-pink)]"></div>
            </div>
        );
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
                    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                            <h2 className="text-xl font-semibold text-[var(--knigarela-text)]">Снимки на Продукти</h2>
                            <Label htmlFor="imageUpload" className="cursor-pointer">
                                <div className="flex items-center gap-2 rounded-lg bg-[var(--knigarela-pink-light)]/30 px-4 py-2 text-[var(--knigarela-pink)] transition-colors hover:bg-[var(--knigarela-pink-light)]/50">
                                    <Upload className="h-4 w-4" />
                                    <span className="text-sm font-medium">Качете Снимки</span>
                                </div>
                                <Input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </Label>
                        </div>

                        <p className="text-sm text-[var(--knigarela-text-light)]">
                            Качете снимки на продуктите в кутията. Плъзгайте снимките, за да ги подредите. Кликнете на звездичката, за
                            да изберете главна снимка.
                        </p>

                        {formData.images.length === 0 ? (
                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                                <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <p className="mb-2 text-[var(--knigarela-text-light)]">Няма качени снимки</p>
                                <Label htmlFor="imageUpload" className="cursor-pointer">
                                    <span className="text-[var(--knigarela-pink)] hover:underline">Качете снимки</span>
                                </Label>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {formData.images.map((image, index) => (
                                    <div
                                        key={image.id}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-move ${draggedIndex === index
                                            ? "border-[var(--knigarela-pink)] opacity-50"
                                            : image.isMain
                                                ? "border-[var(--knigarela-pink)] ring-2 ring-[var(--knigarela-pink)]/30"
                                                : "border-gray-200 hover:border-[var(--knigarela-pink)]"
                                            }`}
                                    >
                                        <div className="relative aspect-square bg-gray-100">
                                            <Image
                                                src={resolveImageUrl(image.url) || "/placeholder.svg"}
                                                alt={`Product ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Order Badge */}
                                        <div className="absolute top-2 left-2 rounded bg-white/90 px-2 py-1 text-xs font-semibold text-[var(--knigarela-text)] backdrop-blur-sm">
                                            #{index + 1}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleSetMainImage(image.id)}
                                            className={`absolute top-2 right-2 p-1.5 rounded transition-all ${image.isMain

                                                ? "bg-[var(--knigarela-pink)] text-white"
                                                : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-[var(--knigarela-pink)]"
                                                }`}
                                            title={image.isMain ? "Главна снимка" : "Задай като главна"}
                                        >
                                            <Star className={`w-4 h-4 ${image.isMain ? "fill-current" : ""}`} />
                                        </button>

                                        {/* Drag Handle */}
                                        <div className="absolute bottom-2 left-2 rounded bg-white/90 p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                            <GripVertical className="h-4 w-4 text-[var(--knigarela-text)]" />
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleImageDelete(image.id)}
                                            className="absolute bottom-2 right-2 bg-red-500 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
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
    );
}
