import { FileSpreadsheet, FileIcon as FilePdf, Baby, Heart, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { balitaService } from "@/services/balitaService";
import { ibuHamilService } from "@/services/ibuHamilService";
import type { BalitaRecord, IbuHamilRecord, RisikoKehamilan, StatusGizi } from "@/types/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#2563eb"];
const GIZI_KEYS: StatusGizi[] = ["baik", "kurang", "buruk", "stunting", "obesitas"];
const RISIKO_COLORS: Record<RisikoKehamilan, string> = {
  rendah: "#16a34a",
  sedang: "#f59e0b",
  tinggi: "#dc2626",
};

type LaporanTab = "balita" | "ibu";

const isLaporanTab = (value: string): value is LaporanTab => value === "balita" || value === "ibu";

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Laporan() {
  const [activeTab, setActiveTab] = useState<LaporanTab>("balita");
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
        console.error("Laporan fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const balitaStats = useMemo(
    () =>
      GIZI_KEYS.map((status) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: data.balitas.filter((b) => b.pemeriksaans?.[0]?.status_gizi === status).length,
      })).filter((s) => s.value > 0),
    [data.balitas]
  );

  const risikoStats = useMemo(
    () =>
      (["rendah", "sedang", "tinggi"] as RisikoKehamilan[])
        .map((risiko) => ({
          name: risiko.charAt(0).toUpperCase() + risiko.slice(1),
          key: risiko,
          value: data.ibuHamils.filter((i) => (i.risiko || "rendah") === risiko).length,
        }))
        .filter((s) => s.value > 0),
    [data.ibuHamils]
  );

  const exportExcel = (type: LaporanTab) => {
    if (type === "balita") {
      const exportData = data.balitas.map((b) => {
        const pemeriksaan = b.pemeriksaans?.[0];
        return {
          Nama: b.nama,
          NIK: b.nik || "-",
          "Tanggal Lahir": formatDate(b.tanggal_lahir),
          "Jenis Kelamin": b.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
          "Berat Badan": pemeriksaan?.berat_badan ?? "-",
          "Tinggi Badan": pemeriksaan?.tinggi_badan ?? "-",
          "Status Gizi": pemeriksaan?.status_gizi || "-",
          "Nama Ibu": b.nama_ibu || b.user?.name || "-",
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Balita");
      XLSX.writeFile(workbook, "laporan_balita.xlsx");
    } else {
      const exportData = data.ibuHamils.map((i) => {
        const pemeriksaan = i.pemeriksaans?.[0];
        return {
          Nama: i.nama || i.user?.name || "-",
          Umur: i.umur ?? "-",
          "Usia Hamil": `${i.usia_kehamilan_awal} minggu`,
          HPL: formatDate(i.hpl),
          "Berat Badan": pemeriksaan?.berat_badan ?? "-",
          "Tinggi Badan": pemeriksaan?.tinggi_badan ?? "-",
          "Tekanan Darah": pemeriksaan?.tekanan_darah || "-",
          Risiko: i.risiko || "rendah",
          Alamat: i.alamat || "-",
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Ibu Hamil");
      XLSX.writeFile(workbook, "laporan_ibu_hamil.xlsx");
    }
  };

  const exportPDF = (type: LaporanTab) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("SiPosyandu - Laporan " + (type === "balita" ? "Data Balita" : "Data Ibu Hamil"), 14, 20);
    doc.setFontSize(10);
    doc.text("Tanggal: " + new Date().toLocaleDateString("id-ID"), 14, 28);

    if (type === "balita") {
      autoTable(doc, {
        head: [["Nama", "NIK", "Tgl Lahir", "JK", "BB (kg)", "TB (cm)", "Status Gizi", "Ibu"]],
        body: data.balitas.map((b) => [
          b.nama,
          b.nik || "-",
          formatDate(b.tanggal_lahir),
          b.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
          b.pemeriksaans?.[0]?.berat_badan || "-",
          b.pemeriksaans?.[0]?.tinggi_badan || "-",
          b.pemeriksaans?.[0]?.status_gizi || "-",
          b.nama_ibu || b.user?.name || "-",
        ]),
        startY: 35,
      });
    } else {
      autoTable(doc, {
        head: [["Nama", "Umur", "Usia Hamil", "BB (kg)", "TB (cm)", "Tensi", "Alamat"]],
        body: data.ibuHamils.map((i) => [
          i.nama || i.user?.name || "-",
          i.umur ? `${i.umur} th` : "-",
          i.usia_kehamilan_awal + " minggu",
          i.pemeriksaans?.[0]?.berat_badan || "-",
          i.pemeriksaans?.[0]?.tinggi_badan || "-",
          i.pemeriksaans?.[0]?.tekanan_darah || "-",
          i.alamat || "-",
        ]),
        startY: 35,
      });
    }

    doc.save(`laporan_${type}.pdf`);
  };

  const handleTabChange = (value: string) => {
    if (isLaporanTab(value)) {
      setActiveTab(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Laporan</h2>
          <p className="text-muted-foreground mt-1">Unduh laporan dan visualisasi data kesehatan</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="balita">
            <Baby className="h-4 w-4 mr-2" />
            Data Balita
          </TabsTrigger>
          <TabsTrigger value="ibu">
            <Heart className="h-4 w-4 mr-2" />
            Data Ibu Hamil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balita" className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => exportExcel("balita")}>
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportPDF("balita")}>
              <FilePdf className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Distribusi Status Gizi</CardTitle>
              </CardHeader>
              <CardContent>
                {balitaStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={balitaStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {balitaStats.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="py-28 text-center text-sm text-slate-500">Belum ada data status gizi.</p>
                )}
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Jumlah per Status</CardTitle>
              </CardHeader>
              <CardContent>
                {balitaStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={balitaStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {balitaStats.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="py-28 text-center text-sm text-slate-500">Belum ada data status gizi.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Ringkasan Data Balita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex flex-col items-center py-10 gap-2">
                    <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                    <p className="text-sm text-slate-500">Memuat data...</p>
                  </div>
                ) : data.balitas.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Nama</th>
                        <th className="text-left py-2 px-3 font-medium">NIK</th>
                        <th className="text-left py-2 px-3 font-medium">Tanggal Lahir</th>
                        <th className="text-left py-2 px-3 font-medium">JK</th>
                        <th className="text-left py-2 px-3 font-medium">BB/TB</th>
                        <th className="text-left py-2 px-3 font-medium">Status Gizi</th>
                        <th className="text-left py-2 px-3 font-medium">Nama Ibu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.balitas.map((b) => {
                        const lp = b.pemeriksaans?.[0];
                        return (
                          <tr key={b.id} className="border-b last:border-0">
                            <td className="py-2 px-3 font-medium">{b.nama}</td>
                            <td className="py-2 px-3">{b.nik || "-"}</td>
                            <td className="py-2 px-3">{formatDate(b.tanggal_lahir)}</td>
                            <td className="py-2 px-3">{b.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</td>
                            <td className="py-2 px-3">{lp?.berat_badan || "-"} kg / {lp?.tinggi_badan || "-"} cm</td>
                            <td className="py-2 px-3">
                              <span className="capitalize font-medium" style={{ color: lp?.status_gizi ? COLORS[GIZI_KEYS.indexOf(lp.status_gizi)] : undefined }}>
                                {lp?.status_gizi || "-"}
                              </span>
                            </td>
                            <td className="py-2 px-3">{b.nama_ibu || b.user?.name || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="py-10 text-center text-sm text-slate-500">Belum ada data balita.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ibu" className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => exportExcel("ibu")}>
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportPDF("ibu")}>
              <FilePdf className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Distribusi Risiko Kehamilan</CardTitle>
              </CardHeader>
              <CardContent>
                {risikoStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={risikoStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {risikoStats.map((stat) => (
                          <Cell key={stat.key} fill={RISIKO_COLORS[stat.key]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="py-28 text-center text-sm text-slate-500">Belum ada data risiko kehamilan.</p>
                )}
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Jumlah per Risiko</CardTitle>
              </CardHeader>
              <CardContent>
                {risikoStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={risikoStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {risikoStats.map((stat) => (
                          <Cell key={stat.key} fill={RISIKO_COLORS[stat.key]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="py-28 text-center text-sm text-slate-500">Belum ada data risiko kehamilan.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Ringkasan Data Ibu Hamil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex flex-col items-center py-10 gap-2">
                    <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                    <p className="text-sm text-slate-500">Memuat data...</p>
                  </div>
                ) : data.ibuHamils.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Nama</th>
                        <th className="text-left py-2 px-3 font-medium">Umur</th>
                        <th className="text-left py-2 px-3 font-medium">Usia Hamil</th>
                        <th className="text-left py-2 px-3 font-medium">BB/TB</th>
                        <th className="text-left py-2 px-3 font-medium">Tensi</th>
                        <th className="text-left py-2 px-3 font-medium">Alamat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.ibuHamils.map((i) => {
                        const lp = i.pemeriksaans?.[0];
                        return (
                          <tr key={i.id} className="border-b last:border-0">
                            <td className="py-2 px-3 font-medium">{i.nama || i.user?.name || "-"}</td>
                            <td className="py-2 px-3">{i.umur ? `${i.umur} tahun` : "-"}</td>
                            <td className="py-2 px-3">{i.usia_kehamilan_awal} minggu</td>
                            <td className="py-2 px-3">{lp?.berat_badan || "-"} kg / {lp?.tinggi_badan || "-"} cm</td>
                            <td className="py-2 px-3">{lp?.tekanan_darah || "-"}</td>
                            <td className="py-2 px-3">{i.alamat || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="py-10 text-center text-sm text-slate-500">Belum ada data ibu hamil.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
