import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/stores/authStore";
import { jadwalService, type Jadwal } from "@/services/jadwalService";
import { CalendarDays, Clock, MapPin, CheckCircle2, XCircle, Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const statusConfig = {
  akan_datang: { label: "Akan Datang", className: "bg-blue-100 text-blue-700", icon: Clock },
  selesai: { label: "Selesai", className: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  dibatalkan: { label: "Dibatalkan", className: "bg-red-100 text-red-700", icon: XCircle },
};

const emptyForm = {
  nama_kegiatan: "",
  tanggal: "",
  waktu: "",
  lokasi: "",
  keterangan: "",
  status: "akan_datang" as Jadwal["status"],
};

const toTimeInputValue = (time: string) => time.slice(0, 5);

export default function JadwalPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState("semua");
  const [data, setData] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const canEdit = user?.role === "admin";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await jadwalService.getAll();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch jadwal:", error);
      toast.error("Gagal mengambil data jadwal");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (tab === "semua") return data;
    return data.filter((j) => j.status === tab);
  }, [data, tab]);

  const stats = useMemo(() => {
    return {
      akanDatang: data.filter((j) => j.status === "akan_datang").length,
      selesai: data.filter((j) => j.status === "selesai").length,
      dibatalkan: data.filter((j) => j.status === "dibatalkan").length,
    };
  }, [data]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (jadwal: Jadwal) => {
    setEditingId(jadwal.id);
    setForm({
      nama_kegiatan: jadwal.nama_kegiatan,
      tanggal: jadwal.tanggal,
      waktu: toTimeInputValue(jadwal.waktu),
      lokasi: jadwal.lokasi,
      keterangan: jadwal.keterangan || "",
      status: jadwal.status,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama_kegiatan || !form.tanggal || !form.waktu || !form.lokasi) {
      toast.error("Nama kegiatan, tanggal, waktu, dan lokasi wajib diisi");
      return;
    }

    try {
      if (editingId) {
        await jadwalService.update(editingId, form);
        toast.success("Jadwal berhasil diperbarui");
      } else {
        await jadwalService.create(form);
        toast.success("Jadwal berhasil ditambahkan");
      }
      await fetchData();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save jadwal:", error);
      toast.error("Gagal menyimpan jadwal");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await jadwalService.delete(id);
      toast.success("Jadwal berhasil dihapus");
      fetchData();
    } catch (error) {
      console.error("Failed to delete jadwal:", error);
      toast.error("Gagal menghapus jadwal");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Jadwal Pemeriksaan</h2>
          <p className="text-muted-foreground mt-1">Jadwal dan notifikasi pemeriksaan rutin</p>
        </div>
        {canEdit && (
          <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gradient-health text-white rounded-2xl font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Jadwal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl !bg-white border-none shadow-2xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Jadwal" : "Tambah Jadwal"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Nama Kegiatan</Label>
                  <Input value={form.nama_kegiatan} onChange={(e) => setForm({ ...form, nama_kegiatan: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Tanggal</Label>
                    <Input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Waktu</Label>
                    <Input type="time" value={form.waktu} onChange={(e) => setForm({ ...form, waktu: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Lokasi</Label>
                  <Input value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Jadwal["status"] })}
                  >
                    <option value="akan_datang">Akan Datang</option>
                    <option value="selesai">Selesai</option>
                    <option value="dibatalkan">Dibatalkan</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Keterangan</Label>
                  <Textarea value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
                </div>
                <Button onClick={handleSave} className="gradient-health text-white h-12 font-bold rounded-2xl">
                  {editingId ? "Perbarui Jadwal" : "Simpan Jadwal"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center"><Clock className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-2xl font-bold">{stats.akanDatang}</p><p className="text-xs text-muted-foreground">Akan Datang</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
              <div><p className="text-2xl font-bold">{stats.selesai}</p><p className="text-xs text-muted-foreground">Selesai</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center"><XCircle className="h-5 w-5 text-red-600" /></div>
              <div><p className="text-2xl font-bold">{stats.dibatalkan}</p><p className="text-xs text-muted-foreground">Dibatalkan</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="semua">Semua</TabsTrigger>
          <TabsTrigger value="akan_datang">Akan Datang</TabsTrigger>
          <TabsTrigger value="selesai">Selesai</TabsTrigger>
          <TabsTrigger value="dibatalkan">Dibatalkan</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-medium">Memuat jadwal...</p>
              </div>
            ) : (
              <>
                {filtered.map((j) => {
                  const config = statusConfig[j.status] || statusConfig.akan_datang;
                  const StatusIcon = config.icon;
                  return (
                    <Card key={j.id} className="card-shadow hover:card-shadow-hover transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-blue-50 shrink-0">
                              <CalendarDays className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm">{j.nama_kegiatan}</p>
                              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{j.tanggal}</div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{j.waktu}</div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{j.lokasi}</div>
                              </div>
                              {j.keterangan && <p className="text-xs text-muted-foreground mt-2">{j.keterangan}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge className={config.className}><StatusIcon className="h-3 w-3 mr-1" />{config.label}</Badge>
                            {canEdit && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(j)}><Edit2 className="h-4 w-4 text-blue-500" /></Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Hapus jadwal?</AlertDialogTitle>
                                      <AlertDialogDescription>Jadwal ini akan dihapus dari database.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(j.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Tidak ada jadwal ditemukan</p>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
