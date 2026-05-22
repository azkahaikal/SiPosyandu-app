export type UserRole = "admin" | "petugas" | "user";

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  address?: string | null;
}

export type StatusGizi = "baik" | "kurang" | "buruk" | "stunting" | "obesitas";

export interface PemeriksaanBalita {
  id: number;
  balita_id: number;
  tanggal_periksa: string;
  berat_badan: number;
  tinggi_badan: number;
  lingkar_kepala?: number | null;
  status_gizi?: StatusGizi | null;
  catatan?: string | null;
}

export interface BalitaRecord {
  id: number;
  user_id: number;
  nama: string;
  nik?: string | null;
  nama_ibu?: string | null;
  alamat?: string | null;
  tanggal_lahir: string;
  jenis_kelamin: "L" | "P";
  berat_lahir?: number | null;
  tinggi_lahir?: number | null;
  user?: ApiUser;
  pemeriksaans?: PemeriksaanBalita[];
}

export interface PemeriksaanIbuHamil {
  id: number;
  ibu_hamil_id: number;
  tanggal_periksa: string;
  usia_kandungan: number;
  berat_badan: number;
  tinggi_badan?: number | null;
  tekanan_darah?: string | null;
  denyut_jantung_janin?: number | null;
  catatan?: string | null;
}

export type RisikoKehamilan = "rendah" | "sedang" | "tinggi";

export interface IbuHamilRecord {
  id: number;
  user_id: number;
  nama?: string | null;
  umur?: number | null;
  usia_kehamilan_awal: number;
  hpl: string;
  riwayat_penyakit?: string | null;
  alamat?: string | null;
  risiko?: RisikoKehamilan;
  user?: ApiUser;
  pemeriksaans?: PemeriksaanIbuHamil[];
}
