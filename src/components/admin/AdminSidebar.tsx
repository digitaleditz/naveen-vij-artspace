import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Palette,
  Users,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { id: "orders", label: "Orders", icon: Package, path: "/admin/orders" },
  { id: "artworks", label: "Artworks", icon: Palette, path: "/admin/artworks" },
  { id: "customers", label: "Customers", icon: Users, path: "/admin/customers" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { id: "inquiries", label: "Inquiries", icon: MessageSquare, path: "/admin/inquiries" },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen border-r border-border bg-secondary/30 p-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-2">
          Admin Panel
        </p>
        <h2 className="font-serif text-xl">Naveen Vij</h2>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/admin" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-sans transition-colors rounded-md",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
