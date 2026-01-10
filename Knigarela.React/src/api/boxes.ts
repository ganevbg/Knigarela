import { api } from "@/lib/api";
import { Box, BoxImage } from "@/types/api";
import { BoxFormData } from "@/types/forms/BoxFormData";

export async function getActiveBox() {
  const { data } = await api.get("/api/boxes/active");
  return data;
}

export async function getBoxBySlug(slug: string) : Promise<Box> {
    const { data } = await api.get(`/api/boxes/${slug}`);

    const images: BoxImage[] = data.imageUrls.map((url: string, index: number) => ({
        url,
        sortOrder: index
    }))

    const box: Box = {
        id: data.id,
        title: data.title,
        description: data.description,
        singlePrice: data.singlePrice,
        subscriptionPrice: data.subscriptionPrice,
        count: data.count,
        isActive: data.isActive,
        slug: data.slug,
        mainImage: data.mainImage,
        available: data.available,
        images: images
    };

    return box;
}

export async function getNotActiveBoxes() {
    const { data } = await api.get("/api/boxes/previous");
    return data;
}

export async function getAllBoxes() {
    const { data } = await api.get("/api/boxes");
    return data;
}

export async function getAllAdmin(params: any) {
    const { data } = await api.post("/api/boxes/admin/query", params);
    return data;
}


export async function getById(id: string): Promise<Box> {
    const { data } = await api.get(`/api/boxes/admin/${id}`);
    return data;
}

export async function create(formData: BoxFormData): Promise<Box> {
    const req = {
        title: formData.title,
        description: formData.description,
        singlePrice: formData.singlePrice,
        subscriptionPrice: formData.subscriptionPrice,
        count: formData.count,
        isActive: formData.isActive,
    };

    const { data } = await api.post("/api/boxes", req);
    return data;
}

export async function update(formData: BoxFormData): Promise<Box> {
    const req = {
        title: formData.title,
        description: formData.description,
        singlePrice: formData.singlePrice,
        subscriptionPrice: formData.subscriptionPrice,
        count: formData.count,
        isActive: formData.isActive,
    };

    const { data } = await api.put(`/api/boxes/${formData.id}`, req);
    return data;
}

export async function deleteBox(id: string) {
    const { data } = await api.delete(`/api/boxes/admin/${id}`);
    return data;
}
