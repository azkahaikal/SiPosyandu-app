import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import {
  LayoutDashboard,
  Baby,
  Heart,
  Brain,
  Map,
  UtensilsCrossed,
  CalendarDays,
  FileText,
  HeartPulse,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Baby, label: "Data Balita", path: "/balita" },
  { icon: Heart, label: "Data Ibu Hamil", path: "/ibu-hamil" },
  { icon: Brain, label: "Pendukung Keputusan", path: "/dss" },
  { icon: Map, label: "Pemetaan Wilayah", path: "/peta" },
  { icon: UtensilsCrossed, label: "Rencana Makan", path: "/meal-plan" },
  { icon: CalendarDays, label: "Jadwal", path: "/jadwal" },
  { icon: FileText, label: "Laporan", path: "/laporan" },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuthStore();

  // Filter nav items based on role
  const filteredNav = navItems.filter((item) => {
    const isLimitedUser = user?.role === "user" || (user?.role as string) === "ibu";

    if (isLimitedUser) {
      return ["/dashboard", "/balita", "/ibu-hamil", "/meal-plan", "/jadwal"].includes(item.path);
    }
    return true;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-health">
          <HeartPulse className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground leading-tight">SiPosyandu</h1>
          <p className="text-[10px] text-muted-foreground leading-tight">Sistem Informasi Posyandu</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-medium text-foreground">Siposyandu</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Sistem Informasi Posyandu Digital
          </p>
        </div>
      </div>
    </div>
  );
}
