import api from "../lib/axios";

export interface Jadwal {
  id: number;
  nama_kegiatan: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  keterangan?: string | null;
  status: "akan_datang" | "selesai" | "dibatalkan";
}

export const jadwalService = {
  getAll: async () => {
    const response = await api.get<Jadwal[]>("/jadwals");
    return response.data;
  },
  create: async (data: Partial<Jadwal>) => {
    const response = await api.post<Jadwal>("/jadwals", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Jadwal>) => {
    const response = await api.put<Jadwal>(`/jadwals/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/jadwals/${id}`);
    return response.data;
  },
};
