import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Search,
} from "lucide-react";

interface Order {
  id: string;
  status: string;
  shipping_status: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  total_amount: number;
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
  user_id: string;
  artwork_id: string;
}

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Order status updated successfully" });
      fetchOrders();
    }
  };

  const updateShippingInfo = async (orderId: string, updates: Partial<Order>) => {
    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: "Failed to update shipping", variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Shipping info updated" });
      fetchOrders();
      setSelectedOrder(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Clock size={16} className="text-blue-500" />;
      case "processing":
        return <Package size={16} className="text-amber-500" />;
      case "shipped":
        return <Truck size={16} className="text-purple-500" />;
      case "delivered":
        return <CheckCircle size={16} className="text-green-500" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-muted-foreground" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout title="Orders" subtitle="Manage customer orders and shipments">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search by order ID or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {["pending", "confirmed", "processing", "shipped", "delivered"].map((status) => (
          <div key={status} className="p-4 bg-secondary/50 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon(status)}
              <span className="text-xs uppercase tracking-wider capitalize">{status}</span>
            </div>
            <p className="text-xl font-serif">
              {orders.filter((o) => o.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Loading...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {searchTerm || statusFilter !== "all" ? "No orders match your filters" : "No orders yet"}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-secondary/30 border border-border rounded-lg"
            >
              <div className="flex flex-wrap gap-6 items-start justify-between">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(order.status)}
                    <span className="text-xs uppercase tracking-wider font-sans">
                      {order.status}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-muted-foreground mb-1">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground font-sans">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                    Amount
                  </p>
                  <p className="font-serif text-lg text-accent">
                    ₹{order.total_amount.toLocaleString()}
                  </p>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                    Shipping
                  </p>
                  <p className="text-sm font-sans whitespace-pre-line">
                    {order.shipping_address?.split("\n")[0] || "N/A"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-36 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={14} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="font-serif">Order Details</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                              Order ID
                            </p>
                            <p className="font-mono">{selectedOrder.id}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                              Shipping Address
                            </p>
                            <p className="whitespace-pre-line text-sm">
                              {selectedOrder.shipping_address || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                              Tracking Number
                            </p>
                            <Input
                              placeholder="Enter tracking number"
                              defaultValue={selectedOrder.tracking_number || ""}
                              onChange={(e) =>
                                setSelectedOrder({
                                  ...selectedOrder,
                                  tracking_number: e.target.value,
                                })
                              }
                              className="h-10"
                            />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                              Estimated Delivery
                            </p>
                            <Input
                              type="date"
                              defaultValue={selectedOrder.estimated_delivery || ""}
                              onChange={(e) =>
                                setSelectedOrder({
                                  ...selectedOrder,
                                  estimated_delivery: e.target.value,
                                })
                              }
                              className="h-10"
                            />
                          </div>
                          <Button
                            variant="hero"
                            className="w-full"
                            onClick={() =>
                              updateShippingInfo(selectedOrder.id, {
                                tracking_number: selectedOrder.tracking_number,
                                estimated_delivery: selectedOrder.estimated_delivery,
                              })
                            }
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
