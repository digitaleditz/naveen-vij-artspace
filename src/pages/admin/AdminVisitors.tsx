import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Eye, Repeat, MousePointerClick } from "lucide-react";

interface PageView {
  id: string;
  visitor_id: string;
  session_id: string | null;
  path: string;
  referrer: string | null;
  created_at: string;
}

const toLocalInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const AdminVisitors = () => {
  const now = new Date();
  const defaultFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [from, setFrom] = useState(toLocalInput(defaultFrom));
  const [to, setTo] = useState(toLocalInput(now));
  const [granularity, setGranularity] = useState<"hour" | "day">("day");
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchViews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("page_views" as any)
      .select("id, visitor_id, session_id, path, referrer, created_at")
      .gte("created_at", new Date(from).toISOString())
      .lte("created_at", new Date(to).toISOString())
      .order("created_at", { ascending: true })
      .limit(20000);
    setViews(((data as any[]) || []) as PageView[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalViews = views.length;
  const uniqueVisitors = useMemo(
    () => new Set(views.map((v) => v.visitor_id)).size,
    [views]
  );
  const sessions = useMemo(
    () => new Set(views.map((v) => v.session_id || v.visitor_id)).size,
    [views]
  );
  const viewsPerVisitor = uniqueVisitors ? totalViews / uniqueVisitors : 0;

  const timeSeries = useMemo(() => {
    const buckets = new Map<string, { views: number; visitors: Set<string> }>();
    views.forEach((v) => {
      const d = new Date(v.created_at);
      const key =
        granularity === "hour"
          ? `${d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} ${String(d.getHours()).padStart(2, "0")}:00`
          : d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      if (!buckets.has(key)) buckets.set(key, { views: 0, visitors: new Set() });
      const b = buckets.get(key)!;
      b.views += 1;
      b.visitors.add(v.visitor_id);
    });
    return Array.from(buckets.entries()).map(([label, b]) => ({
      label,
      views: b.views,
      visitors: b.visitors.size,
    }));
  }, [views, granularity]);

  const topPages = useMemo(() => {
    const counts = new Map<string, number>();
    views.forEach((v) => counts.set(v.path, (counts.get(v.path) || 0) + 1));
    return Array.from(counts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [views]);

  const topReferrers = useMemo(() => {
    const counts = new Map<string, number>();
    views.forEach((v) => {
      let key = "Direct";
      if (v.referrer) {
        try {
          key = new URL(v.referrer).hostname;
        } catch {
          key = v.referrer;
        }
      }
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [views]);

  const setQuickRange = (hours: number) => {
    const end = new Date();
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000);
    setFrom(toLocalInput(start));
    setTo(toLocalInput(end));
    setGranularity(hours <= 48 ? "hour" : "day");
  };

  const tooltipStyle = {
    backgroundColor: "hsl(var(--secondary))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
  };

  const metrics = [
    { label: "Unique Visitors", value: uniqueVisitors, icon: Users },
    { label: "Total Visits", value: totalViews, icon: Eye },
    { label: "Sessions", value: sessions, icon: Repeat },
    { label: "Pages / Visitor", value: viewsPerVisitor.toFixed(1), icon: MousePointerClick },
  ];

  return (
    <AdminLayout title="Visitors" subtitle="Website traffic, filtered by date and time">
      <div className="p-6 bg-secondary/40 border border-border rounded-lg mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-sans">From</label>
            <Input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-sans">To</label>
            <Input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-sans">Group by</label>
            <div className="flex gap-2 mt-1">
              {(["hour", "day"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGranularity(g)}
                  className={`px-3 py-2 text-sm rounded-md font-sans transition-colors ${
                    granularity === g
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {g === "hour" ? "Hour" : "Day"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <Button onClick={fetchViews} disabled={loading} className="w-full">
              {loading ? "Loading..." : "Apply filter"}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Last 24 hours", hours: 24 },
            { label: "Last 7 days", hours: 24 * 7 },
            { label: "Last 30 days", hours: 24 * 30 },
            { label: "Last 90 days", hours: 24 * 90 },
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => setQuickRange(r.hours)}
              className="px-3 py-1.5 text-xs font-sans rounded-full bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="p-6 bg-secondary/50 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground font-sans">{m.label}</p>
              <m.icon size={18} className="text-accent" />
            </div>
            <p className="text-2xl font-serif">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-secondary/30 border border-border rounded-lg lg:col-span-2">
          <h3 className="font-serif text-lg mb-4">Visits & Unique Visitors</h3>
          <div className="h-80">
            {timeSeries.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground font-sans text-sm">
                No visits in this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    name="Visits"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent) / 0.2)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Unique visitors"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.15)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="p-6 bg-secondary/30 border border-border rounded-lg">
          <h3 className="font-serif text-lg mb-4">Top Pages</h3>
          <div className="h-72">
            {topPages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground font-sans text-sm">
                No data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPages} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <YAxis dataKey="path" type="category" width={120} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Visits" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="p-6 bg-secondary/30 border border-border rounded-lg">
          <h3 className="font-serif text-lg mb-4">Traffic Sources</h3>
          {topReferrers.length === 0 ? (
            <p className="text-muted-foreground font-sans text-sm">No data</p>
          ) : (
            <ul className="space-y-3">
              {topReferrers.map((r) => (
                <li key={r.source} className="flex items-center justify-between text-sm font-sans">
                  <span className="text-muted-foreground truncate mr-4">{r.source}</span>
                  <span className="font-serif text-base">{r.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVisitors;
