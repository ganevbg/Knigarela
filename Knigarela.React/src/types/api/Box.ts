import { BoxImage } from "./BoxImage";

export interface Box {
    id: string;
    title: string;
    slug: string;
    mainImage: BoxImage;
    available: boolean;
    description: string;
    singlePrice: number;
    subscriptionPrice: number;
    isActive: boolean;
    count: number;
    images: BoxImage[];
}