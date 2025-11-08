import { api } from "@/lib/api";

export async function getCart() {
    const { data } = await api.get("/api/cart");
    return data;
}

export async function addToCart(boxId: string, quantity: number = 1, purchaseType: string = "single") {
    const cartItem = { boxId, quantity, purchaseType };
    const { data } = await api.post("/api/cart/add", cartItem);
    return data;
}

export async function removeFromCart(boxId: string, purchaseType: string = "single") {
    const cardDto = { boxId, purchaseType };
    const { data } = await api.post("/api/cart/remove", cardDto, {
        headers: { "Content-Type": "application/json" },
    });
    return data;
}

export async function clearCart() {
    const { data } = await api.post("/api/cart/clear");
    return data;
}
