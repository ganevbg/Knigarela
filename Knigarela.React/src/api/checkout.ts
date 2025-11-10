import { api } from "@/lib/api";

export async function saveOrder(formData: any) {

    var req = {
        FullName: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Address:
        {
            deliveryType: formData.addressType,
            siteId: `${formData.siteId}`,
            siteName: formData.site,
            addressText: formData.address,
            officeId: `${formData.officeId}`,
            officeName: formData.office,
        },
        Notes: ""
    };

    const { data } = await api.post(`/api/order/from-cart`, req);
    return data;
}
