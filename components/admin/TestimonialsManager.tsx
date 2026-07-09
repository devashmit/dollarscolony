"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Edit, Plus, Trash2, Star } from "lucide-react";
import { Testimonial } from "@/lib/types-prisma-mock";

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsManager({ initialTestimonials }: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setEditingTestimonial(null);
    setAuthor("");
    setRole("");
    setCompany("");
    setBody("");
    setRating(5);
    setDisplayOrder(testimonials.length);
    setActive(true);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setAuthor(testimonial.author);
    setRole(testimonial.role || "");
    setCompany(testimonial.company || "");
    setBody(testimonial.body);
    setRating(testimonial.rating);
    setDisplayOrder(testimonial.displayOrder);
    setActive(testimonial.active);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!author.trim() || !body.trim()) {
      toast.error("Author and testimonial text are required");
      return;
    }

    setSaving(true);
    try {
      const payload = { author, role, company, body, rating, displayOrder, active };
      const method = editingTestimonial ? "PATCH" : "POST";
      const url = editingTestimonial ? `/api/admin/testimonials/${editingTestimonial.id}` : "/api/admin/testimonials";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (editingTestimonial) {
          setTestimonials((prev) => prev.map((item) => (item.id === editingTestimonial.id ? data.data : item)).sort((a, b) => a.displayOrder - b.displayOrder));
          toast.success("Testimonial updated successfully!");
        } else {
          setTestimonials((prev) => [...prev, data.data].sort((a, b) => a.displayOrder - b.displayOrder));
          toast.success("Testimonial created successfully!");
        }
        setDialogOpen(false);
        resetForm();
      } else {
        toast.error(data.error || "Failed to save testimonial");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error saving testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) => prev.filter((item) => item.id !== id));
        toast.success("Testimonial deleted successfully!");
      } else {
        toast.error(data.error || "Failed to delete testimonial");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error deleting testimonial");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider">Testimonials</h3>
          <p className="text-sm text-[#8A9BB0] mt-1">Show customer feedback on the public site.</p>
        </div>
        <Button onClick={openAdd} className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] overflow-hidden shadow-lg">
        {testimonials.length === 0 ? (
          <div className="p-16 text-center text-[#8A9BB0]">No testimonials yet. Add one using the button above.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#0A1D2B]">
                <TableRow className="border-b border-[rgba(176,120,72,0.15)] hover:bg-transparent">
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Author</TableHead>
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Role / Company</TableHead>
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Body</TableHead>
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-24 text-center">Rating</TableHead>
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-20 text-center">Active</TableHead>
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((item) => (
                  <TableRow key={item.id} className="border-b border-[rgba(176,120,72,0.10)] hover:bg-[#1A3348]/20">
                    <TableCell className="font-semibold text-[#F5F0E8] py-3">{item.author}</TableCell>
                    <TableCell className="text-[#8A9BB0] py-3">{[item.role, item.company].filter(Boolean).join(" • ") || "—"}</TableCell>
                    <TableCell className="text-[#8A9BB0] py-3 max-w-md truncate">{item.body}</TableCell>
                    <TableCell className="text-center text-[#D4A46A] py-3">
                      <div className="flex items-center justify-center gap-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-3.5 w-3.5 ${index < item.rating ? "fill-current" : "opacity-30"}`} />)}</div>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Checkbox checked={item.active} onCheckedChange={() => {}} className="border-[rgba(176,120,72,0.5)] data-[state=checked]:bg-[#B07848]" />
                    </TableCell>
                    <TableCell className="text-right py-3 space-x-1 whitespace-nowrap">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-8 w-8 text-[#8A9BB0] hover:text-[#D4A46A] hover:bg-[#1A3348]/40">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-[#E05252]/70 hover:text-[#E05252] hover:bg-[#E05252]/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Author *</label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Rating</label>
                <Input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value) || 5)} className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Role</label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Company</label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Testimonial</label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] min-h-[100px]" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Display Order</label>
                <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]" />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Checkbox id="testimonial-active" checked={active} onCheckedChange={(checked) => setActive(!!checked)} className="border-[rgba(176,120,72,0.5)] data-[state=checked]:bg-[#B07848]" />
                <label htmlFor="testimonial-active" className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider cursor-pointer">Active</label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[rgba(176,120,72,0.25)] text-[#8A9BB0] hover:text-[#F5F0E8] hover:bg-[#1A3348]/40">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase">{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
