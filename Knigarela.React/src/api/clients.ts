import { api } from "@/lib/api";

export async function getAllClients() {
  const { data } = await api.get("/api/clients");
  return data;
}

export async function getById(id: string) {
    const { data } = await api.get(`/api/clients/${id}`);
    return data;
}

export async function create(formData: any) {
    const req = {
        fullName: formData.fullName,
        Email: formData.email,
        Phone: formData.phone,
        subscriptionDate: formData.subscriptionDate != "" ? formData.subscriptionDate : null,
    };

    const { data } = await api.post("/api/clients", req);
    return data;
}

export async function update(formData: any) {
    const req = {
        fullName: formData.fullName,
        Email: formData.email,
        Phone: formData.phone,
        subscriptionDate: formData.subscriptionDate,
    };

    const { data } = await api.put(`/api/clients/${formData.id}`, req);
    return data;
}

export async function deleteClientById(id: string) {
    const { data } = await api.delete(`/api/clients/${id}`);
    return data;
}

export async function getAddressesById(id: string) {
    const { data } = await api.get(`/api/admin/clients/${id}/addresses`);
    return data;
}

export async function deleteAddressById(clientId: string, id: string) {
    const { data } = await api.delete(`/api/admin/clients/${clientId}/addresses/${id}`);
    return data;
}
