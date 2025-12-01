import { OrderAddress } from "@/types/api";

export interface OrderItem {
    id: string;
    boxId: string;
    boxTitle: string;
    quantity: number;
    price: number;
    purchaseType: "subscription" | "single";
}
export interface AdminOrder {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: OrderAddress;
    items: OrderItem[];
}