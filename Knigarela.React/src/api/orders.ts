import { api } from "@/lib/api";
import { Checkout, Calculate } from "@/types/api"
import { Order } from "@/types/api"

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


export async function deleteOrder(id: string) {
    const { data } = await api.delete(`/api/order/admin/${id}`);
    return data;
}

export async function createRequestsForNewOrders() : Promise<string> {
    const { data } = await api.post(`/api/order/generate-requests`);
    return data.jobId;
}

export async function printLabels(item: Order, paperSize: string) {
    const response = await api.post(`api/order/admin/print-labels/${item.id}?size=${paperSize}`, null);

    const base64 = response.data.file;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${base64}`;
    link.download = `labels-${item.orderNumber}.pdf`;
    link.click();
}

export async function printAllLabels(paperSize: string) {
    const response = await api.post(
        `/api/order/admin/print-all-labels?size=${paperSize}`,
        null,
        { responseType: "arraybuffer" }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `labels-${paperSize}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
}




export async function CalculateDeliveryFee(req: Calculate) : Promise<number> {
    const { data } = await api.post(`/api/cart/calculate`, req);
    return data.deliveryPrice;
}