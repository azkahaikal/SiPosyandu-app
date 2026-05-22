export interface Balita {
  id: string;
  nama: string;
  tanggalLahir: string;
  jenisKelamin: "L" | "P";
  namaIbu: string;
  alamat: string;
  beratBadan: number; // kg
  tinggiBadan: number; // cm
  lingkarKepala: number; // cm
  tanggalPemeriksaan: string;
  statusGizi: "baik" | "kurang" | "buruk" | "stunting" | "obesitas";
}

export interface IbuHamil {
  id: string;
  nama: string;
  umur: number;
  usiaKehamilan: number; // minggu
  beratBadan: number;
  tinggiBadan: number;
  tensiDarah: string;
  hemoglobin: number;
  alamat: string;
  tanggalPemeriksaan: string;
  risiko: "rendah" | "sedang" | "tinggi";
  riwayatPenyakit: string[];
}

export interface JadwalPemeriksaan {
  id: string;
  nama: string;
  tipe: "balita" | "ibu_hamil";
  tanggal: string;
  waktu: string;
  lokasi: string;
  status: "akan_datang" | "selesai" | "terlewat";
}

export interface MealPlanItem {
  id: string;
  nama: string;
  kategori: "ibu_hamil" | "ibu_menyusui" | "balita";
  bahan: string[];
  nutrisi: {
    kalori: number;
    protein: number;
    karbohidrat: number;
    lemak: number;
  };
  alergi: string[];
  caraMembuat: string;
}

export const mockBalita: Balita[] = [
  {
    id: "1",
    nama: "Ahmad Fauzi",
    tanggalLahir: "2022-03-15",
    jenisKelamin: "L",
    namaIbu: "Siti Aminah",
    alamat: "Desa Mekar Jaya, RT 01/RW 02",
    beratBadan: 12.5,
    tinggiBadan: 85,
    lingkarKepala: 47,
    tanggalPemeriksaan: "2024-01-15",
    statusGizi: "baik",
  },
  {
    id: "2",
    nama: "Putri Dewi",
    tanggalLahir: "2021-08-20",
    jenisKelamin: "P",
    namaIbu: "Dewi Sartika",
    alamat: "Desa Mekar Jaya, RT 03/RW 01",
    beratBadan: 10.2,
    tinggiBadan: 78,
    lingkarKepala: 45,
    tanggalPemeriksaan: "2024-01-15",
    statusGizi: "kurang",
  },
  {
    id: "3",
    nama: "Budi Santoso",
    tanggalLahir: "2023-01-10",
    jenisKelamin: "L",
    namaIbu: "Rina Susanti",
    alamat: "Desa Suka Maju, RT 02/RW 03",
    beratBadan: 9.8,
    tinggiBadan: 72,
    lingkarKepala: 44,
    tanggalPemeriksaan: "2024-01-14",
    statusGizi: "stunting",
  },
  {
    id: "4",
    nama: "Anisa Putri",
    tanggalLahir: "2022-11-05",
    jenisKelamin: "P",
    namaIbu: "Nurul Hidayah",
    alamat: "Desa Mekar Jaya, RT 01/RW 01",
    beratBadan: 14.0,
    tinggiBadan: 88,
    lingkarKepala: 48,
    tanggalPemeriksaan: "2024-01-15",
    statusGizi: "baik",
  },
  {
    id: "5",
    nama: "Rafi Abdullah",
    tanggalLahir: "2021-05-22",
    jenisKelamin: "L",
    namaIbu: "Fatimah Zahra",
    alamat: "Desa Suka Maju, RT 04/RW 02",
    beratBadan: 16.5,
    tinggiBadan: 92,
    lingkarKepala: 49,
    tanggalPemeriksaan: "2024-01-13",
    statusGizi: "obesitas",
  },
  {
    id: "6",
    nama: "Maya Sari",
    tanggalLahir: "2023-06-18",
    jenisKelamin: "P",
    namaIbu: "Lestari Wulandari",
    alamat: "Desa Mekar Jaya, RT 02/RW 02",
    beratBadan: 8.5,
    tinggiBadan: 68,
    lingkarKepala: 42,
    tanggalPemeriksaan: "2024-01-15",
    statusGizi: "buruk",
  },
];

export const mockIbuHamil: IbuHamil[] = [
  {
    id: "1",
    nama: "Siti Aminah",
    umur: 28,
    usiaKehamilan: 24,
    beratBadan: 65,
    tinggiBadan: 158,
    tensiDarah: "120/80",
    hemoglobin: 11.5,
    alamat: "Desa Mekar Jaya, RT 01/RW 02",
    tanggalPemeriksaan: "2024-01-15",
    risiko: "rendah",
    riwayatPenyakit: [],
  },
  {
    id: "2",
    nama: "Dewi Sartika",
    umur: 32,
    usiaKehamilan: 32,
    beratBadan: 72,
    tinggiBadan: 160,
    tensiDarah: "140/90",
    hemoglobin: 9.8,
    alamat: "Desa Mekar Jaya, RT 03/RW 01",
    tanggalPemeriksaan: "2024-01-15",
    risiko: "tinggi",
    riwayatPenyakit: ["Hipertensi"],
  },
  {
    id: "3",
    nama: "Rina Susanti",
    umur: 25,
    usiaKehamilan: 16,
    beratBadan: 58,
    tinggiBadan: 155,
    tensiDarah: "110/70",
    hemoglobin: 12.0,
    alamat: "Desa Suka Maju, RT 02/RW 03",
    tanggalPemeriksaan: "2024-01-14",
    risiko: "rendah",
    riwayatPenyakit: [],
  },
  {
    id: "4",
    nama: "Nurul Hidayah",
    umur: 35,
    usiaKehamilan: 28,
    beratBadan: 68,
    tinggiBadan: 162,
    tensiDarah: "130/85",
    hemoglobin: 10.5,
    alamat: "Desa Mekar Jaya, RT 01/RW 01",
    tanggalPemeriksaan: "2024-01-15",
    risiko: "sedang",
    riwayatPenyakit: ["Anemia"],
  },
];

export const mockJadwal: JadwalPemeriksaan[] = [
  {
    id: "1",
    nama: "Pemeriksaan Balita - Ahmad Fauzi",
    tipe: "balita",
    tanggal: "2024-02-01",
    waktu: "08:00",
    lokasi: "Posyandu Mekar Jaya",
    status: "akan_datang",
  },
  {
    id: "2",
    nama: "Pemeriksaan Ibu Hamil - Dewi Sartika",
    tipe: "ibu_hamil",
    tanggal: "2024-02-05",
    waktu: "09:00",
    lokasi: "Posyandu Mekar Jaya",
    status: "akan_datang",
  },
  {
    id: "3",
    nama: "Pemeriksaan Balita - Putri Dewi",
    tipe: "balita",
    tanggal: "2024-01-20",
    waktu: "08:30",
    lokasi: "Posyandu Mekar Jaya",
    status: "selesai",
  },
  {
    id: "4",
    nama: "Pemeriksaan Ibu Hamil - Siti Aminah",
    tipe: "ibu_hamil",
    tanggal: "2024-01-18",
    waktu: "09:00",
    lokasi: "Posyandu Mekar Jaya",
    status: "selesai",
  },
  {
    id: "5",
    nama: "Pemeriksaan Balita - Budi Santoso",
    tipe: "balita",
    tanggal: "2024-01-10",
    waktu: "08:00",
    lokasi: "Posyandu Suka Maju",
    status: "terlewat",
  },
];

export const mockMealPlans: MealPlanItem[] = [
  {
    id: "1",
    nama: "Bubur Ayam Hati",
    kategori: "balita",
    bahan: ["nasi", "daging ayam", "hati ayam", "wortel", "bawang putih"],
    nutrisi: { kalori: 200, protein: 15, karbohidrat: 30, lemak: 5 },
    alergi: [],
    caraMembuat: "Haluskan nasi dan campur dengan ayam yang sudah dihaluskan. Tambahkan wortel parut dan bawang putih. Masak hingga matang.",
  },
  {
    id: "2",
    nama: "Sup Ikan Salmon",
    kategori: "balita",
    bahan: ["ikan salmon", "tahu", "wortel", "bayam", "bawang bombay"],
    nutrisi: { kalori: 180, protein: 18, karbohidrat: 12, lemak: 8 },
    alergi: ["seafood"],
    caraMembuat: "Rebus salmon dengan sayuran. Haluskan atau potong kecil sesuai usia anak.",
  },
  {
    id: "3",
    nama: "Sayur Lodeh dengan Tempe",
    kategori: "ibu_hamil",
    bahan: ["tempe", "labu siam", "kacang panjang", "santan", "bawang merah"],
    nutrisi: { kalori: 350, protein: 18, karbohidrat: 25, lemak: 15 },
    alergi: [],
    caraMembuat: "Tumis bumbu, masukkan sayuran dan tempe. Tambahkan santan dan masak hingga matang.",
  },
  {
    id: "4",
    nama: "Ikan Bakar dengan Sambal Tomat",
    kategori: "ibu_hamil",
    bahan: ["ikan kembung", "tomat", "cabe merah", "jeruk nipis", "kemangi"],
    nutrisi: { kalori: 280, protein: 25, karbohidrat: 10, lemak: 12 },
    alergi: ["seafood"],
    caraMembuat: "Bakar ikan hingga matang. Sajikan dengan sambal tomat dan kemangi.",
  },
  {
    id: "5",
    nama: "Smoothie Avokad Susu",
    kategori: "ibu_menyusui",
    bahan: ["avokad", "susu UHT", "madu", "pisang"],
    nutrisi: { kalori: 300, protein: 10, karbohidrat: 35, lemak: 14 },
    alergi: ["susu"],
    caraMembuat: "Blender semua bahan hingga halus. Sajikan dingin.",
  },
  {
    id: "6",
    nama: "Tumis Kangkung Tahu",
    kategori: "ibu_menyusui",
    bahan: ["kangkung", "tahu", "bawang putih", "cabai", "kecap"],
    nutrisi: { kalori: 220, protein: 15, karbohidrat: 12, lemak: 10 },
    alergi: ["kedelai"],
    caraMembuat: "Tumis bawang putih dan cabai. Masukkan tahu dan kangkung. Tambahkan kecap.",
  },
];

export function hitungStatusGizi(beratBadan: number, tinggiBadan: number, umurBulan: number, jenisKelamin: "L" | "P"): "baik" | "kurang" | "buruk" | "stunting" | "obesitas" {
  // Simplified WHO z-score approximation for demo
  const medianBerat = jenisKelamin === "L" ? 12.0 : 11.5;
  const sdBerat = 1.5;
  const zScore = (beratBadan - medianBerat) / sdBerat;

  const medianTinggi = jenisKelamin === "L" ? 85 : 83;
  const sdTinggi = 4;
  const zScoreTinggi = (tinggiBadan - medianTinggi) / sdTinggi;

  if (zScoreTinggi < -2) return "stunting";
  if (zScore > 2) return "obesitas";
  if (zScore < -3) return "buruk";
  if (zScore < -2) return "kurang";
  return "baik";
}

export function hitungRisikoKehamilan(
  usiaKehamilan: number,
  tensiDarah: string,
  hemoglobin: number,
  umur: number
): "rendah" | "sedang" | "tinggi" {
  const [sistolik, diastolik] = tensiDarah.split("/").map(Number);
  let risiko = 0;

  if (sistolik >= 140 || diastolik >= 90) risiko += 2;
  if (hemoglobin < 10) risiko += 2;
  if (umur > 35 || umur < 20) risiko += 1;
  if (usiaKehamilan > 36) risiko += 1;

  if (risiko >= 4) return "tinggi";
  if (risiko >= 2) return "sedang";
  return "rendah";
}
