import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";
import { HeartPulse, Eye, EyeOff } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    const success = await register(name, email, password, confirmPassword);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <ParticleBackground />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white mb-4 shadow-xl hover:scale-110 transition-all duration-300 border border-emerald-100">
            <HeartPulse className="h-7 w-7 text-emerald-500" />
          </Link>
          <h1 className="text-3xl font-extrabold text-emerald-900">SiPosyandu</h1>
          <p className="text-sm text-emerald-700/80 mt-2 font-medium">Buat akun untuk mulai memantau kesehatan</p>
        </div>

        <Card className="border border-slate-100 bg-white shadow-2xl overflow-hidden rounded-[2rem]">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400" />
          <CardHeader className="space-y-1 pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-slate-800 text-center">Daftar Akun</CardTitle>
            <CardDescription className="text-center text-slate-500 font-medium">
              Lengkapi data berikut untuk bergabung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold ml-1">Nama Lengkap</Label>
                <Input
                  id="name"
                  placeholder="Nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border-slate-200 focus-visible:ring-emerald-500 h-12 text-slate-700 placeholder:text-slate-400 shadow-sm transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold ml-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-slate-200 focus-visible:ring-emerald-500 h-12 text-slate-700 placeholder:text-slate-400 shadow-sm transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-semibold ml-1">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-slate-200 focus-visible:ring-emerald-500 h-12 pr-10 text-slate-700 placeholder:text-slate-400 shadow-sm transition-all"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold ml-1">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white border-slate-200 focus-visible:ring-emerald-500 h-12 pr-10 text-slate-700 placeholder:text-slate-400 shadow-sm transition-all"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-emerald-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg animate-fade-in flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <p>{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-emerald-500 text-white btn-3d h-12 text-lg font-bold mt-2"
                disabled={loading}
              >
                {loading ? "Mendaftar..." : "Daftar Akun"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-600 mt-8">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-emerald-600 hover:text-emerald-500 underline underline-offset-4 font-bold transition-colors">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
