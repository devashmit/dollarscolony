"use client";

import React, { useState } from "react";
import { Highlight, Amenity } from "@/lib/types-prisma-mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, HelpCircle } from "lucide-react";
import * as Icons from "lucide-react";

interface ContentManagerProps {
  initialHighlights: Highlight[];
  initialAmenities: Amenity[];
}

export default function ContentManager({
  initialHighlights,
  initialAmenities,
}: ContentManagerProps) {
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);

  // Modal State
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);
  const [amenityDialogOpen, setAmenityDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form State
  const [editingHighlight, setEditingHighlight] = useState<Highlight | null>(null);
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightDesc, setHighlightDesc] = useState("");
  const [highlightIcon, setHighlightIcon] = useState("");
  const [highlightOrder, setHighlightOrder] = useState(0);
  const [highlightActive, setHighlightActive] = useState(true);
  const [savingHighlight, setSavingHighlight] = useState(false);

  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [amenityLabel, setAmenityLabel] = useState("");
  const [amenityIcon, setAmenityIcon] = useState("");
  const [amenityCategory, setAmenityCategory] = useState("");
  const [amenityOrder, setAmenityOrder] = useState(0);
  const [amenityActive, setAmenityActive] = useState(true);
  const [savingAmenity, setSavingAmenity] = useState(false);

  // Deletion State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "highlight" | "amenity"; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Helper to render Lucide Icons dynamically
  const renderIcon = (iconName: string | null) => {
    if (!iconName) return <HelpCircle className="h-4 w-4 text-[#8A9BB0]" />;
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) return <HelpCircle className="h-4 w-4 text-[#8A9BB0]" />;
    return <IconComponent className="h-4 w-4 text-[#D4A46A]" />;
  };

  // Highlights handlers
  const openHighlightAdd = () => {
    setEditingHighlight(null);
    setHighlightTitle("");
    setHighlightDesc("");
    setHighlightIcon("MapPin");
    setHighlightOrder(highlights.length);
    setHighlightActive(true);
    setHighlightDialogOpen(true);
  };

  const openHighlightEdit = (h: Highlight) => {
    setEditingHighlight(h);
    setHighlightTitle(h.title);
    setHighlightDesc(h.description || "");
    setHighlightIcon(h.icon || "");
    setHighlightOrder(h.displayOrder);
    setHighlightActive(h.active);
    setHighlightDialogOpen(true);
  };

  const handleSaveHighlight = async () => {
    if (!highlightTitle) {
      toast.error("Title is required");
      return;
    }
    setSavingHighlight(true);

    const payload = {
      title: highlightTitle,
      description: highlightDesc,
      icon: highlightIcon,
      displayOrder: highlightOrder,
      active: highlightActive,
    };

    try {
      const url = editingHighlight ? `/api/admin/highlights/${editingHighlight.id}` : "/api/admin/highlights";
      const method = editingHighlight ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success && data.data) {
        if (editingHighlight) {
          setHighlights((prev) =>
            prev.map((h) => (h.id === editingHighlight.id ? data.data : h)).sort((a, b) => a.displayOrder - b.displayOrder)
          );
          toast.success("Highlight updated successfully!");
        } else {
          setHighlights((prev) => [...prev, data.data].sort((a, b) => a.displayOrder - b.displayOrder));
          toast.success("Highlight created successfully!");
        }
        setHighlightDialogOpen(false);
      } else {
        toast.error(data.error || "Failed to save highlight");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error saving highlight");
    } finally {
      setSavingHighlight(false);
    }
  };

  // Amenities handlers
  const openAmenityAdd = () => {
    setEditingAmenity(null);
    setAmenityLabel("");
    setAmenityIcon("DoorOpen");
    setAmenityCategory("");
    setAmenityOrder(amenities.length);
    setAmenityActive(true);
    setAmenityDialogOpen(true);
  };

  const openAmenityEdit = (am: Amenity) => {
    setEditingAmenity(am);
    setAmenityLabel(am.label);
    setAmenityIcon(am.icon || "");
    setAmenityCategory(am.category || "");
    setAmenityOrder(am.displayOrder);
    setAmenityActive(am.active);
    setAmenityDialogOpen(true);
  };

  const handleSaveAmenity = async () => {
    if (!amenityLabel) {
      toast.error("Label is required");
      return;
    }
    setSavingAmenity(true);

    const payload = {
      label: amenityLabel,
      icon: amenityIcon,
      category: amenityCategory,
      displayOrder: amenityOrder,
      active: amenityActive,
    };

    try {
      const url = editingAmenity ? `/api/admin/amenities/${editingAmenity.id}` : "/api/admin/amenities";
      const method = editingAmenity ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success && data.data) {
        if (editingAmenity) {
          setAmenities((prev) =>
            prev.map((am) => (am.id === editingAmenity.id ? data.data : am)).sort((a, b) => a.displayOrder - b.displayOrder)
          );
          toast.success("Amenity updated successfully!");
        } else {
          setAmenities((prev) => [...prev, data.data].sort((a, b) => a.displayOrder - b.displayOrder));
          toast.success("Amenity created successfully!");
        }
        setAmenityDialogOpen(false);
      } else {
        toast.error(data.error || "Failed to save amenity");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error saving amenity");
    } finally {
      setSavingAmenity(false);
    }
  };

  // Toggle active helper
  const handleToggleActive = async (id: string, type: "highlight" | "amenity", currentVal: boolean) => {
    try {
      const url = `/api/admin/${type}s/${id}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentVal }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (type === "highlight") {
          setHighlights((prev) => prev.map((h) => (h.id === id ? data.data : h)));
        } else {
          setAmenities((prev) => prev.map((am) => (am.id === id ? data.data : am)));
        }
        toast.success("Status toggled");
      } else {
        toast.error(data.error || "Failed to toggle status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error toggling status");
    }
  };

  // Delete handler
  const openDeleteConfirm = (id: string, type: "highlight" | "amenity", name: string) => {
    setDeleteTarget({ id, type, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const url = `/api/admin/${deleteTarget.type}s/${deleteTarget.id}`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        if (deleteTarget.type === "highlight") {
          setHighlights((prev) => prev.filter((h) => h.id !== deleteTarget.id));
        } else {
          setAmenities((prev) => prev.filter((am) => am.id !== deleteTarget.id));
        }
        toast.success(`${deleteTarget.type === "highlight" ? "Highlight" : "Amenity"} deleted successfully!`);
        setDeleteDialogOpen(false);
      } else {
        toast.error(data.error || "Failed to delete item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error deleting item");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="highlights" className="w-full">
        <TabsList className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#8A9BB0]">
          <TabsTrigger
            value="highlights"
            className="data-[state=active]:bg-[#1A3348] data-[state=active]:text-[#D4A46A]"
          >
            Project Highlights
          </TabsTrigger>
          <TabsTrigger
            value="amenities"
            className="data-[state=active]:bg-[#1A3348] data-[state=active]:text-[#D4A46A]"
          >
            Amenities
          </TabsTrigger>
        </TabsList>

        {/* Highlights Tab */}
        <TabsContent value="highlights" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider">
              Highlights List
            </h3>
            <Button
              onClick={openHighlightAdd}
              className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Highlight
            </Button>
          </div>

          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] overflow-hidden shadow-lg">
            {highlights.length === 0 ? (
              <div className="p-16 text-center text-[#8A9BB0]">
                No highlights defined. Click the button above to add one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#0A1D2B]">
                    <TableRow className="border-b border-[rgba(176,120,72,0.15)] hover:bg-transparent">
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-12 text-center">Icon</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Title</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Description</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-20 text-center">Order</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-24 text-center">Active</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-28 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {highlights.map((h) => (
                      <TableRow
                        key={h.id}
                        className="border-b border-[rgba(176,120,72,0.10)] hover:bg-[#1A3348]/20 cursor-pointer transition-colors"
                        onClick={() => openHighlightEdit(h)}
                      >
                        <TableCell className="text-center py-3">{renderIcon(h.icon)}</TableCell>
                        <TableCell className="font-semibold text-[#F5F0E8] py-3">{h.title}</TableCell>
                        <TableCell className="text-[#8A9BB0] py-3 max-w-sm truncate">
                          {h.description || "—"}
                        </TableCell>
                        <TableCell className="text-center text-[#8A9BB0] py-3 font-mono">{h.displayOrder}</TableCell>
                        <TableCell className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={h.active}
                            onCheckedChange={() => handleToggleActive(h.id, "highlight", h.active)}
                            className="border-[rgba(176,120,72,0.5)] data-[state=checked]:bg-[#B07848]"
                          />
                        </TableCell>
                        <TableCell className="text-right py-3 space-x-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openHighlightEdit(h)}
                            className="h-8 w-8 text-[#8A9BB0] hover:text-[#D4A46A] hover:bg-[#1A3348]/40"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteConfirm(h.id, "highlight", h.title)}
                            className="h-8 w-8 text-[#E05252]/70 hover:text-[#E05252] hover:bg-[#E05252]/10"
                          >
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
        </TabsContent>

        {/* Amenities Tab */}
        <TabsContent value="amenities" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider">
              Amenities List
            </h3>
            <Button
              onClick={openAmenityAdd}
              className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Amenity
            </Button>
          </div>

          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] overflow-hidden shadow-lg">
            {amenities.length === 0 ? (
              <div className="p-16 text-center text-[#8A9BB0]">
                No amenities defined. Click the button above to add one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#0A1D2B]">
                    <TableRow className="border-b border-[rgba(176,120,72,0.15)] hover:bg-transparent">
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-12 text-center">Icon</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Label</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Category</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-20 text-center">Order</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-24 text-center">Active</TableHead>
                      <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-28 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amenities.map((am) => (
                      <TableRow
                        key={am.id}
                        className="border-b border-[rgba(176,120,72,0.10)] hover:bg-[#1A3348]/20 cursor-pointer transition-colors"
                        onClick={() => openAmenityEdit(am)}
                      >
                        <TableCell className="text-center py-3">{renderIcon(am.icon)}</TableCell>
                        <TableCell className="font-semibold text-[#F5F0E8] py-3">{am.label}</TableCell>
                        <TableCell className="text-[#8A9BB0] py-3">{am.category || "—"}</TableCell>
                        <TableCell className="text-center text-[#8A9BB0] py-3 font-mono">{am.displayOrder}</TableCell>
                        <TableCell className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={am.active}
                            onCheckedChange={() => handleToggleActive(am.id, "amenity", am.active)}
                            className="border-[rgba(176,120,72,0.5)] data-[state=checked]:bg-[#B07848]"
                          />
                        </TableCell>
                        <TableCell className="text-right py-3 space-x-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openAmenityEdit(am)}
                            className="h-8 w-8 text-[#8A9BB0] hover:text-[#D4A46A] hover:bg-[#1A3348]/40"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteConfirm(am.id, "amenity", am.label)}
                            className="h-8 w-8 text-[#E05252]/70 hover:text-[#E05252] hover:bg-[#E05252]/10"
                          >
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
        </TabsContent>
      </Tabs>

      {/* Highlight Add/Edit Dialog */}
      <Dialog open={highlightDialogOpen} onOpenChange={setHighlightDialogOpen}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              {editingHighlight ? "Edit Project Highlight" : "Add Project Highlight"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Title *</label>
              <Input
                placeholder="e.g. 5 Acre Premium Development"
                value={highlightTitle}
                onChange={(e) => setHighlightTitle(e.target.value)}
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Description</label>
              <Textarea
                placeholder="Optional detailed highlight details..."
                value={highlightDesc}
                onChange={(e) => setHighlightDesc(e.target.value)}
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848] min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Lucide Icon Name</label>
                <Input
                  placeholder="e.g. MapPin, Home, Shield"
                  value={highlightIcon}
                  onChange={(e) => setHighlightIcon(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Display Order</label>
                <Input
                  type="number"
                  value={highlightOrder}
                  onChange={(e) => setHighlightOrder(parseInt(e.target.value, 10) || 0)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="highlight-active-chk"
                checked={highlightActive}
                onCheckedChange={(checked) => setHighlightActive(!!checked)}
                className="border-[rgba(176,120,72,0.5)] data-[state=checked]:bg-[#B07848]"
              />
              <label htmlFor="highlight-active-chk" className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider cursor-pointer">
                Active & Visible
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setHighlightDialogOpen(false)}
              className="border-[rgba(176,120,72,0.25)] text-[#8A9BB0] hover:text-[#F5F0E8] hover:bg-[#1A3348]/40"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveHighlight}
              disabled={savingHighlight}
              className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase"
            >
              {savingHighlight ? "Saving..." : "Save Highlight"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Amenity Add/Edit Dialog */}
      <Dialog open={amenityDialogOpen} onOpenChange={setAmenityDialogOpen}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              {editingAmenity ? "Edit Amenity" : "Add Amenity"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Label *</label>
              <Input
                placeholder="e.g. Multipurpose Hall"
                value={amenityLabel}
                onChange={(e) => setAmenityLabel(e.target.value)}
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Category</label>
              <Input
                placeholder="e.g. Clubhouse, Outdoor, Sports"
                value={amenityCategory}
                onChange={(e) => setAmenityCategory(e.target.value)}
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Lucide Icon Name</label>
                <Input
                  placeholder="e.g. DoorOpen, Users, Dumbbell"
                  value={amenityIcon}
                  onChange={(e) => setAmenityIcon(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Display Order</label>
                <Input
                  type="number"
                  value={amenityOrder}
                  onChange={(e) => setAmenityOrder(parseInt(e.target.value, 10) || 0)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="amenity-active-chk"
                checked={amenityActive}
                onCheckedChange={(checked) => setAmenityActive(!!checked)}
                className="border-[rgba(176,120,72,0.5)] data-[state=checked]:bg-[#B07848]"
              />
              <label htmlFor="amenity-active-chk" className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider cursor-pointer">
                Active & Visible
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setAmenityDialogOpen(false)}
              className="border-[rgba(176,120,72,0.25)] text-[#8A9BB0] hover:text-[#F5F0E8] hover:bg-[#1A3348]/40"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAmenity}
              disabled={savingAmenity}
              className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase"
            >
              {savingAmenity ? "Saving..." : "Save Amenity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              Delete {deleteTarget?.type === "highlight" ? "Highlight" : "Amenity"}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#8A9BB0] pt-3">
              Are you sure you want to delete <span className="font-semibold text-[#F5F0E8]">{deleteTarget?.name}</span>? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-[rgba(176,120,72,0.25)] text-[#8A9BB0] hover:text-[#F5F0E8] hover:bg-[#1A3348]/40"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-[#E05252] hover:bg-[#E05252]/90 text-[#F5F0E8] font-medium tracking-wide uppercase"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
