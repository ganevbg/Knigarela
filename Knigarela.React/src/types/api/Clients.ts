import { ClientAddress } from "./ClientAddress"

export type Client = {
    id: string
    fullName: string,
    email: string
    phone: string
    subscriptionDate: string
}

export interface ClientAllDto extends Client {
    subscriptionCancellationCount: number;
    isSubscribed: boolean;
    isNewSubscriber: boolean; 
    defaultAddressText: string | null;
    defaultAddress: ClientAddress | null;
}