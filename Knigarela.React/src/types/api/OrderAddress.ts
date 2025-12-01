export type OrderAddress = {
    siteId: string | null;
    siteName: string;
    officeId: string | null;
    officeName: string;
    addressText: string;
    deliveryType: "courier" | "personal";
    isDefault: boolean;
};