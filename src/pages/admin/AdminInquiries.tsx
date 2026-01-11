import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
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
import { Eye, MessageSquare, Mail, Phone } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  inquiry_type: string;
  artwork_id: string | null;
  created_at: string;
}

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    // Note: Admins may need RLS policy to view all inquiries
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setInquiries(data);
    }
    setLoading(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout title="Inquiries" subtitle="Customer inquiries and messages">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={16} className="text-accent" />
            <span className="text-sm text-muted-foreground">Total Inquiries</span>
          </div>
          <p className="text-2xl font-serif">{inquiries.length}</p>
        </div>
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Artwork Inquiries</p>
          <p className="text-2xl font-serif">
            {inquiries.filter((i) => i.inquiry_type === "artwork").length}
          </p>
        </div>
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">General Inquiries</p>
          <p className="text-2xl font-serif">
            {inquiries.filter((i) => i.inquiry_type !== "artwork").length}
          </p>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-secondary/30 border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No inquiries yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>
                    <span className="text-xs uppercase tracking-wider px-2 py-1 bg-accent/10 text-accent rounded">
                      {inquiry.inquiry_type}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{inquiry.email}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(inquiry.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="font-serif">Inquiry Details</DialogTitle>
                        </DialogHeader>
                        {selectedInquiry && (
                          <div className="space-y-6">
                            {/* Contact Info */}
                            <div className="p-4 bg-secondary/50 rounded-lg">
                              <h4 className="font-serif text-lg mb-3">{selectedInquiry.name}</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail size={14} className="text-muted-foreground" />
                                  <a
                                    href={`mailto:${selectedInquiry.email}`}
                                    className="text-accent hover:underline"
                                  >
                                    {selectedInquiry.email}
                                  </a>
                                </div>
                                {selectedInquiry.phone && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone size={14} className="text-muted-foreground" />
                                    <a
                                      href={`tel:${selectedInquiry.phone}`}
                                      className="text-accent hover:underline"
                                    >
                                      {selectedInquiry.phone}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                                  Type
                                </p>
                                <p className="capitalize">{selectedInquiry.inquiry_type}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                                  Date
                                </p>
                                <p>{formatDate(selectedInquiry.created_at)}</p>
                              </div>
                            </div>

                            {/* Message */}
                            <div>
                              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                                Message
                              </p>
                              <p className="text-sm whitespace-pre-line p-4 bg-background/50 rounded-lg border border-border">
                                {selectedInquiry.message}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => window.open(`mailto:${selectedInquiry.email}`)}
                              >
                                <Mail size={14} className="mr-2" />
                                Reply via Email
                              </Button>
                              {selectedInquiry.phone && (
                                <Button
                                  variant="outline"
                                  onClick={() => window.open(`tel:${selectedInquiry.phone}`)}
                                >
                                  <Phone size={14} />
                                </Button>
                              )}
                            </div>
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

export default AdminInquiries;
