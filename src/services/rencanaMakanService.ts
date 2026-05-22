import api from "../lib/axios";

export type KategoriRencanaMakan = "ibu_hamil" | "ibu_menyusui" | "balita";

export interface RencanaMakan {
  id: number;
  nama: string;
  kategori: KategoriRencanaMakan;
  bahan: string[];
  kalori: number;
  protein: number;
  karbohidrat: number;
  lemak: number;
  alergi: string[];
  cara_membuat: string;
}

export const rencanaMakanService = {
  getAll: async () => {
    const response = await api.get<RencanaMakan[]>("/rencana-makans");
    return response.data;
  },
  create: async (data: Partial<RencanaMakan>) => {
    const response = await api.post<RencanaMakan>("/rencana-makans", data);
    return response.data;
  },
  update: async (id: number, data: Partial<RencanaMakan>) => {
    const response = await api.put<RencanaMakan>(`/rencana-makans/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/rencana-makans/${id}`);
    return response.data;
  },
};
