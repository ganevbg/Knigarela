"use client";
import { resolveImageUrl } from "@/lib/utils";

export function HeroVideo() {
  return (
      <div className="relative aspect-video w-full overflow-hidden bg-white md:h-200">
          <video
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
          >
              <source src={resolveImageUrl("/uploads/video/knigarela-intro.mp4")} type="video/mp4" />
              Your browser does not support the video tag.
          </video>
      </div>
  );
}
