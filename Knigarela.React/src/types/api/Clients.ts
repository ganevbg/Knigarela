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
    defaultAddress: string | null;
}