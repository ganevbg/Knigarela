import { ClientAddress } from "@/types/api"

export type Checkout = {
    name: string,
    email: string,
    phone: string,
    address: ClientAddress,
}