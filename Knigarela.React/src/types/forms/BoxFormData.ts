import { BoxImage } from "../api/BoxImage";

export interface BoxFormData {
    id: string;
    title: string;
    description: string;
    singlePrice: number;
    subscriptionPrice: number;
    isActive: boolean;
    count: number;
    images: BoxImage[];
}