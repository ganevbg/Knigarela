import { api } from "@/lib/api";
import type { ClientAllDto } from "@/types/api"

export async function getAllClients(params:any) {
    const { data } = await api.post("/api/clients/admin/query", params);
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

export async function getClientAddressesById(id: string, params: any) {
    const { data } = await api.post(`/api/admin/clients/${id}/addresses/query`, params);
    return data;
}

export async function getClientAddressById(clientId: string, id: string) {
    const { data } = await api.get(`/api/admin/clients/${clientId}/addresses/${id}`);
    return data;
}

export async function createClientAddress(clientId: string, formData: any) {
    const req = {
        siteId: formData.siteId || null,
        siteName: formData.siteName,
        officeId: formData.officeId || null,
        officeName: formData.officeName,
        addressText: formData.addressText,
        deliveryType: formData.deliveryType,
        isDefault: formData.isDefault,
    };

    const { data } = await api.post(`/api/admin/clients/${clientId}/addresses`, req);
    return data;
}

export async function updateClientAddress(clientId: string, formData: any) {
    const req = {
        siteId: formData.siteId || null,
        siteName: formData.siteName,
        officeId: formData.officeId || null,
        officeName: formData.officeName,
        addressText: formData.addressText,
        deliveryType: formData.deliveryType,
        isDefault: formData.isDefault,
    };

    const { data } = await api.put(`/api/admin/clients/${clientId}/addresses/${formData.id}`, req);
    return data;
}


export async function deleteClientAddressById(clientId: string, id: string) {
    const { data } = await api.delete(`/api/admin/clients/${clientId}/addresses/${id}`);
    return data;
}
