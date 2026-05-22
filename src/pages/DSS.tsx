import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Baby, Heart, ArrowRight, CheckCircle2, Info, Loader2, Activity, Ruler, Scale, ClipboardCheck } from "lucide-react";
import { balitaService } from "@/services/balitaService";
import { ibuHamilService } from "@/services/ibuHamilService";
import type { BalitaRecord, IbuHamilRecord } from "@/types/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const giziConfig = {
  baik: {
    label: "Gizi Baik",
    color: "#16a34a",
    rekomendasi: [
      "Pertahankan pola makan yang seimbang",
      "Lanjutkan pemberian ASI atau susu formula",
      "Pastikan anak aktif bermain dan bergerak",
      "Jadwalkan pemeriksaan rutin ke posyandu",
    ],
  },
  kurang: {
    label: "Gizi Kurang",
    color: "#f59e0b",
    rekomendasi: [
      "Tingkatkan frekuensi makan menjadi 5 kali sehari",
      "Berikan makanan bergizi tinggi protein dan kalori",
      "Tambahkan minyak/zat gizi mikro pada makanan",
      "Pantau pertumbuhan mingguan dan konsultasikan ke tenaga kesehatan",
    ],
  },
  buruk: {
    label: "Gizi Buruk",
    color: "#dc2626",
    rekomendasi: [
      "SEGERA rujuk ke fasilitas kesehatan untuk penanganan intensif",
      "Berikan makanan tinggi protein dan energi secara bertahap",
      "Pantau tanda bahaya dehidrasi dan infeksi",
      "Lakukan pemeriksaan darah untuk anemia dan infeksi",
    ],
  },
  stunting: {
    label: "Stunting",
    color: "#7c3aed",
    rekomendasi: [
      "Pastikan asupan protein hewani yang cukup",
      "Perhatikan kebersihan lingkungan dan sanitasi",
      "Lakukan stimulasi perkembangan anak secara aktif",
      "Konsultasikan ke dokter spesialis anak",
    ],
  },
  obesitas: {
    label: "Obesitas",
    color: "#2563eb",
    rekomendasi: [
      "Kurangi asupan makanan tinggi gula dan lemak",
      "Tingkatkan aktivitas fisik anak minimal 60 menit/hari",
      "Batasi waktu layar (TV/gadget)",
      "Konsultasikan ke tenaga kesehatan untuk program penurunan berat badan",
    ],
  },
};

const risikoConfig = {
  rendah: {
    label: "Risiko Rendah",
    color: "#16a34a",
    rekomendasi: [
      "Lanjutkan ANC rutin 4 kali selama kehamilan",
      "Konsumsi tablet tambah darah (TTD) secara teratur",
      "Pertahankan pola makan seimbang dan aktivitas ringan",
      "Persiapkan kelahiran dengan kelas ibu hamil",
    ],
  },
  sedang: {
    label: "Risiko Sedang",
    color: "#f59e0b",
    rekomendasi: [
      "Tingkatkan frekuensi ANC menjadi 6-8 kali",
      "Pantau tekanan darah dan berat badan secara rutin",
      "Konsumsi suplemen zat besi dan asam folat",
      "Perhatikan tanda bahaya kehamilan (pendarahan, sakit kepala parah, dll)",
    ],
  },
  tinggi: {
    label: "Risiko Tinggi",
    color: "#dc2626",
    rekomendasi: [
      "SEGERA rujuk ke rumah sakit untuk pemantauan intensif",
      "Pemeriksaan ANC setiap 2 minggu",
      "Pantau tekanan darah, protein urin, dan kadar gula darah",
      "Siapkan rencana persalinan dan rujukan ke RS bersalin",
    ],
  },
};

type GrowthStatusKey = "normal" | "stunting" | "sangat_pendek";

type ZScoreTone = "green" | "amber" | "red";

type GiziCalculation = {
  statusGizi: keyof typeof giziConfig;
  statusPertumbuhan: GrowthStatusKey;
  zBBU: number;
  zTBU: number;
};

const growthConfig: Record<GrowthStatusKey, { label: string; color: string; badgeClass: string; description: string }> = {
  normal: {
    label: "Normal",
    color: "#16a34a",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    description: "Tinggi badan anak sesuai dengan standar usianya berdasarkan indikator TB/U.",
  },
  stunting: {
    label: "Stunting",
    color: "#f59e0b",
    badgeClass: "bg-orange-100 text-orange-700 border-orange-200",
    description: "Tinggi badan anak lebih pendek dari standar usianya dan perlu pemantauan gizi.",
  },
  sangat_pendek: {
    label: "Sangat Pendek",
    color: "#dc2626",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
    description: "Indikator TB/U berada pada risiko tinggi, perlu konsultasi dan intervensi lebih cepat.",
  },
};

const giziDescriptions: Record<keyof typeof giziConfig, string> = {
  baik: "Berat badan anak sesuai dengan umurnya dan berada dalam rentang pertumbuhan sehat.",
  kurang: "Berat badan anak berada di bawah standar usianya dan membutuhkan peningkatan asupan gizi.",
  buruk: "Berat badan anak jauh di bawah standar dan membutuhkan evaluasi tenaga kesehatan.",
  stunting: "Status ini menunjukkan gangguan pertumbuhan linear yang perlu ditangani secara berkelanjutan.",
  obesitas: "Berat badan anak berada di atas standar usia dan perlu pengaturan pola makan serta aktivitas.",
};

const getZScoreTone = (score: number): ZScoreTone => {
  if (score < -3 || score > 3) return "red";
  if (score < -2 || score > 2) return "amber";
  return "green";
};

const zScoreToneClass: Record<ZScoreTone, string> = {
  green: "text-emerald-600 bg-emerald-50 border-emerald-100",
  amber: "text-orange-600 bg-orange-50 border-orange-100",
  red: "text-red-600 bg-red-50 border-red-100",
};

const formatZScore = (score: number) => `${score > 0 ? "+" : ""}${score.toFixed(1)} SD`;

const calculateGiziDetail = (
  beratBadan: number,
  tinggiBadan: number,
  jenisKelamin: "L" | "P"
): GiziCalculation => {
  const medianBerat = jenisKelamin === "L" ? 12.0 : 11.5;
  const sdBerat = 1.5;
  const medianTinggi = jenisKelamin === "L" ? 85 : 83;
  const sdTinggi = 4;
  const zBBU = (beratBadan - medianBerat) / sdBerat;
  const zTBU = (tinggiBadan - medianTinggi) / sdTinggi;

  let statusGizi: keyof typeof giziConfig = "baik";
  if (zBBU > 2) statusGizi = "obesitas";
  else if (zBBU < -3) statusGizi = "buruk";
  else if (zBBU < -2) statusGizi = "kurang";

  let statusPertumbuhan: GrowthStatusKey = "normal";
  if (zTBU < -3) statusPertumbuhan = "sangat_pendek";
  else if (zTBU < -2) statusPertumbuhan = "stunting";

  return { statusGizi, statusPertumbuhan, zBBU, zTBU };
};

export default function DSS() {
  const [tab, setTab] = useState("balita");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    balitas: [] as BalitaRecord[],
    ibuHamils: [] as IbuHamilRecord[],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [balitas, ibuHamils] = await Promise.all([
          balitaService.getAll(),
          ibuHamilService.getAll(),
        ]);
        setData({ balitas, ibuHamils });
      } catch (error) {
        console.error("DSS fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculator state
  const [calcBB, setCalcBB] = useState("");
  const [calcTB, setCalcTB] = useState("");
  const [calcUmur, setCalcUmur] = useState("");
  const [calcJK, setCalcJK] = useState<"L" | "P">("L");
  const [calcResult, setCalcResult] = useState<GiziCalculation | null>(null);

  const handleCalculate = () => {
    if (!calcBB || !calcTB || !calcUmur) {
      setCalcResult(null);
      return;
    }

    const result = calculateGiziDetail(Number(calcBB), Number(calcTB), calcJK);
    setCalcResult(result);
  };

  const giziDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    data.balitas.forEach((b) => {
      const status = b.pemeriksaans?.[0]?.status_gizi || "baik";
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: giziConfig[name as keyof typeof giziConfig]?.label || name,
      value,
    }));
  }, [data]);

  const risikoDistribution = useMemo(() => {
    const counts: Record<string, number> = { rendah: 0, sedang: 0, tinggi: 0 };
    data.ibuHamils.forEach((i) => {
      const r = i.risiko || "rendah";
      counts[r] = (counts[r] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: risikoConfig[name as keyof typeof risikoConfig]?.label || name,
      value,
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sistem Pendukung Keputusan</h2>
        <p className="text-muted-foreground mt-1">
          Algoritma klasifikasi status gizi dan risiko kehamilan
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="balita">
            <Baby className="h-4 w-4 mr-2" />
            Status Gizi Balita
          </TabsTrigger>
          <TabsTrigger value="ibu">
            <Heart className="h-4 w-4 mr-2" />
            Risiko Kehamilan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balita" className="space-y-6">
          {/* Calculator */}
          <Card className="card-shadow border-slate-100 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-emerald-600" />
                Kalkulator Status Gizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Berat Badan (kg)</Label>
                  <Input type="number" step="0.1" value={calcBB} onChange={(e) => setCalcBB(e.target.value)} placeholder="10.5" className="bg-white shadow-sm h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Tinggi Badan (cm)</Label>
                  <Input type="number" step="0.1" value={calcTB} onChange={(e) => setCalcTB(e.target.value)} placeholder="80" className="bg-white shadow-sm h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Umur (bulan)</Label>
                  <Input type="number" value={calcUmur} onChange={(e) => setCalcUmur(e.target.value)} placeholder="24" className="bg-white shadow-sm h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Jenis Kelamin</Label>
                  <select
                    className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                    value={calcJK}
                    onChange={(e) => setCalcJK(e.target.value as "L" | "P")}
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
               <Button onClick={handleCalculate} className="gradient-health text-white btn-3d px-8 font-bold">
                Hitung Status Gizi
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          <Card className="card-shadow border-slate-100 overflow-hidden transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-bold text-slate-800">Hasil Perhitungan</CardTitle>
                {calcResult && (
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    Standar WHO Z-score
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!calcResult ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                    <Activity className="h-6 w-6" />
                  </div>
                  <p className="text-base font-semibold text-slate-700">Hasil belum dihitung</p>
                  <p className="mt-1 max-w-md text-sm text-slate-500">
                    Isi berat badan, tinggi badan, umur, dan jenis kelamin, lalu tekan tombol Hitung Status Gizi.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-fade-in">
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-5 shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-700">Status Gizi</p>
                        <Badge variant="outline" className="border-emerald-200 bg-white text-emerald-700">
                          BB/U
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                          <Scale className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-emerald-700">{giziConfig[calcResult.statusGizi].label}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{giziDescriptions[calcResult.statusGizi]}</p>
                        </div>
                      </div>
                  </div>

                  <div className="rounded-lg border border-orange-100 bg-orange-50/70 p-5 shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-700">Status Pertumbuhan</p>
                        <Badge variant="outline" className={growthConfig[calcResult.statusPertumbuhan].badgeClass}>
                          TB/U
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: growthConfig[calcResult.statusPertumbuhan].color }}>
                          <Ruler className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black" style={{ color: growthConfig[calcResult.statusPertumbuhan].color }}>
                            {growthConfig[calcResult.statusPertumbuhan].label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{growthConfig[calcResult.statusPertumbuhan].description}</p>
                        </div>
                      </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-700">Nilai Z-score</p>
                        <Info className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-3">
                          <span className="text-sm font-medium text-slate-600">BB/U</span>
                          <span className={`rounded-full border px-3 py-1 text-sm font-black ${zScoreToneClass[getZScoreTone(calcResult.zBBU)]}`}>
                            {formatZScore(calcResult.zBBU)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-3">
                          <span className="text-sm font-medium text-slate-600">TB/U</span>
                          <span className={`rounded-full border px-3 py-1 text-sm font-black ${zScoreToneClass[getZScoreTone(calcResult.zTBU)]}`}>
                            {formatZScore(calcResult.zTBU)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-slate-500">*SD: Standar Deviasi berdasarkan pendekatan WHO.</p>
                  </div>

                  <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-5 shadow-sm">
                      <div className="mb-5 flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-blue-600" />
                        <p className="text-sm font-bold text-slate-700">Rekomendasi</p>
                      </div>
                      <ul className="space-y-3">
                        {[
                          "Tingkatkan protein hewani pada menu harian",
                          "Pantau pertumbuhan balita setiap bulan",
                          "Konsultasi ke puskesmas bila risiko berlanjut",
                          ...giziConfig[calcResult.statusGizi].rekomendasi.slice(0, 1),
                        ].map((rec, index) => (
                          <li key={`${rec}-${index}`} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Distribution Chart */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Distribusi Status Gizi</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={giziDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recommendations Table */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Data Balita & Rekomendasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center py-10">
                    <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                  </div>
                ) : (
                  data.balitas.map((b) => {
                    const status = b.pemeriksaans?.[0]?.status_gizi || "baik";
                    const config = giziConfig[status as keyof typeof giziConfig];
                    return (
                      <div key={b.id} className="p-4 rounded-lg border" style={{ borderColor: `${config.color}30`, backgroundColor: `${config.color}08` }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${config.color}20` }}>
                              <Baby className="h-4 w-4" style={{ color: config.color }} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{b.nama}</p>
                              <p className="text-xs text-muted-foreground">{b.pemeriksaans?.[0]?.berat_badan || "-"} kg / {b.pemeriksaans?.[0]?.tinggi_badan || "-"} cm</p>
                            </div>
                          </div>
                          <Badge className="text-xs" style={{ backgroundColor: `${config.color}20`, color: config.color, borderColor: `${config.color}30` }}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="pl-11">
                          <p className="text-xs font-medium text-foreground mb-1">Rekomendasi:</p>
                          <ul className="space-y-1">
                            {config.rekomendasi.slice(0, 2).map((rec, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" style={{ color: config.color }} />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ibu" className="space-y-6">
          {/* Risk Distribution */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Distribusi Risiko Kehamilan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={risikoDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#dc2626" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Data */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Data Ibu Hamil & Rekomendasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center py-10">
                    <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
                  </div>
                ) : (
                  data.ibuHamils.map((i) => {
                    const status = i.risiko || "rendah";
                    const config = risikoConfig[status as keyof typeof risikoConfig];
                    return (
                      <div key={i.id} className="p-4 rounded-lg border" style={{ borderColor: `${config.color}30`, backgroundColor: `${config.color}08` }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${config.color}20` }}>
                              <Heart className="h-4 w-4" style={{ color: config.color }} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{i.user?.name || "-"}</p>
                              <p className="text-xs text-muted-foreground">{i.usia_kehamilan_awal} minggu / {i.pemeriksaans?.[0]?.tekanan_darah || "-"}</p>
                            </div>
                          </div>
                          <Badge className="text-xs" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="pl-11">
                          <p className="text-xs font-medium text-foreground mb-1">Rekomendasi:</p>
                          <ul className="space-y-1">
                            {config.rekomendasi.slice(0, 2).map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" style={{ color: config.color }} />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
