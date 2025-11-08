import { api } from "@/lib/api";

export async function getActiveBox() {
  const { data } = await api.get("/api/boxes/active");
  return data;
}

export async function getBoxBySlug(slug: string) {
    const { data } = await api.get(`/api/boxes/${slug}`);
    return data;
}