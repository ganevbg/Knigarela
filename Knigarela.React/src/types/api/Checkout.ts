import { ClientAddress } from "@/types/api"

export type Checkout = {
    name: string,
    email: string,
    phone: string,
    address: ClientAddress,
}

export type Calculate = {
    deliveryType: string,
    officeId: string | null,
    siteId: string | null,
    addressText: string | null,
}