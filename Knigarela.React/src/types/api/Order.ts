export interface Order {
    id: string;
    number: string;
    clientName: string;
    status: "new" | "processing" | "shipped" | "delivered" | "cancelled";
    totalAmount: number;
    date: string;
}