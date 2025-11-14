import { api } from "@/lib/api";

export async function getAllClients() {
  const { data } = await api.get("/api/clients");
  return data;
}
