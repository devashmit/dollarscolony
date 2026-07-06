"use client";

import React, { useState } from "react";
import { ProjectUpdate } from "@/lib/types-prisma-mock";
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
import { Plus, Edit, Trash2, Calendar } from "lucide-react";

interface UpdatesManagerProps {
  initialUpdates: ProjectUpdate[];
}

export default function UpdatesManager({ initialUpdates }: UpdatesManagerProps) {
  const [updates, setUpdates] = useState<ProjectUpdate[]>(initialUpdates);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editingUpdate, setEditingUpdate] = useState<ProjectUpdate | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ProjectUpdate | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openAddDialog = () => {
    setEditingUpdate(null);
    setTitle("");
    setBody("");
    const today = new Date().toISOString().split("T")[0];
    setPublishedAt(today);
    setActive(true);
    setDialogOpen(true);
  };

  const openEditDialog = (upd: ProjectUpdate) => {
    setEditingUpdate(upd);
    setTitle(upd.title);
    setBody(upd.body);
    const dateStr = new Date(upd.publishedAt).toISOString().split("T")[0];
    setPublishedAt(dateStr);
    setActive(upd.active);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title || !body) {
      toast.error("Title and body are required");
      return;
    }
    setSaving(true);

    const payload = {
      title,
      body,
      publishedAt: new Date(publishedAt),
      active,
    };

    try {
      const url = editingUpdate ? `/api/admin/updates/${editingUpdate.id}` : "/api/admin/updates";
      const method = editingUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success && data.data) {
        if (editingUpdate) {
          setUpdates((prev) =>
            prev.map((u) => (u.id === editingUpdate.id ? data.data : u)).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          );
          toast.success("Project update updated successfully!");
        } else {
          setUpdates((prev) => [data.data, ...prev].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
          toast.success("Project update created successfully!");
        }
        setDialogOpen(false);
      } else {
        toast.error(data.error || "Failed to save update");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error saving update");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/admin/updates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentVal }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUpdates((prev) => prev.map((u) => (u.id === id ? data.data : u)));
        toast.success("Status updated");
      } else {
        toast.error(data.error || "Failed to toggle status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error toggling status");
    }
  };

  const openDeleteConfirm = (upd: ProjectUpdate) => {
    setDeleteTarget(upd);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/updates/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setUpdates((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        toast.success("Project update deleted successfully!");
        setDeleteDialogOpen(false);
      } else {
        toast.error(data.error || "Failed to delete update");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error deleting update");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider">
          Updates Log ({updates.length})
        </h3>
        <Button
          onClick={openAddDialog}
          className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Update Notice
        </Button>
      </div>

      <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] overflow-hidden shadow-lg">
        {updates.length === 0 ? (
          <div className="p-16 text-center text-[#8A9BB0]">
            No project updates yet. Add one using the button above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#0A1D2B]">
                <TableRow className="border-b border-[rgba(176,120,72,0.15)] hover:bg-transparent">
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Title</TableHead>
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Body Preview</TableHead>
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-40">Published Date</TableHead>
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-24 text-center">Active</TableHead>
                  <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {updates.map((u) => (
                  <TableRow
                    key={u.id}
                    className="border-b border-[rgba(176,120,72,0.10)] hover:bg-[#1A3348]/20 transition-colors"
                  >
                    <TableCell className="font-bold text-[#F5F0E8] py-3">{u.title}</TableCell>
                    <TableCell className="text-[#8A9BB0] py-3 max-w-md truncate">
                      {u.body}
                    </TableCell>
                    <TableCell className="text-[#8A9BB0] py-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#D4A46A] shrink-0" />
                        {new Date(u.publishedAt).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Checkbox
                        checked={u.active}
                        onCheckedChange={() => handleToggleActive(u.id, u.active)}
                        className="border-[rgba(176,120,72,0.5)] data-[state=checked]:bg-[#B07848]"
                      />
                    </TableCell>
                    <TableCell className="text-right py-3 space-x-1 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(u)}
                        className="h-8 w-8 text-[#8A9BB0] hover:text-[#D4A46A] hover:bg-[#1A3348]/40"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteConfirm(u)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              {editingUpdate ? "Edit Project Update Notice" : "Add Project Update Notice"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Title *</label>
              <Input
                placeholder="e.g. Phase 1 Internal Road Work Completed"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Update Message (Body) *</label>
              <Textarea
                placeholder="Write detail notice updates here. Plain text only, no formatting."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848] min-h-[160px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Published Date</label>
                <Input
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848] font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <Checkbox
                  id="update-active-chk"
                  checked={active}
                  onCheckedChange={(checked) => setActive(!!checked)}
                  className="border-[rgba(176,120,72,0.5)] data-[state=checked]:bg-[#B07848]"
                />
                <label htmlFor="update-active-chk" className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider cursor-pointer">
                  Active & Public
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-[rgba(176,120,72,0.25)] text-[#8A9BB0] hover:text-[#F5F0E8] hover:bg-[#1A3348]/40"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase"
            >
              {saving ? "Saving..." : "Save Notice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              Delete Project Update
            </DialogTitle>
            <DialogDescription className="text-sm text-[#8A9BB0] pt-3">
              Are you sure you want to delete <span className="font-semibold text-[#F5F0E8]">{deleteTarget?.title}</span>? This action is permanent and cannot be undone.
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
