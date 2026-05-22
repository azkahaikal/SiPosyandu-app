import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Baby, Heart, AlertTriangle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { balitaService } from "@/services/balitaService";
import { ibuHamilService } from "@/services/ibuHamilService";
import type { BalitaRecord, IbuHamilRecord } from "@/types/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for leaflet default marker icon
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

const DefaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const balitaIcon = new Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M8 14s1.5 2 4 2 4-2 4-2'/%3E%3Cline x1='9' y1='9' x2='9.01' y2='9'/%3E%3Cline x1='15' y1='9' x2='15.01' y2='9'/%3E%3C/svg%3E",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const ibuIcon = new Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f43f5e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M8 14s1.5 2 4 2 4-2 4-2'/%3E%3Cline x1='9' y1='9' x2='9.01' y2='9'/%3E%3Cline x1='15' y1='9' x2='15.01' y2='9'/%3E%3C/svg%3E",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const WILAYAH_COORDS: Record<string, [number, number]> = {
  "Desa Mekar Jaya": [-6.9147, 107.6098],
  "Desa Suka Maju": [-6.918, 107.615],
};

function getCoord(alamat: string): [number, number] {
  for (const key of Object.keys(WILAYAH_COORDS)) {
    if (alamat.includes(key)) {
      const base = WILAYAH_COORDS[key];
      return [base[0] + (Math.random() - 0.5) * 0.002, base[1] + (Math.random() - 0.5) * 0.002];
    }
  }
  return [-6.9147, 107.6098];
}

export default function Peta() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ balitas: [] as BalitaRecord[], ibuHamils: [] as IbuHamilRecord[] });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [balitas, ibuHamils] = await Promise.all([balitaService.getAll(), ibuHamilService.getAll()]);
        setData({ balitas, ibuHamils });
      } catch (error) {
        console.error("Peta fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const balitaStats = useMemo(() => ({
    total: data.balitas.length,
    stunting: data.balitas.filter((b) => b.pemeriksaans?.[0]?.status_gizi === "stunting").length,
  }), [data]);

  const ibuStats = useMemo(() => ({
    total: data.ibuHamils.length,
    tinggi: data.ibuHamils.filter((i) => i.risiko === "tinggi").length,
  }), [data]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pemetaan Wilayah</h2>
        <p className="text-muted-foreground mt-1">Visualisasi sebaran data kesehatan per wilayah</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Baby className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{balitaStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Balita</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{balitaStats.stunting}</p>
                <p className="text-xs text-muted-foreground">Stunting</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{ibuStats.total}</p>
                <p className="text-xs text-muted-foreground">Ibu Hamil</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{ibuStats.tinggi}</p>
                <p className="text-xs text-muted-foreground">Risiko Tinggi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            Peta Sebaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={[-6.9147, 107.6098]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {data.balitas.map((b) => (
                <Marker key={`balita-${b.id}`} position={getCoord(b.user?.address || "")} icon={balitaIcon}>
                  <Popup>{b.nama}</Popup>
                </Marker>
              ))}
              {data.ibuHamils.map((i) => (
                <Marker key={`ibu-${i.id}`} position={getCoord(i.user?.address || "")} icon={ibuIcon}>
                  <Popup>{i.user?.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
