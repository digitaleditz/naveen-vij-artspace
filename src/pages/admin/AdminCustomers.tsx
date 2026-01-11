import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Search, Package, Calendar } from "lucide-react";

interface Customer {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  last_visit: string | null;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCustomers(data);
    }
    setLoading(false);
  };

  const fetchCustomerOrders = async (userId: string) => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      setCustomerOrders(data);
    }
  };

  const handleViewCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    await fetchCustomerOrders(customer.user_id);
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.full_name?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm) ||
      customer.city?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (date: string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderStats = (userId: string) => {
    // This would need to be calculated from orders data
    // For now, we'll show it in the modal
    return { count: 0, total: 0 };
  };

  return (
    <AdminLayout title="Customers" subtitle="Manage your customer database">
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search by name, phone, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-2xl font-serif">{customers.length}</p>
          <p className="text-sm text-muted-foreground">Total Customers</p>
        </div>
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-2xl font-serif">
            {customers.filter((c) => {
              if (!c.last_visit) return false;
              const lastVisit = new Date(c.last_visit);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return lastVisit > weekAgo;
            }).length}
          </p>
          <p className="text-sm text-muted-foreground">Active This Week</p>
        </div>
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-2xl font-serif">
            {customers.filter((c) => {
              const joinDate = new Date(c.created_at);
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return joinDate > monthAgo;
            }).length}
          </p>
          <p className="text-sm text-muted-foreground">New This Month</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-secondary/30 border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? "No customers match your search" : "No customers yet"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="font-serif text-accent">
                          {customer.full_name?.[0]?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <span className="font-medium">
                        {customer.full_name || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.phone || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.city || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(customer.created_at)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(customer.last_visit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="font-serif">Customer Details</DialogTitle>
                        </DialogHeader>
                        {selectedCustomer && (
                          <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                                <span className="font-serif text-2xl text-accent">
                                  {selectedCustomer.full_name?.[0]?.toUpperCase() || "?"}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-serif text-xl">
                                  {selectedCustomer.full_name || "Unknown"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {selectedCustomer.phone || "No phone"}
                                  {selectedCustomer.city && ` • ${selectedCustomer.city}`}
                                </p>
                              </div>
                            </div>

                            {/* Activity */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-secondary/50 rounded-lg">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                  <Calendar size={14} />
                                  <span className="text-xs uppercase tracking-wider">Joined</span>
                                </div>
                                <p className="text-sm">{formatDate(selectedCustomer.created_at)}</p>
                              </div>
                              <div className="p-3 bg-secondary/50 rounded-lg">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                  <Calendar size={14} />
                                  <span className="text-xs uppercase tracking-wider">Last Visit</span>
                                </div>
                                <p className="text-sm">{formatDate(selectedCustomer.last_visit)}</p>
                              </div>
                            </div>

                            {/* Orders */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Package size={16} className="text-accent" />
                                <h4 className="font-serif">Order History</h4>
                              </div>
                              {customerOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                  No orders yet
                                </p>
                              ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {customerOrders.map((order) => (
                                    <div
                                      key={order.id}
                                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border"
                                    >
                                      <div>
                                        <p className="text-sm font-mono">
                                          #{order.id.slice(0, 8).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                          {order.status} • {formatDate(order.created_at)}
                                        </p>
                                      </div>
                                      <p className="font-serif text-accent">
                                        ₹{order.total_amount.toLocaleString()}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Total Spent */}
                            {customerOrders.length > 0 && (
                              <div className="pt-4 border-t border-border">
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Total Spent</span>
                                  <span className="font-serif text-xl text-accent">
                                    ₹{customerOrders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
