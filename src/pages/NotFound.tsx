import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeartPulse, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-health mb-6">
          <HeartPulse className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-emerald-600 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-6">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link to="/">
          <Button className="gradient-health text-white hover:opacity-90 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
