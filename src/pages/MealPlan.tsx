import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/stores/authStore";
import { rencanaMakanService, type KategoriRencanaMakan, type RencanaMakan } from "@/services/rencanaMakanService";
import { UtensilsCrossed, Flame, Beef, Wheat, Droplets, Users, Baby, Heart, Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const kategoriConfig = {
  ibu_hamil: { label: "Ibu Hamil", icon: Heart, color: "bg-rose-50 text-rose-600", badge: "bg-rose-100 text-rose-700" },
  ibu_menyusui: { label: "Ibu Menyusui", icon: Users, color: "bg-blue-50 text-blue-600", badge: "bg-blue-100 text-blue-700" },
  balita: { label: "Balita", icon: Baby, color: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
};

const emptyForm = {
  nama: "",
  kategori: "balita" as KategoriRencanaMakan,
  bahan: "",
  kalori: "",
  protein: "",
  karbohidrat: "",
  lemak: "",
  alergi: "",
  cara_membuat: "",
};

const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function MealPlan() {
  const { user } = useAuthStore();
  const [filterKategori, setFilterKategori] = useState<string>("all");
  const [filterAlergi, setFilterAlergi] = useState("");
  const [data, setData] = useState<RencanaMakan[]>([]);
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
      const res = await rencanaMakanService.getAll();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch rencana makan:", error);
      toast.error("Gagal mengambil data rencana makan");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return data.filter((m) => {
      if (filterKategori !== "all" && m.kategori !== filterKategori) return false;
      if (filterAlergi && (m.alergi || []).some((a) => a.toLowerCase().includes(filterAlergi.toLowerCase()))) return false;
      return true;
    });
  }, [data, filterKategori, filterAlergi]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (item: RencanaMakan) => {
    setEditingId(item.id);
    setForm({
      nama: item.nama,
      kategori: item.kategori,
      bahan: item.bahan.join(", "),
      kalori: String(item.kalori),
      protein: String(item.protein),
      karbohidrat: String(item.karbohidrat),
      lemak: String(item.lemak),
      alergi: (item.alergi || []).join(", "),
      cara_membuat: item.cara_membuat,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama || !form.bahan || !form.cara_membuat) {
      toast.error("Nama menu, bahan, dan cara membuat wajib diisi");
      return;
    }

    const payload = {
      nama: form.nama,
      kategori: form.kategori,
      bahan: splitList(form.bahan),
      kalori: Number(form.kalori) || 0,
      protein: Number(form.protein) || 0,
      karbohidrat: Number(form.karbohidrat) || 0,
      lemak: Number(form.lemak) || 0,
      alergi: splitList(form.alergi),
      cara_membuat: form.cara_membuat,
    };

    try {
      if (editingId) {
        await rencanaMakanService.update(editingId, payload);
        toast.success("Rencana makan berhasil diperbarui");
      } else {
        await rencanaMakanService.create(payload);
        toast.success("Rencana makan berhasil ditambahkan");
      }
      await fetchData();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save rencana makan:", error);
      toast.error("Gagal menyimpan rencana makan");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await rencanaMakanService.delete(id);
      toast.success("Rencana makan berhasil dihapus");
      fetchData();
    } catch (error) {
      console.error("Failed to delete rencana makan:", error);
      toast.error("Gagal menghapus rencana makan");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rencana Makan</h2>
          <p className="text-muted-foreground mt-1">Rekomendasi menu bergizi untuk ibu dan anak</p>
        </div>
        {canEdit && (
          <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gradient-health text-white rounded-2xl font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl !bg-white border-none shadow-2xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Rencana Makan" : "Tambah Rencana Makan"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Nama Menu</Label>
                  <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Kategori</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value as KategoriRencanaMakan })}
                  >
                    <option value="balita">Balita</option>
                    <option value="ibu_hamil">Ibu Hamil</option>
                    <option value="ibu_menyusui">Ibu Menyusui</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Bahan</Label>
                  <Input placeholder="nasi, ayam, wortel" value={form.bahan} onChange={(e) => setForm({ ...form, bahan: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="grid gap-2">
                    <Label>Kalori</Label>
                    <Input type="number" value={form.kalori} onChange={(e) => setForm({ ...form, kalori: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Protein</Label>
                    <Input type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Karbo</Label>
                    <Input type="number" value={form.karbohidrat} onChange={(e) => setForm({ ...form, karbohidrat: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Lemak</Label>
                    <Input type="number" value={form.lemak} onChange={(e) => setForm({ ...form, lemak: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Alergi</Label>
                  <Input placeholder="seafood, susu" value={form.alergi} onChange={(e) => setForm({ ...form, alergi: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Cara Membuat</Label>
                  <Textarea value={form.cara_membuat} onChange={(e) => setForm({ ...form, cara_membuat: e.target.value })} />
                </div>
                <Button onClick={handleSave} className="gradient-health text-white h-12 font-bold rounded-2xl">
                  {editingId ? "Perbarui Menu" : "Simpan Menu"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {[
          ["all", "Semua"],
          ["ibu_hamil", "Ibu Hamil"],
          ["ibu_menyusui", "Ibu Menyusui"],
          ["balita", "Balita"],
        ].map(([value, label]) => (
          <Button
            key={value}
            variant={filterKategori === value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterKategori(value)}
            className={filterKategori === value ? "gradient-health text-white" : ""}
          >
            {label}
          </Button>
        ))}
        <Input
          className="max-w-xs"
          placeholder="Sembunyikan alergi..."
          value={filterAlergi}
          onChange={(e) => setFilterAlergi(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
          <p className="text-slate-500 font-medium">Memuat rencana makan...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => {
            const config = kategoriConfig[m.kategori];
            const Icon = config.icon;
            return (
              <Card key={m.id} className="card-shadow hover:card-shadow-hover transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`h-10 w-10 rounded-xl ${config.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge className={config.badge}>{config.label}</Badge>
                  </div>
                  <CardTitle className="text-base font-semibold mt-3">{m.nama}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Flame className="h-4 w-4 text-orange-500" />{m.kalori} kcal</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Beef className="h-4 w-4 text-red-500" />{m.protein}g protein</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Wheat className="h-4 w-4 text-amber-500" />{m.karbohidrat}g karbo</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Droplets className="h-4 w-4 text-blue-500" />{m.lemak}g lemak</div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-foreground mb-1.5">Bahan:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.bahan.map((b, i) => <Badge key={i} variant="secondary" className="text-xs font-normal">{b}</Badge>)}
                    </div>
                  </div>

                  {(m.alergi || []).length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-destructive mb-1">Alergi:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.alergi.map((a, i) => <Badge key={i} variant="destructive" className="text-xs">{a}</Badge>)}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Cara Membuat:</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.cara_membuat}</p>
                  </div>

                  {canEdit && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(m)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus rencana makan?</AlertDialogTitle>
                            <AlertDialogDescription>Menu ini akan dihapus dari database.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(m.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="py-16 text-center text-muted-foreground">
                <UtensilsCrossed className="h-12 w-12 mx-auto mb-3 opacity-40" />
                Tidak ada rencana makan ditemukan
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
