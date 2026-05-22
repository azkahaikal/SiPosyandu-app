import api from "../lib/axios";
import type { IbuHamilRecord, PemeriksaanIbuHamil } from "@/types/api";

export type IbuHamil = IbuHamilRecord;

export const ibuHamilService = {
  getAll: async () => {
    const response = await api.get<IbuHamil[]>("/ibu-hamils");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<IbuHamil>(`/ibu-hamils/${id}`);
    return response.data;
  },
  create: async (data: Partial<IbuHamil>) => {
    const response = await api.post<IbuHamil>("/ibu-hamils", data);
    return response.data;
  },
  update: async (id: number, data: Partial<IbuHamil>) => {
    const response = await api.put<IbuHamil>(`/ibu-hamils/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/ibu-hamils/${id}`);
    return response.data;
  },
};

export const pemeriksaanIbuService = {
  create: async (data: Partial<PemeriksaanIbuHamil>) => {
    const response = await api.post<PemeriksaanIbuHamil>("/pemeriksaan-ibu-hamils", data);
    return response.data;
  },
  update: async (id: number, data: Partial<PemeriksaanIbuHamil>) => {
    const response = await api.put<PemeriksaanIbuHamil>(`/pemeriksaan-ibu-hamils/${id}`, data);
    return response.data;
  },
};
