import api from "../lib/axios";
import type { BalitaRecord, PemeriksaanBalita } from "@/types/api";

export type Balita = BalitaRecord;

export const balitaService = {
  getAll: async () => {
    const response = await api.get<Balita[]>("/balitas");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Balita>(`/balitas/${id}`);
    return response.data;
  },
  create: async (data: Partial<Balita>) => {
    const response = await api.post<Balita>("/balitas", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Balita>) => {
    const response = await api.put<Balita>(`/balitas/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/balitas/${id}`);
    return response.data;
  },
};

export const pemeriksaanService = {
  create: async (data: Partial<PemeriksaanBalita>) => {
    const response = await api.post<PemeriksaanBalita>("/pemeriksaan-balitas", data);
    return response.data;
  },
};
