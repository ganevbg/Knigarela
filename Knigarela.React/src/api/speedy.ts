import { api } from "@/lib/api";

export async function getOffices(name: string) {
    const { data } = await api.get(`/api/speedy/offices/?name=${name}`);
    return data;
}

export async function getSites(name: string) {
    const { data } = await api.get(`/api/speedy/sites/?name=${name}`);
    return data;
}
