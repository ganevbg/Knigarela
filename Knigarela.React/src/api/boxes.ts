import { api } from "@/lib/api";
import { Box } from "@/types/api/Box";
import { BoxFormData } from "@/types/forms/BoxFormData";

export async function getActiveBox() {
  const { data } = await api.get("/api/boxes/active");
  return data;
}

export async function getBoxBySlug(slug: string) {
    const { data } = await api.get(`/api/boxes/${slug}`);
    return data;
}

export async function getNotActiveBoxes() {
    const { data } = await api.get("/api/boxes/previous");
    return data;
}

export async function getAllBoxes() {
    const { data } = await api.get("/api/boxes");
    return data;
}

export async function getAllAdmin() {
    const { data } = await api.get("/api/boxes/admin");
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
