import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Package, Users, Palette } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
}

interface Profile {
  created_at: string;
  last_visit: string | null;
}

const COLORS = ["hsl(var(--accent))", "hsl(var(--primary))", "#22c55e", "#eab308", "#ef4444"];

const AdminAnalytics = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [ordersRes, profilesRes] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: true }),
      supabase.from("profiles").select("created_at, last_visit").order("created_at", { ascending: true }),
    ]);

    if (ordersRes.data) setOrders(ordersRes.data);
    if (profilesRes.data) setProfiles(profilesRes.data);
  };

  const getDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  };

  const getTimeRangeDays = () => {
    switch (timeRange) {
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
    }
  };

  const filteredOrders = orders.filter(
    (o) => new Date(o.created_at) > getDaysAgo(getTimeRangeDays())
  );

  const filteredProfiles = profiles.filter(
    (p) => new Date(p.created_at) > getDaysAgo(getTimeRangeDays())
  );

  // Revenue over time
  const revenueData = (() => {
    const days = getTimeRangeDays();
    const data: { date: string; revenue: number; orders: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const dayOrders = filteredOrders.filter(
        (o) => o.created_at.split("T")[0] === dateStr
      );
      
      data.push({
        date: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        revenue: dayOrders.reduce((sum, o) => sum + o.total_amount, 0),
        orders: dayOrders.length,
      });
    }
    
    // Group by week for 30d and 90d
    if (days > 7) {
      const grouped: typeof data = [];
      for (let i = 0; i < data.length; i += 7) {
        const week = data.slice(i, i + 7);
        grouped.push({
          date: week[0].date,
          revenue: week.reduce((sum, d) => sum + d.revenue, 0),
          orders: week.reduce((sum, d) => sum + d.orders, 0),
        });
      }
      return grouped;
    }
    
    return data;
  })();

  // Customer growth
  const customerGrowth = (() => {
    const days = getTimeRangeDays();
    const data: { date: string; customers: number; cumulative: number }[] = [];
    let cumulative = profiles.filter(
      (p) => new Date(p.created_at) <= getDaysAgo(days)
    ).length;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const newCustomers = filteredProfiles.filter(
        (p) => p.created_at.split("T")[0] === dateStr
      ).length;
      
      cumulative += newCustomers;
      
      data.push({
        date: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        customers: newCustomers,
        cumulative,
      });
    }
    
    return data;
  })();

  // Order status distribution
  const statusDistribution = (() => {
    const counts: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  })();

  // Calculate metrics
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const newCustomers = filteredProfiles.length;
  
  // Calculate growth vs previous period
  const prevPeriodOrders = orders.filter((o) => {
    const date = new Date(o.created_at);
    return date > getDaysAgo(getTimeRangeDays() * 2) && date <= getDaysAgo(getTimeRangeDays());
  });
  const prevRevenue = prevPeriodOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  return (
    <AdminLayout title="Analytics" subtitle="Insights and performance metrics">
      {/* Time Range Selector */}
      <div className="flex gap-2 mb-8">
        {(["7d", "30d", "90d"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 text-sm font-sans rounded-md transition-colors ${
              timeRange === range
                ? "bg-accent text-accent-foreground"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-secondary/50 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <div className={`flex items-center gap-1 text-sm ${revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
              {revenueGrowth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(revenueGrowth).toFixed(1)}%
            </div>
          </div>
          <p className="text-2xl font-serif">₹{totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="p-6 bg-secondary/50 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Orders</p>
            <Package size={18} className="text-accent" />
          </div>
          <p className="text-2xl font-serif">{filteredOrders.length}</p>
        </div>
        
        <div className="p-6 bg-secondary/50 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Avg. Order Value</p>
            <Palette size={18} className="text-accent" />
          </div>
          <p className="text-2xl font-serif">₹{avgOrderValue.toLocaleString()}</p>
        </div>
        
        <div className="p-6 bg-secondary/50 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">New Customers</p>
            <Users size={18} className="text-accent" />
          </div>
          <p className="text-2xl font-serif">{newCustomers}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="p-6 bg-secondary/30 border border-border rounded-lg">
          <h3 className="font-serif text-lg mb-4">Revenue Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="p-6 bg-secondary/30 border border-border rounded-lg">
          <h3 className="font-serif text-lg mb-4">Orders Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
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

        {/* Customer Growth */}
        <div className="p-6 bg-secondary/30 border border-border rounded-lg">
          <h3 className="font-serif text-lg mb-4">Customer Growth</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowth}>
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
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="p-6 bg-secondary/30 border border-border rounded-lg">
          <h3 className="font-serif text-lg mb-4">Order Status Distribution</h3>
          <div className="h-72">
            {statusDistribution.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No orders in this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--secondary))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
