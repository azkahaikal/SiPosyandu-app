import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthStore } from "@/stores/authStore";
import { ibuHamilService, pemeriksaanIbuService, type IbuHamil } from "@/services/ibuHamilService";
import { Search, Plus, FileDown, Loader2, Edit2, Trash2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type IbuHamilForm = {
  nama: string;
  umur: string;
  usia_kehamilan_awal: string;
  hpl: string;
  alamat: string;
  berat_badan?: string;
  tinggi_badan?: string;
  tekanan_darah?: string;
};

export default function IbuHamil() {
  const { user: currentUser } = useAuthStore();
  const [search, setSearch] = useState("");
  const [data, setData] = useState<IbuHamil[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<IbuHamilForm>({
    nama: "",
    umur: "",
    usia_kehamilan_awal: "",
    hpl: "",
    alamat: "",
  });

  const canEdit = currentUser?.role === "admin";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await ibuHamilService.getAll();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch ibu hamil:", error);
      toast.error("Gagal mengambil data ibu hamil");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return data.filter((i) => {
      const name = (i.nama || i.user?.name || "").toLowerCase();
      const hpl = i.hpl?.toLowerCase() || "";
      const alamat = i.alamat?.toLowerCase() || "";
      const searchLower = search.toLowerCase();
      return name.includes(searchLower) || hpl.includes(searchLower) || alamat.includes(searchLower);
    });
  }, [data, search]);

  const handleSave = async () => {
    if (!form.nama || !form.umur || !form.usia_kehamilan_awal || !form.hpl) {
      toast.error("Nama, umur, usia hamil, dan HPL wajib diisi");
      return;
    }

    try {
      const payload = {
        nama: form.nama,
        umur: Number(form.umur),
        usia_kehamilan_awal: Number(form.usia_kehamilan_awal),
        hpl: form.hpl || "",
        alamat: form.alamat || "",
      };

      if (editingId) {
        const current = data.find((i) => i.id === editingId);
        await ibuHamilService.update(editingId, payload);
        const pemeriksaanPayload = {
          tanggal_periksa: new Date().toISOString().split("T")[0],
          usia_kandungan: Number(form.usia_kehamilan_awal),
          berat_badan: Number(form.berat_badan) || 0,
          tinggi_badan: Number(form.tinggi_badan) || 0,
          tekanan_darah: form.tekanan_darah || "120/80",
          catatan: "Pemeriksaan awal",
        };

        if (current?.pemeriksaans?.[0]?.id) {
          await pemeriksaanIbuService.update(current.pemeriksaans[0].id, pemeriksaanPayload);
        } else if (form.berat_badan || form.tinggi_badan || form.tekanan_darah) {
          await pemeriksaanIbuService.create({
            ibu_hamil_id: editingId,
            ...pemeriksaanPayload,
          });
        }
        toast.success("Data ibu hamil berhasil diperbarui");
      } else {
        const newIbu = await ibuHamilService.create(payload);
        if (form.berat_badan || form.tinggi_badan || form.tekanan_darah) {
          await pemeriksaanIbuService.create({
            ibu_hamil_id: newIbu.id,
            tanggal_periksa: new Date().toISOString().split("T")[0],
            usia_kandungan: Number(form.usia_kehamilan_awal),
            berat_badan: Number(form.berat_badan) || 0,
            tinggi_badan: Number(form.tinggi_badan) || 0,
            tekanan_darah: form.tekanan_darah || "120/80",
            catatan: "Pemeriksaan awal",
          });
        }
        toast.success("Data ibu hamil berhasil ditambahkan");
      }

      fetchData();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save ibu hamil:", error);
      toast.error("Gagal menyimpan data ibu hamil");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ibuHamilService.delete(id);
      toast.success("Data ibu hamil berhasil dihapus");
      fetchData();
    } catch (error) {
      console.error("Failed to delete ibu hamil:", error);
      toast.error("Gagal menghapus data ibu hamil");
    }
  };

  const handleEdit = (ibu: IbuHamil) => {
    const pemeriksaan = ibu.pemeriksaans?.[0];
    setEditingId(ibu.id);
    setForm({
      nama: ibu.nama || ibu.user?.name || "",
      umur: ibu.umur?.toString() || "",
      usia_kehamilan_awal: ibu.usia_kehamilan_awal?.toString() || "",
      hpl: ibu.hpl,
      alamat: ibu.alamat || "",
      berat_badan: pemeriksaan?.berat_badan?.toString() || "",
      tinggi_badan: pemeriksaan?.tinggi_badan?.toString() || "",
      tekanan_darah: pemeriksaan?.tekanan_darah || "",
    });
    setOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      nama: "",
      umur: "",
      usia_kehamilan_awal: "",
      hpl: "",
      alamat: "",
    });
  };

  const exportExcel = () => {
    const exportData = data.map((i) => ({
      "Nama Ibu": i.nama || i.user?.name || "-",
      Umur: i.umur ?? "-",
      "Usia Hamil": `${i.usia_kehamilan_awal} minggu`,
      HPL: i.hpl,
      "Berat Badan": i.pemeriksaans?.[0]?.berat_badan ?? "-",
      "Tinggi Badan": i.pemeriksaans?.[0]?.tinggi_badan ?? "-",
      "Tekanan Darah": i.pemeriksaans?.[0]?.tekanan_darah || "-",
      Alamat: i.alamat || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Ibu Hamil");
    XLSX.writeFile(workbook, "data_ibu_hamil.xlsx");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Data <span className="text-gradient">Ibu Hamil</span></h2>
          <p className="text-slate-500 mt-1 font-medium">Kelola data kesehatan ibu hamil secara manual.</p>
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
                  Tambah Data
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg !bg-white border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                <div className="p-8">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                      {editingId ? "Edit Data Ibu Hamil" : "Tambah Data Ibu Hamil"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-5 py-4">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Nama Ibu</Label>
                        <Input value={form.nama || ""} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Umur</Label>
                        <Input type="number" value={form.umur || ""} onChange={(e) => setForm({ ...form, umur: e.target.value })} className="h-11" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Usia Hamil (Minggu)</Label>
                        <Input type="number" value={form.usia_kehamilan_awal || ""} onChange={(e) => setForm({ ...form, usia_kehamilan_awal: e.target.value })} className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">HPL</Label>
                        <Input type="date" value={form.hpl || ""} onChange={(e) => setForm({ ...form, hpl: e.target.value })} className="h-11" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Berat (kg)</Label>
                        <Input type="number" step="0.1" value={form.berat_badan || ""} onChange={(e) => setForm({ ...form, berat_badan: e.target.value })} className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Tinggi (cm)</Label>
                        <Input type="number" step="0.1" value={form.tinggi_badan || ""} onChange={(e) => setForm({ ...form, tinggi_badan: e.target.value })} className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Tensi</Label>
                        <Input placeholder="120/80" value={form.tekanan_darah || ""} onChange={(e) => setForm({ ...form, tekanan_darah: e.target.value })} className="h-11" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">Alamat</Label>
                      <Input value={form.alamat || ""} onChange={(e) => setForm({ ...form, alamat: e.target.value })} className="h-11" />
                    </div>
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
              placeholder="Cari nama ibu, HPL, atau alamat..."
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
                <p className="text-slate-500 font-medium">Memuat data ibu hamil...</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="font-bold text-slate-600 h-14 px-6">Nama Ibu</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">Umur</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">Usia Hamil</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">HPL</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">Berat</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">Tinggi</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">Tensi</TableHead>
                    <TableHead className="font-bold text-slate-600 h-14">Alamat</TableHead>
                    {canEdit && <TableHead className="font-bold text-slate-600 h-14 text-center">Aksi</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((i) => {
                    const latestPemeriksaan = i.pemeriksaans?.[0];
                    return (
                      <TableRow key={i.id} className="border-slate-100 hover:bg-emerald-50/30 transition-colors group">
                        <TableCell className="font-bold text-slate-700 px-6 py-4">{i.nama || i.user?.name || "-"}</TableCell>
                        <TableCell className="text-slate-600">{i.umur ? `${i.umur} tahun` : "-"}</TableCell>
                        <TableCell className="text-slate-600">{i.usia_kehamilan_awal} minggu</TableCell>
                        <TableCell className="text-slate-600">{i.hpl}</TableCell>
                        <TableCell className="text-slate-600">{latestPemeriksaan?.berat_badan ? `${latestPemeriksaan.berat_badan} kg` : "-"}</TableCell>
                        <TableCell className="text-slate-600">{latestPemeriksaan?.tinggi_badan ? `${latestPemeriksaan.tinggi_badan} cm` : "-"}</TableCell>
                        <TableCell className="text-slate-600">{latestPemeriksaan?.tekanan_darah || "-"}</TableCell>
                        <TableCell className="max-w-[220px] truncate text-slate-500">{i.alamat || "-"}</TableCell>
                        {canEdit && (
                          <TableCell className="text-center px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="glass border-white/60">
                                <DropdownMenuItem onClick={() => handleEdit(i)} className="cursor-pointer">
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
                                      <AlertDialogTitle>Hapus Data Ibu Hamil?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tindakan ini tidak dapat dibatalkan. Semua data pemeriksaan terkait juga akan dihapus.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(i.id)} className="bg-red-600 hover:bg-red-700">
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
                      <TableCell colSpan={canEdit ? 9 : 8} className="text-center text-slate-400 py-20">
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
