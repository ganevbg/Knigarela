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
    debugger;
    const { data } = await api.post(`/api/order/from-cart`, req);
    return data;
}

export async function getOrder(id: string) {
    const { data } = await api.get(`/api/order/${id}`);
    return data;
}
