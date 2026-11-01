export interface NavItem {
  to: string;
  icon: string;
  label: string;
  adminOnly?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Utama",
    items: [
      { to: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
      { to: "/customers", icon: "bi-people", label: "Pelanggan", adminOnly: true },
      { to: "/water-usage", icon: "bi-droplet", label: "Cek Air" },
      { to: "/payments", icon: "bi-cash-coin", label: "Bayar Air" },
    ],
  },
  {
    label: "Administrasi",
    items: [
      { to: "/reports", icon: "bi-bar-chart", label: "Laporan", adminOnly: true },
      { to: "/rates", icon: "bi-tag", label: "Tarif", adminOnly: true },
      { to: "/users", icon: "bi-person-badge", label: "Petugas", adminOnly: true },
    ],
  },
];

export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/customers": "Pelanggan",
  "/water-usage": "Cek Air",
  "/payments": "Bayar Air",
  "/reports": "Laporan",
  "/rates": "Tarif",
  "/users": "Petugas",
};

export function getPageTitle(pathname: string) {
  return PAGE_TITLES[pathname] ?? "Dashboard";
}
