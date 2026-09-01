"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { GalleryImage } from "@/lib/types-prisma-mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Upload, Loader2, Video, Film, Plus, Play, ExternalLink } from "lucide-react";
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

function isMediaVideo(url: string, fileName?: string): boolean {
  const target = (url + " " + (fileName || "")).toLowerCase();
  return (
    target.includes(".mp4") ||
    target.includes(".webm") ||
    target.includes(".mov") ||
    target.includes(".m4v") ||
    target.includes(".ogg") ||
    target.includes("youtube.com") ||
    target.includes("youtu.be") ||
    target.includes("vimeo.com")
  );
}

export default function GalleryGrid({ initialImages }: GalleryGridProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Staging states for adding descriptions before upload
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<{ file: File; altText: string; displayOrder: number }[]>([]);

  // Video Link Dialog state
  const [videoLinkDialogOpen, setVideoLinkDialogOpen] = useState(false);
  const [videoLinkUrl, setVideoLinkUrl] = useState("");
  const [videoLinkTitle, setVideoLinkTitle] = useState("");
  const [videoLinkAlt, setVideoLinkAlt] = useState("");
  const [savingVideoLink, setSavingVideoLink] = useState(false);

  const handlePendingAltChange = (index: number, val: string) => {
    setPendingFiles((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, altText: val } : item))
    );
  };

  const handlePendingOrderChange = (index: number, val: number) => {
    setPendingFiles((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, displayOrder: val } : item))
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (images.length + selectedFiles.length > 50) {
      toast.error(`Cannot upload. Total gallery items would exceed the maximum limit of 50. Current: ${images.length}`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const allowedMimeTypes = [
      "image/jpeg", "image/png", "image/webp",
      "video/mp4", "video/webm", "video/quicktime"
    ];

    for (const file of selectedFiles) {
      const isVid = file.type.startsWith("video/");
      if (!allowedMimeTypes.includes(file.type) && !isVid) {
        toast.error(`File "${file.name}" is not supported. Allowed: JPEG, PNG, WebP, MP4, WebM, MOV.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      
      const maxSizeBytes = isVid ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast.error(`File "${file.name}" exceeds the ${isVid ? "100 MB video" : "10 MB image"} limit.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    // Stage files for user description inputs
    const staged = selectedFiles.map((file, idx) => ({
      file,
      altText: "",
      displayOrder: images.length + idx + 1,
    }));

    setPendingFiles(staged);
    setUploadDialogOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startPendingUpload = async () => {
    if (pendingFiles.length === 0) return;
    setUploading(true);
    setUploadDialogOpen(false);

    const uploadedImages: GalleryImage[] = [];
    const newProgress: Record<string, number> = {};
    pendingFiles.forEach((item) => {
      newProgress[item.file.name] = 0;
    });
    setUploadProgress(newProgress);

    try {
      for (const item of pendingFiles) {
        const formData = new FormData();
        formData.append("files", item.file);
        formData.append("altText", item.altText);
        formData.append("displayOrder", String(item.displayOrder));

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/admin/gallery", true);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress((prev) => ({ ...prev, [item.file.name]: percent }));
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

      toast.success("Media items uploaded successfully!");
      setPendingFiles([]);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload some media items.");
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleAddVideoLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoLinkUrl.trim()) {
      toast.error("Please enter a valid video URL");
      return;
    }

    setSavingVideoLink(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: videoLinkUrl.trim(),
          fileName: videoLinkTitle.trim() || "Video Link",
          altText: videoLinkAlt.trim() || videoLinkTitle.trim() || "Dollars Colony Video",
          displayOrder: images.length + 1,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setImages((prev) => [...prev, ...data.data].sort((a, b) => a.displayOrder - b.displayOrder));
        toast.success("Video link added successfully!");
        setVideoLinkDialogOpen(false);
        setVideoLinkUrl("");
        setVideoLinkTitle("");
        setVideoLinkAlt("");
      } else {
        toast.error(data.error || "Failed to save video link");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Network error adding video link");
    } finally {
      setSavingVideoLink(false);
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
        toast.success("Gallery item deleted successfully!");
        setDeleteDialogOpen(false);
      } else {
        toast.error(data.error || "Failed to delete item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error deleting item");
    } finally {
      setDeleting(false);
      setImageToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload & Add Media Card */}
      <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-8 shadow-md flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-[#1A3348] border border-[rgba(176,120,72,0.25)] flex items-center justify-center text-[#D4A46A]">
          <Film className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider">
            Upload Gallery Photos & Videos
          </h3>
          <p className="text-xs text-[#8A9BB0] max-w-md">
            Upload high-resolution photos (JPEG, PNG, WebP up to 10 MB) or drone/walkthrough videos (MP4, WebM, MOV up to 100 MB), or add YouTube video links.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="gallery-file-input"
          />
          <label
            htmlFor="gallery-file-input"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] text-sm font-medium tracking-wide uppercase px-4 h-9 transition-all duration-200 shadow-md cursor-pointer select-none gap-2 disabled:opacity-50 disabled:pointer-events-none"
            aria-disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Photos / Videos
              </>
            )}
          </label>

          <Button
            type="button"
            variant="outline"
            onClick={() => setVideoLinkDialogOpen(true)}
            className="border-[rgba(176,120,72,0.35)] text-[#D4A46A] hover:bg-[#1A3348] hover:text-[#F5F0E8] text-sm font-medium tracking-wide uppercase h-9 flex items-center gap-2"
          >
            <Video className="h-4 w-4" />
            Add YouTube / Video Link
          </Button>
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

      {/* Media Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider">
          Active Gallery Items ({images.length} / 50)
        </h3>

        {images.length === 0 ? (
          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-16 text-center text-[#8A9BB0]">
            No photos or videos uploaded yet. Use the upload area above to add gallery media.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((item) => {
              const isVideo = isMediaVideo(item.fileUrl, item.fileName);

              return (
                <div
                  key={item.id}
                  className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] overflow-hidden shadow-lg flex flex-col group relative"
                >
                  <div className="relative aspect-square w-full bg-[#05111D] border-b border-[rgba(176,120,72,0.15)] overflow-hidden flex items-center justify-center">
                    {isVideo ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-[#020B14]">
                        <video
                          src={item.fileUrl}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="h-11 w-11 rounded-full bg-black/60 border border-[#D4A46A] flex items-center justify-center text-[#D4A46A] shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="h-5 w-5 fill-[#D4A46A] ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 border border-[#D4A46A]/40 text-[10px] font-bold tracking-wider text-[#D4A46A] uppercase flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          VIDEO
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={item.fileUrl}
                        alt={item.altText || item.fileName}
                        fill
                        sizes="(max-w-768px) 100vw, 250px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => openDeleteDialog(item)}
                      className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-black/60 hover:bg-[#E05252] text-white flex items-center justify-center shadow transition-colors duration-200 z-10"
                      title="Delete Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                      <span className="text-xs text-[#8A9BB0] truncate block font-medium" title={item.fileName}>
                        {item.fileName}
                      </span>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-[#8A9BB0] uppercase tracking-wider block">
                          Caption / Alt Text
                        </label>
                        <Input
                          defaultValue={item.altText || ""}
                          onBlur={(e) => handleUpdateMetadata(item.id, { altText: e.target.value })}
                          placeholder="Media caption..."
                          className="h-8 bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-xs text-[#F5F0E8] focus-visible:ring-[#B07848]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-[#8A9BB0] uppercase tracking-wider block">
                          Display Order
                        </label>
                        <Input
                          type="number"
                          defaultValue={item.displayOrder}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) {
                              handleUpdateMetadata(item.id, { displayOrder: val });
                            }
                          }}
                          className="h-8 bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-xs text-[#F5F0E8] focus-visible:ring-[#B07848] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              Delete Gallery Item
            </DialogTitle>
            <DialogDescription className="text-sm text-[#8A9BB0] pt-3">
              Are you sure you want to delete <span className="font-semibold text-[#F5F0E8]">{imageToDelete?.fileName}</span>? This action cannot be undone.
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
              {deleting ? "Deleting..." : "Delete Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add YouTube / Video Link Modal */}
      <Dialog open={videoLinkDialogOpen} onOpenChange={setVideoLinkDialogOpen}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              Add Video Link
            </DialogTitle>
            <DialogDescription className="text-xs text-[#8A9BB0] pt-2">
              Add a direct link to a video or YouTube video URL.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddVideoLink} className="space-y-4 my-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                Video URL (YouTube, Vimeo, or MP4 URL) *
              </label>
              <Input
                type="url"
                required
                value={videoLinkUrl}
                onChange={(e) => setVideoLinkUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://example.com/video.mp4"
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-xs text-[#F5F0E8] focus-visible:ring-[#B07848]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                Video Title / Label
              </label>
              <Input
                value={videoLinkTitle}
                onChange={(e) => setVideoLinkTitle(e.target.value)}
                placeholder="e.g. Dollars Colony Drone Aerial Tour"
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-xs text-[#F5F0E8] focus-visible:ring-[#B07848]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                Caption / Description
              </label>
              <Input
                value={videoLinkAlt}
                onChange={(e) => setVideoLinkAlt(e.target.value)}
                placeholder="e.g. Scenic coastal views & entrance development progress"
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-xs text-[#F5F0E8] focus-visible:ring-[#B07848]"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-[rgba(176,120,72,0.15)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVideoLinkDialogOpen(false)}
                className="border-[rgba(176,120,72,0.25)] text-[#8A9BB0] hover:text-[#F5F0E8] hover:bg-[#1A3348]/40"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={savingVideoLink}
                className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase"
              >
                {savingVideoLink ? "Saving..." : "Add Video"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Pre-Upload Metadata Configuration Modal */}
      <Dialog open={uploadDialogOpen} onOpenChange={(open) => {
        if (!open && !uploading) {
          setUploadDialogOpen(false);
          setPendingFiles([]);
        }
      }}>
        <DialogContent className="bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold uppercase tracking-wider text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
              Configure Media Details
            </DialogTitle>
            <DialogDescription className="text-xs text-[#8A9BB0] pt-2">
              Add descriptions or captions to your photos & videos before uploading.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4 max-h-[50vh] overflow-y-auto pr-2">
            {pendingFiles.map((item, index) => {
              const isVideo = item.file.type.startsWith("video/");

              return (
                <div key={index} className="flex gap-4 p-3 rounded-lg bg-[#1A3348]/20 border border-[rgba(176,120,72,0.1)] items-start">
                  <div className="relative h-16 w-16 bg-[#05111D] border border-[rgba(176,120,72,0.15)] rounded-md overflow-hidden shrink-0 flex items-center justify-center">
                    {isVideo ? (
                      <div className="flex flex-col items-center justify-center text-[#D4A46A]">
                        <Video className="h-6 w-6" />
                        <span className="text-[8px] font-bold">VIDEO</span>
                      </div>
                    ) : (
                      <img
                        src={URL.createObjectURL(item.file)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="text-xs font-semibold text-[#F5F0E8] truncate">
                      {item.file.name}
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#8A9BB0] uppercase tracking-wider block">
                        Description / Caption
                      </label>
                      <Input
                        value={item.altText}
                        onChange={(e) => handlePendingAltChange(index, e.target.value)}
                        placeholder="e.g. Scenic drone footage of beach corridor..."
                        className="h-8 bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-xs text-[#F5F0E8] focus-visible:ring-[#B07848]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#8A9BB0] uppercase tracking-wider block">
                        Display Order
                      </label>
                      <Input
                        type="number"
                        value={item.displayOrder}
                        onChange={(e) => handlePendingOrderChange(index, parseInt(e.target.value, 10) || 0)}
                        className="h-8 bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-xs text-[#F5F0E8] focus-visible:ring-[#B07848] font-mono w-24"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t border-[rgba(176,120,72,0.15)] pt-4">
            <Button
              variant="outline"
              disabled={uploading}
              onClick={() => {
                setUploadDialogOpen(false);
                setPendingFiles([]);
              }}
              className="border-[rgba(176,120,72,0.25)] text-[#8A9BB0] hover:text-[#F5F0E8] hover:bg-[#1A3348]/40"
            >
              Cancel
            </Button>
            <Button
              onClick={startPendingUpload}
              disabled={uploading}
              className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase"
            >
              Upload Media
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
