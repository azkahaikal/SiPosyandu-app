import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { hitungStatusGizi } from "@/data/mockData";
import { useAuthStore } from "@/stores/authStore";
import { balitaService, pemeriksaanService, type Balita } from "@/services/balitaService";
import { Search, Plus, FileDown, Loader2, Edit2, Trash2, MoreVertical, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const statusConfig = {
  baik: { label: "Baik", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
  kurang: { label: "Kurang", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  buruk: { label: "Buruk", className: "bg-red-100 text-red-700 hover:bg-red-100" },
  stunting: { label: "Stunting", className: "bg-violet-100 text-violet-700 hover:bg-violet-100" },
  obesitas: { label: "Obesitas", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
};

type BalitaForm = {
  jenis_kelamin: "L" | "P";
  nama: string;
  nama_ibu: string;
  nik: string;
  tanggal_lahir: string;
  berat_badan?: string;
  tinggi_badan?: string;
  lingkar_kepala?: string;
};

export default function Balita() {
  const { user: currentUser } = useAuthStore();
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Balita[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BalitaForm>({
    jenis_kelamin: "L",
    nama: "",
    nama_ibu: "",
    nik: "",
    tanggal_lahir: "",
  });

  const canEdit = currentUser?.role === "admin";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await balitaService.getAll();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch balita:", error);
      toast.error("Gagal mengambil data balita");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return data.filter((b) => {
      const name = b.nama?.toLowerCase() || "";
      const motherName = (b.nama_ibu || b.user?.name || "").toLowerCase();
      const nik = b.nik?.toLowerCase() || "";
      const searchLower = search.toLowerCase();
      return name.includes(searchLower) || motherName.includes(searchLower) || nik.includes(searchLower);
    });
  }, [data, search]);

  const handleSave = async () => {
    if (!form.nama || !form.tanggal_lahir || !form.nama_ibu) {
      toast.error("Nama balita, tanggal lahir, dan nama ibu wajib diisi");
      return;
    }

    const hasInitialCheck = Boolean(form.berat_badan || form.tinggi_badan || form.lingkar_kepala);
    if (hasInitialCheck && (!form.berat_badan || !form.tinggi_badan)) {
      toast.error("BB dan TB wajib diisi bersama untuk pemeriksaan awal");
      return;
    }

    try {
      const payload = {
        nama: form.nama,
        nama_ibu: form.nama_ibu,
        tanggal_lahir: form.tanggal_lahir,
        jenis_kelamin: form.jenis_kelamin,
        nik: form.nik || "",
      };

      if (editingId) {
        await balitaService.update(editingId, payload);
        toast.success("Data balita berhasil diperbarui");
      } else {
        const newBalita = await balitaService.create(payload);

        // Jika ada data pemeriksaan awal, simpan juga
        if (hasInitialCheck) {
          const birthDate = new Date(form.tanggal_lahir);
          const now = new Date();
          const umurBulan = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
          
          const statusGizi = hitungStatusGizi(
            Number(form.berat_badan) || 0,
            Number(form.tinggi_badan) || 0,
            umurBulan,
            (form.jenis_kelamin as "L" | "P") || "L"
          );

          await pemeriksaanService.create({
            balita_id: newBalita.id,
            tanggal_periksa: new Date().toISOString().split("T")[0],
            berat_badan: Number(form.berat_badan) || 0,
            tinggi_badan: Number(form.tinggi_badan) || 0,
            lingkar_kepala: Number(form.lingkar_kepala) || 0,
            status_gizi: statusGizi,
            catatan: "Pemeriksaan awal",
          });
        }
        toast.success("Data balita berhasil ditambahkan");
      }

      await fetchData();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save balita:", error);
      toast.error("Gagal menyimpan data balita");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await balitaService.delete(id);
      toast.success("Data balita berhasil dihapus");
      fetchData();
    } catch (error) {
      console.error("Failed to delete balita:", error);
      toast.error("Gagal menghapus data balita");
    }
  };

  const handleEdit = (balita: Balita) => {
    setEditingId(balita.id);
    setForm({
      nama: balita.nama,
      nama_ibu: balita.nama_ibu || balita.user?.name || "",
      nik: balita.nik || "",
      tanggal_lahir: balita.tanggal_lahir,
      jenis_kelamin: balita.jenis_kelamin,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      jenis_kelamin: "L",
      nama: "",
      nama_ibu: "",
      nik: "",
      tanggal_lahir: "",
    });
  };

  const exportExcel = () => {
    const exportData = data.map(b => ({
      Nama: b.nama,
      NIK: b.nik || "-",
      "Tanggal Lahir": b.tanggal_lahir,
      "Jenis Kelamin": b.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
      "Nama Ibu": b.nama_ibu || b.user?.name || "-",
      "Status Gizi": b.pemeriksaans?.[0]?.status_gizi || "-"
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Balita");
    XLSX.writeFile(workbook, "data_balita.xlsx");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Data <span className="text-gradient">Balita</span></h2>
          <p className="text-slate-500 mt-1 font-medium">Kelola dan pantau data pemeriksaan balita secara digital.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" onClick={exportExcel} className="glass border-emerald-100 text-emerald-700 hover:bg-emerald-50 rounded-2xl font-bold transition-all">
            <FileDown className="h-5 w-5 mr-2" />
            Export Data
          </Button>
          {canEdit && (
            <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
              <DialogTrigger asChild>
                <Button size="lg" className="gradient-health text-white btn-3d rounded-2xl font-bold">
                  <Plus className="h-5 w-5 mr-2" />
                  Tambah Balita
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg !bg-white border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                <div className="p-8">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                      {editingId ? "Edit Data Balita" : "Tambah Data Balita"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-5 py-4">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Nama Balita</Label>
                        <Input value={form.nama || ""} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="bg-white border-slate-200 shadow-sm focus:border-emerald-500 transition-all h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Tanggal Lahir</Label>
                        <div className="relative">
                          <Input
                            type="date"
                            value={form.tanggal_lahir || ""}
                            onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
                            className="bg-white border-slate-200 shadow-sm focus:border-emerald-500 transition-all w-full pr-12 h-11 input-date-clean"
                          />
                          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 pointer-events-none">
                            <CalendarIcon className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Jenis Kelamin</Label>
                        <select
                          className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                          value={form.jenis_kelamin || "L"}
                          onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value as "L" | "P" })}
                        >
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Orang Tua (Ibu)</Label>
                        <Input
                          value={form.nama_ibu || ""}
                          onChange={(e) => setForm({ ...form, nama_ibu: e.target.value })}
                          className="bg-white border-slate-200 shadow-sm focus:border-emerald-500 transition-all h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">NIK</Label>
                      <Input value={form.nik || ""} onChange={(e) => setForm({ ...form, nik: e.target.value })} className="bg-white border-slate-200 shadow-sm focus:border-emerald-500 transition-all h-11" />
                    </div>
                    {!editingId && (
                      <div className="grid grid-cols-3 gap-5">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold text-xs">BB (kg)</Label>
                          <Input type="number" step="0.1" value={form.berat_badan || ""} onChange={(e) => setForm({ ...form, berat_badan: e.target.value })} className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold text-xs">TB (cm)</Label>
                          <Input type="number" step="0.1" value={form.tinggi_badan || ""} onChange={(e) => setForm({ ...form, tinggi_badan: e.target.value })} className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold text-xs">L. Kepala (cm)</Label>
                          <Input type="number" step="0.1" value={form.lingkar_kepala || ""} onChange={(e) => setForm({ ...form, lingkar_kepala: e.target.value })} className="h-11" />
                        </div>
                      </div>
                    )}
                    <Button onClick={handleSave} className="gradient-health text-white h-14 text-lg font-bold rounded-2xl mt-4 btn-3d w-full shadow-emerald-500/20">
                      {editingId ? "Perbarui Data" : "Simpan Data"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="border border-slate-100 bg-white shadow-2xl shadow-emerald-900/5 overflow-hidden rounded-[2rem]">
        <div className="p-6 bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Cari nama balita, ibu, atau NIK..."
              className="pl-10 h-11 bg-white border-slate-200 focus:ring-emerald-500 rounded-xl shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-medium">Memuat data balita...</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="font-bold text-slate-600 h-14 px-6">Nama Balita</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">Jenis Kelamin</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">Berat/Tinggi</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">Status Gizi</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">Nama Ibu</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14 px-6">NIK</TableHead>
                    {canEdit && <TableHead className="font-bold text-slate-600 h-14 text-center">Aksi</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b) => {
                    const latestPemeriksaan = b.pemeriksaans?.[0];
                    return (
                      <TableRow key={b.id} className="border-slate-100 hover:bg-emerald-50/30 transition-colors group">
                        <TableCell className="font-bold text-slate-700 px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                              {b.nama.charAt(0)}
                            </div>
                            {b.nama}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">{b.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</TableCell>
                        <TableCell className="text-slate-600 font-medium">
                          {latestPemeriksaan ? `${latestPemeriksaan.berat_badan} kg / ${latestPemeriksaan.tinggi_badan} cm` : "-"}
                        </TableCell>
                        <TableCell>
                          {latestPemeriksaan?.status_gizi ? (
                            <Badge className={`${statusConfig[latestPemeriksaan.status_gizi as keyof typeof statusConfig]?.className || ""} rounded-full px-3 py-1 border-0 shadow-sm`}>
                              {statusConfig[latestPemeriksaan.status_gizi as keyof typeof statusConfig]?.label || latestPemeriksaan.status_gizi}
                            </Badge>
                          ) : "-"}
                        </TableCell>
                        <TableCell className="text-slate-600">{b.nama_ibu || b.user?.name || "-"}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-slate-500 px-6">{b.nik || "-"}</TableCell>
                        {canEdit && (
                          <TableCell className="text-center px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="glass border-white/60">
                                <DropdownMenuItem onClick={() => handleEdit(b)} className="cursor-pointer">
                                  <Edit2 className="h-4 w-4 mr-2 text-blue-500" />
                                  Edit
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Hapus
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="glass border-white/60">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Hapus Data Balita?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tindakan ini tidak dapat dibatalkan. Semua data pemeriksaan terkait juga akan dihapus.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(b.id)} className="bg-red-600 hover:bg-red-700">
                                        Hapus
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={canEdit ? 7 : 6} className="text-center text-slate-400 py-20">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-10 w-10 opacity-20" />
                          <p className="font-medium text-lg">Tidak ada data ditemukan</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
