"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { GalleryImage } from "@/lib/types-prisma-mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GalleryGridProps {
  initialImages: GalleryImage[];
}

export default function GalleryGrid({ initialImages }: GalleryGridProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (images.length + selectedFiles.length > 50) {
      toast.error(`Cannot upload. Total gallery images would exceed the maximum limit of 50. Current: ${images.length}`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    for (const file of selectedFiles) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`File "${file.name}" is not supported. Only JPEG, PNG, and WebP are allowed (SVGs are blocked).`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds the 8 MB size limit.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    setUploading(true);
    const uploadedImages: GalleryImage[] = [];
    const newProgress: Record<string, number> = {};
    selectedFiles.forEach((f) => { newProgress[f.name] = 0; });
    setUploadProgress(newProgress);

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("files", file);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/admin/gallery", true);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress((prev) => ({ ...prev, [file.name]: percent }));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.data) {
                  uploadedImages.push(...response.data);
                }
              } catch (err) {
                console.error("Error parsing response:", err);
              }
              resolve();
            } else {
              let errMsg = "Upload failed";
              try {
                const res = JSON.parse(xhr.responseText);
                errMsg = res.error || errMsg;
              } catch (_) {}
              reject(new Error(errMsg));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Network error during upload."));
          };

          xhr.send(formData);
        });
      }

      setImages((prev) => {
        const combined = [...prev, ...uploadedImages];
        return combined.sort((a, b) => a.displayOrder - b.displayOrder || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });

      toast.success("All images uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload some images.");
    } finally {
      setUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpdateMetadata = async (id: string, updates: { altText?: string; displayOrder?: number }) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setImages((prev) =>
          prev
            .map((img) => (img.id === id ? data.data : img))
            .sort((a, b) => a.displayOrder - b.displayOrder || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
        toast.success("Metadata updated");
      } else {
        toast.error(data.error || "Failed to update metadata");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error updating metadata");
    }
  };

  const openDeleteDialog = (image: GalleryImage) => {
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/gallery/${imageToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
        toast.success("Gallery image deleted successfully!");
        setDeleteDialogOpen(false);
      } else {
        toast.error(data.error || "Failed to delete image");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error deleting image");
    } finally {
      setDeleting(false);
      setImageToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-8 shadow-md flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-[#1A3348] border border-[rgba(176,120,72,0.25)] flex items-center justify-center text-[#D4A46A]">
          <Upload className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider">
            Upload Gallery Images
          </h3>
          <p className="text-xs text-[#8A9BB0] max-w-sm">
            Drag & drop or click to browse files. Allowed: JPEG, PNG, WebP (SVGs blocked). Max size: 8 MB per file. Maximum total images: 50.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="gallery-file-input"
          />
          <label
            htmlFor="gallery-file-input"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] text-sm font-medium tracking-wide uppercase px-4 h-8 transition-all duration-200 shadow-md cursor-pointer select-none gap-2 disabled:opacity-50 disabled:pointer-events-none"
            aria-disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Choose Images"
            )}
          </label>
        </div>

        {uploading && Object.keys(uploadProgress).length > 0 && (
          <div className="w-full max-w-md bg-[#1A3348]/40 border border-[rgba(176,120,72,0.15)] rounded-lg p-4 text-left space-y-3 mt-4">
            <h4 className="text-xs font-semibold text-[#D4A46A] uppercase tracking-wider">
              Upload Progress
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {Object.entries(uploadProgress).map(([filename, progress]) => (
                <div key={filename} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-[#8A9BB0]">
                    <span className="truncate max-w-[70%]">{filename}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-[#1A3348] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#B07848] h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider">
          Active Gallery ({images.length} / 50)
        </h3>

        {images.length === 0 ? (
          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-16 text-center text-[#8A9BB0]">
            No images uploaded yet. Use the upload area above to add gallery images.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] overflow-hidden shadow-lg flex flex-col group relative"
              >
                <div className="relative aspect-square w-full bg-[#05111D] border-b border-[rgba(176,120,72,0.15)] overflow-hidden">
                  <Image
                    src={img.fileUrl}
                    alt={img.altText || img.fileName}
                    fill
                    sizes="(max-w-768px) 100vw, 250px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => openDeleteDialog(img)}
                    className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-black/60 hover:bg-[#E05252] text-white flex items-center justify-center shadow transition-colors duration-200"
                    title="Delete Image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <span className="text-xs text-[#8A9BB0] truncate block font-medium" title={img.fileName}>
                      {img.fileName}
                    </span>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#8A9BB0] uppercase tracking-wider block">Alt Text</label>
                      <Input
                        defaultValue={img.altText || ""}
                        onBlur={(e) => handleUpdateMetadata(img.id, { altText: e.target.value })}
                        placeholder="Image description..."
                        className="h-8 bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-xs text-[#F5F0E8] focus-visible:ring-[#B07848]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#8A9BB0] uppercase tracking-wider block">Display Order</label>
                      <Input
                        type="number"
                        defaultValue={img.displayOrder}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            handleUpdateMetadata(img.id, { displayOrder: val });
                          }
                        }}
                        className="h-8 bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-xs text-[#F5F0E8] focus-visible:ring-[#B07848] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              Delete Gallery Image
            </DialogTitle>
            <DialogDescription className="text-sm text-[#8A9BB0] pt-3">
              Are you sure you want to delete <span className="font-semibold text-[#F5F0E8]">{imageToDelete?.fileName}</span>? This action cannot be undone and the file will be deleted permanently from storage.
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
              {deleting ? "Deleting..." : "Delete Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
