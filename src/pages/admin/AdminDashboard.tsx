import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Package, Palette, Users, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface DashboardStats {
  totalOrders: number;
  totalArtworks: number;
  totalCustomers: number;
  totalRevenue: number;
}

interface Order {
  created_at: string;
  total_amount: number;
  status: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalArtworks: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [orderTrend, setOrderTrend] = useState<{ date: string; orders: number; revenue: number }[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch orders
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch artworks count
    const { count: artworkCount } = await supabase
      .from("artworks")
      .select("*", { count: "exact", head: true });

    // Fetch customers count
    const { count: customerCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (orders) {
      const revenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
      setStats({
        totalOrders: orders.length,
        totalArtworks: artworkCount || 0,
        totalCustomers: customerCount || 0,
        totalRevenue: revenue,
      });
      setRecentOrders(orders.slice(0, 5));

      // Calculate order trend by day (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
      });

      const trend = last7Days.map((date) => {
        const dayOrders = orders.filter(
          (o) => o.created_at.split("T")[0] === date
        );
        return {
          date: new Date(date).toLocaleDateString("en-IN", { weekday: "short" }),
          orders: dayOrders.length,
          revenue: dayOrders.reduce((sum, o) => sum + o.total_amount, 0),
        };
      });
      setOrderTrend(trend);
    }
  };

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: Package, color: "text-blue-500" },
    { label: "Artworks", value: stats.totalArtworks, icon: Palette, color: "text-purple-500" },
    { label: "Customers", value: stats.totalCustomers, icon: Users, color: "text-green-500" },
    { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your gallery">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-6 bg-secondary/50 border border-border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-serif">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-sans">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Trend */}
        <div className="p-6 bg-secondary/30 border border-border rounded-lg">
          <h3 className="font-serif text-lg mb-4">Orders This Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--secondary))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="p-6 bg-secondary/30 border border-border rounded-lg">
          <h3 className="font-serif text-lg mb-4">Revenue This Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--secondary))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="p-6 bg-secondary/30 border border-border rounded-lg">
        <h3 className="font-serif text-lg mb-4">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.created_at}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border"
              >
                <div>
                  <p className="text-sm font-sans">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                </div>
                <p className="font-serif text-accent">₹{order.total_amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
