import type { BoxImage } from "@/types";
import { resolveImageUrl } from "@/lib/utils";

export function ResponsiveImg({
    image,
    alt,
    sizes,
    className,
    priority,
}: {
    image?: BoxImage | null;
    alt: string;
    sizes: string;
    className?: string;
    priority?: boolean;
}) {
    const fallback = "/placeholder.svg";

    if (!image) {
        return (
            <img
                src={fallback}
                alt={alt}
                className={className}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
            />
        );
    }

    return (
        <img
            src={resolveImageUrl(image.url) || fallback}
            srcSet={[
                `${resolveImageUrl(image.thumbnailUrl)} 480w`,
                `${resolveImageUrl(image.url)} 1024w`,
                `${resolveImageUrl(image.largeUrl)} 1920w`,
            ].join(", ")}
            sizes={sizes}
            alt={alt}
            className={className}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
        />
    );
}
