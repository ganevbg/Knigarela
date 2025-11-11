import { api } from "@/lib/api";

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


export async function getById(id: string) {
    const { data } = await api.get(`/api/boxes/admin/${id}`);
    return data;
}

export async function create(formData: any) {
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

export async function update(formData: any) {
    const req = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        singlePrice: formData.singlePrice,
        subscriptionPrice: formData.subscriptionPrice,
        count: formData.count,
        isActive: formData.isActive,
    };

    const { data } = await api.put(`/api/boxes/${req.id}`, req);
    return data;
}

export async function deleteBox(id: string) {
    const { data } = await api.delete(`/api/boxes/admin/${id}`);
    return data;
}
