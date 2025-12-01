import { api } from "@/lib/api";
import { Checkout } from "@/types/api"

export async function saveOrder(formData: Checkout) {

    var req = {
        FullName: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Address:
        {
            deliveryType: formData.address.deliveryType,
            siteId: formData.address.siteId || null,
            siteName: formData.address.siteName,
            addressText: formData.address.addressText,
            officeId: formData.address.officeId || null,
            officeName: formData.address.officeName,
            isDefault: formData.address.isDefault|| true,
        },
        Notes: ""
    };

    const { data } = await api.post(`/api/order/from-cart`, req);
    return data;
}

export async function getOrder(id: string) {
    const { data } = await api.get(`/api/order/${id}`);
    return data;
}
export async function getAdminOrder(id: string) {
    const { data } = await api.get(`/api/order/admin/${id}`);
    return data;
}

export async function getOrders(params: any)  {
    const { data } = await api.post(`/api/order/admin/query`, params);
    return data;
}

export async function create(formData: any) {
    const req = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: formData.items,
        };
    const { data } = await api.post("/api/order", req);
    return data;
}

export async function update(formData: any) {
    const req = {
        id: formData.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: formData.items,
    };
    const { data } = await api.put(`/api/order/${formData.id}`, req);
    return data;
}
