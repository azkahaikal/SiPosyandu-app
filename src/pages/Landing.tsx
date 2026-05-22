import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Shield,
  LineChart,
  MapPin,
  UtensilsCrossed,
  CalendarCheck,
  FileText,
  ArrowRight,
  CheckCircle2,
  Baby,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Manajemen Data Terpadu",
    description: "Kelola data balita dan ibu hamil dengan sistem yang terintegrasi dan aman.",
  },
  {
    icon: LineChart,
    title: "Dashboard Interaktif",
    description: "Pantau status kesehatan dengan grafik dan statistik real-time.",
  },
  {
    icon: MapPin,
    title: "Pemetaan Wilayah",
    description: "Visualisasi sebaran data kesehatan per wilayah dengan peta interaktif.",
  },
  {
    icon: Brain,
    title: "Pendukung Keputusan",
    description: "Algoritma cerdas untuk klasifikasi status gizi dan rekomendasi kesehatan.",
  },
  {
    icon: UtensilsCrossed,
    title: "Rencana Makan",
    description: "Rekomendasi nutrisi sesuai kebutuhan ibu hamil, menyusui, dan balita.",
  },
  {
    icon: CalendarCheck,
    title: "Jadwal & Notifikasi",
    description: "Jadwal pemeriksaan rutin dengan notifikasi otomatis.",
  },
];

const stats = [
  { value: "500+", label: "Balita Terdaftar" },
  { value: "200+", label: "Ibu Hamil" },
  { value: "15", label: "Posyandu Aktif" },
  { value: "98%", label: "Kepuasan User" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full glass">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-health shadow-lg shadow-emerald-500/30">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-teal-600">SiPosyandu</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Masuk</Button>
            </Link>
            <Link to="/register">
              <Button className="gradient-health text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all rounded-full px-6">Daftar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-48 lg:pb-32 bg-slate-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-white to-teal-50/40" />
        <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 left-1/3 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-sm font-medium text-emerald-800 mb-8 shadow-sm">
              Sistem Informasi Posyandu Digital Masa Depan
            </div>
            <h1 className="animate-fade-in-up text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl" style={{ animationDelay: '0.1s' }}>
              Kelola Kesehatan <br className="hidden sm:block" />
              <span className="text-gradient drop-shadow-sm">Ibu & Anak</span>
              <br />
              Secara Cerdas
            </h1>
            <p className="animate-fade-in-up mt-8 text-lg leading-8 text-slate-600 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
              SiPosyandu menghadirkan pengalaman terbaik untuk manajemen rekam medis dan monitoring kesehatan secara real-time dengan teknologi cerdas.
            </p>
            <div className="animate-fade-in-up mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6" style={{ animationDelay: '0.3s' }}>
              <Link to="/register">
                <Button size="lg" className="gradient-health text-white hover:scale-105 shadow-xl shadow-emerald-500/20 transition-all rounded-full px-8 h-14 text-base font-semibold gap-2 w-full sm:w-auto">
                  Mulai Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="glass hover:bg-white/90 border-emerald-200 text-emerald-800 hover:text-emerald-900 transition-all rounded-full px-8 h-14 w-full sm:w-auto font-semibold">
                  Masuk Petugas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-emerald-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-emerald-600">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-slate-50/30 skew-y-3 transform -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Fitur <span className="text-gradient">Unggulan</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Lebih dari sekadar pencatatan, SiPosyandu memberikan analisis cerdas untuk tumbuh kembang optimal.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="group relative rounded-3xl border border-white/60 glass p-8 hover:-translate-y-2 transition-all duration-300 animate-fade-in-up hover:shadow-2xl hover:shadow-emerald-500/10"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 border border-emerald-100">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative overflow-hidden rounded-[2.5rem] gradient-health px-6 py-20 sm:px-16 sm:py-24 text-center shadow-2xl shadow-emerald-600/30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-900/20 rounded-full blur-2xl" />
            
            <h2 className="relative text-4xl font-extrabold tracking-tight text-white sm:text-5xl animate-fade-in-up">
              Siap Bertransformasi?
            </h2>
            <p className="relative mt-6 text-xl text-emerald-50 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Bergabunglah dengan ekosistem kesehatan digital SiPosyandu dan tingkatkan kualitas pelayanan di wilayah Anda.
            </p>
            <div className="relative mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/register">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 hover:scale-105 transition-all shadow-xl rounded-full px-10 h-14 text-lg font-bold gap-2">
                  Daftar Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-health">
                <HeartPulse className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-foreground">SiPosyandu</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 SiPosyandu. Posyandu Digital Terpadu untuk Kesehatan Ibu & Anak.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}