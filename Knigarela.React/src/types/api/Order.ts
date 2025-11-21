export interface Order {
    id: string;
    number: string;
    clientName: string;
    address: string;
    status: "new" | "processing" | "shipped" | "delivered" | "cancelled";
    totalAmount: number;
    date: string;
}