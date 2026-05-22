import { Baby, Heart, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Activity, CalendarDays, Loader2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { balitaService } from "@/services/balitaService";
import { ibuHamilService } from "@/services/ibuHamilService";
import { jadwalService } from "@/services/jadwalService";
import type { Jadwal } from "@/services/jadwalService";
import { useAuthStore } from "@/stores/authStore";
import type { BalitaRecord, IbuHamilRecord } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  LineChart,
  Line,
} from "recharts";

const COLORS = {
  baik: "#16a34a",
  kurang: "#f59e0b",
  buruk: "#dc2626",
  stunting: "#7c3aed",
  obesitas: "#2563eb",
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    balitas: [] as BalitaRecord[],
    ibuHamils: [] as IbuHamilRecord[],
    jadwals: [] as Jadwal[],
  });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [balitas, ibuHamils, jadwals] = await Promise.all([
          balitaService.getAll(),
          ibuHamilService.getAll(),
          jadwalService.getAll(),
        ]);
        setData({ balitas, ibuHamils, jadwals });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = useMemo(() => {
    const totalBalita = data.balitas.length;
    const totalIbuHamil = data.ibuHamils.length;
    const balitaBaik = data.balitas.filter((b) => b.pemeriksaans?.[0]?.status_gizi === "baik").length;
    const balitaKurang = data.balitas.filter((b) => ["kurang", "buruk"].includes(b.pemeriksaans?.[0]?.status_gizi)).length;
    const balitaStunting = data.balitas.filter((b) => b.pemeriksaans?.[0]?.status_gizi === "stunting").length;
    const ibuRisikoTinggi = data.ibuHamils.filter((i) => i.risiko === "tinggi").length; // Note: risky calc logic might need refinement
    const jadwalAkanDatang = data.jadwals.filter((j) => j.status === "akan_datang").length;

    return { totalBalita, totalIbuHamil, balitaBaik, balitaKurang, balitaStunting, ibuRisikoTinggi, jadwalAkanDatang };
  }, [data]);

  const giziData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.balitas.forEach((b) => {
      const status = b.pemeriksaans?.[0]?.status_gizi || "tidak_ada";
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[name as keyof typeof COLORS] || "#94a3b8",
    }));
  }, [data]);

  const risikoData = useMemo(() => {
    const counts: Record<string, number> = { rendah: 0, sedang: 0, tinggi: 0 };
    data.ibuHamils.forEach((i) => {
      const r = i.risiko || "rendah";
      counts[r] = (counts[r] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [data]);

  const pertumbuhanData = useMemo(() => {
    return data.balitas.slice(0, 10).map((b) => ({
      name: b.nama?.split(" ")[0] || "Balita",
      berat: b.pemeriksaans?.[0]?.berat_badan || 0,
      tinggi: b.pemeriksaans?.[0]?.tinggi_badan || 0,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
        <p className="text-slate-500 font-bold text-lg">Menyiapkan Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ... rest of the component remains the same ... */}
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Selamat Datang, <span className="text-gradient">{user?.name}</span>
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Ringkasan rekam medis digital Posyandu hari ini.
          </p>
        </div>
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl border-emerald-100 shadow-sm">
           <Activity className="h-5 w-5 text-emerald-500 animate-pulse" />
           <span className="text-sm font-semibold text-emerald-700">Sistem Online</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-white/60 glass hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-emerald-900/5 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Balita</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-emerald-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Baby className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{stats.totalBalita}</div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">{stats.balitaBaik}</span> status gizi baik
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/60 glass hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-emerald-900/5 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ibu Hamil</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-rose-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="h-5 w-5 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{stats.totalIbuHamil}</div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">{stats.ibuRisikoTinggi}</span> risiko tinggi
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/60 glass hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-emerald-900/5 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Perhatian</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-amber-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{stats.balitaKurang + stats.balitaStunting}</div>
            <p className="text-xs text-slate-500 mt-2">
              <span className="font-bold text-amber-600">Gizi kurang & stunting</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/60 glass hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-emerald-900/5 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Jadwal</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-blue-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{stats.jadwalAkanDatang}</div>
            <p className="text-xs text-slate-500 mt-2">
              <span className="font-bold text-blue-600">Pemeriksaan mendatang</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Status Gizi Balita</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={giziData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {giziData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {giziData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Risiko Kehamilan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={risikoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Pertumbuhan Balita</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pertumbuhanData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="berat" stroke="#16a34a" strokeWidth={2} dot={{ fill: "#16a34a" }} name="Berat (kg)" />
              <Line type="monotone" dataKey="tinggi" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb" }} name="Tinggi (cm)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
