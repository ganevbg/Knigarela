import { api } from "@/lib/api";

export interface AddToCartResponse {
    success: boolean;
    message?: string;
    availableQuantity?: number;
}

export async function addToCart(
    boxId: string,
    quantity: number = 1,
    purchaseType: string = "single"
): Promise<AddToCartResponse> {
    const cartItem = { boxId, quantity, purchaseType };
    debugger;
    try {
        const response = await api.post("/api/cart/add", cartItem);
        return {
            success: true,
            message: "Успешно добавяне в количката."
        };
    } catch (error: any) {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 409 && data.error === "InsufficientStock") {
                return {
                    success: false,
                    message: `Няма достатъчна наличност. Налични са ${data.availableQuantity} броя.`,
                    availableQuantity: data.availableQuantity,
                };
            }

            if (status === 400) {
                return {
                    success: false,
                    message: data.message || "Invalid cart request.",
                };
            }

            return {
                success: false,
                message: data.message || "Failed to add to cart.",
            };
        }

        return {
            success: false,
            message: "Network error - please try again.",
        };
    }
}

export async function getCart() {
    const { data } = await api.get("/api/cart");
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
