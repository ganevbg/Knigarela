import { api } from "@/lib/api";

export async function listImages(boxId: string) {
    const { data } = await api.get(`/api/boxes/${boxId}/images`);
    return data;
}

export async function uploadImage(boxId: string, file: File, isMain = false) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("isMain", String(isMain));

    const { data } = await api.post(`/api/boxes/${boxId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}

export async function deleteImage(boxId: string, imageId: string) {
    await api.delete(`/api/boxes/${boxId}/images/${imageId}`);
}

export async function reorderImages(boxId: string, items: { imageId: string; sortOrder: number }[]) {
    await api.post(`/api/boxes/${boxId}/images/reorder`, { items });
}

export async function setMainImage(boxId: string, imageId: string) {
    await api.post(`/api/boxes/${boxId}/images/${imageId}/main`);
}
