"use client";

import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, CheckCircle, FileUp, Loader2, Plus } from "lucide-react";

interface ConfigItem {
  key: string;
  value: string;
  label: string;
}

interface AssetItem {
  key: string;
  title: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string | Date;
}

interface AdminItem {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
  createdAt: string;
}

interface SettingsManagerProps {
  configs: ConfigItem[];
  assets: AssetItem[];
  admins: AdminItem[];
}

export default function SettingsManager({ configs, assets, admins }: SettingsManagerProps) {
  const configMap = React.useMemo(() => {
    const map: Record<string, ConfigItem> = {};
    configs.forEach((c) => { map[c.key] = c; });
    return map;
  }, [configs]);

  const [phoneNumber, setPhoneNumber] = useState(configMap.phone_number?.value || "");
  const [whatsappNumber, setWhatsappNumber] = useState(configMap.whatsapp_number?.value || "");
  const [savingContact, setSavingContact] = useState(false);

  const [pricingLifestyle, setPricingLifestyle] = useState(configMap.pricing_text_lifestyle?.value || "");
  const [pricingPremium, setPricingPremium] = useState(configMap.pricing_text_premium?.value || "");
  const [pricingSignature, setPricingSignature] = useState(configMap.pricing_text_signature?.value || "");
  const [pricingGeneral, setPricingGeneral] = useState(configMap.pricing_text_general?.value || "");
  const [savingPricing, setSavingPricing] = useState(false);

  const [projectContent, setProjectContent] = useState(configMap.project_content?.value || "");
  const [savingContent, setSavingContent] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // New admin state
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [currentAdminPassword, setCurrentAdminPassword] = useState("");
  const [savingAdmin, setSavingAdmin] = useState(false);

  // Admin list state
  const [adminsList, setAdminsList] = useState<AdminItem[]>(admins);

  // Deletion state
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false);

  const [mediaAssets, setMediaAssets] = useState<Record<string, AssetItem>>(() => {
    const map: Record<string, AssetItem> = {};
    assets.forEach((a) => { map[a.key] = a; });
    return map;
  });

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const brochureInputRef = useRef<HTMLInputElement>(null);
  const masterplanPdfInputRef = useRef<HTMLInputElement>(null);
  const masterplanImgInputRef = useRef<HTMLInputElement>(null);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      toast.error("Public phone number must be exactly 10 digits starting with 6-9");
      return;
    }
    if (!/^91[6-9]\d{9}$/.test(whatsappNumber)) {
      toast.error("WhatsApp number must start with 91 followed by 10 digits");
      return;
    }

    setSavingContact(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [
            { key: "phone_number", value: phoneNumber },
            { key: "whatsapp_number", value: whatsappNumber },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Contact info saved successfully!");
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error saving contact details");
    } finally {
      setSavingContact(false);
    }
  };

  const handleSavePricing = async () => {
    setSavingPricing(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [
            { key: "pricing_text_lifestyle", value: pricingLifestyle },
            { key: "pricing_text_premium", value: pricingPremium },
            { key: "pricing_text_signature", value: pricingSignature },
            { key: "pricing_text_general", value: pricingGeneral },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Pricing texts saved successfully!");
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error saving pricing notes");
    } finally {
      setSavingPricing(false);
    }
  };

  const handleSaveContent = async () => {
    setSavingContent(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [
            { key: "project_content", value: projectContent },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project content saved successfully!");
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error saving project content");
    } finally {
      setSavingContent(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/admin/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error changing password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName || !adminEmail || !adminPassword || !currentAdminPassword) {
      toast.error("All fields, including your current password, are required");
      return;
    }
    if (adminPassword.length < 6) {
      toast.error("New admin's password must be at least 6 characters");
      return;
    }

    setSavingAdmin(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adminName,
          email: adminEmail,
          password: adminPassword,
          currentPassword: currentAdminPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Admin user ${data.data.email} created successfully!`);
        setAdminName("");
        setAdminEmail("");
        setAdminPassword("");
        setCurrentAdminPassword("");
        // Prepend the new admin to local state list
        setAdminsList((prev) => [
          {
            id: data.data.id,
            name: data.data.name || adminName,
            email: data.data.email,
            role: "admin",
            lastLoginAt: null,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else {
        toast.error(data.error || "Failed to add admin user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error adding admin");
    } finally {
      setSavingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingAdminId || !deleteConfirmPassword) {
      toast.error("Your current password is required to delete an admin");
      return;
    }

    setIsDeletingAdmin(true);
    try {
      const res = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingAdminId, currentPassword: deleteConfirmPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Admin user removed successfully!");
        setAdminsList((prev) => prev.filter((a) => a.id !== deletingAdminId));
        setDeletingAdminId(null);
        setDeleteConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to remove admin user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error removing admin");
    } finally {
      setIsDeletingAdmin(false);
    }
  };

  const handleUploadDocument = async (key: string, fileInputRef: React.RefObject<HTMLInputElement | null>) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (key === "masterplan_image") {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Only JPEG, PNG, or WebP images are allowed (SVGs are blocked)");
        return;
      }
      if (sizeMB > 8) {
        toast.error("Image file size exceeds 8 MB limit");
        return;
      }
    } else {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (sizeMB > 20) {
        toast.error("PDF file size exceeds 20 MB limit");
        return;
      }
    }

    setUploading((prev) => ({ ...prev, [key]: true }));
    setUploadProgress((prev) => ({ ...prev, [key]: 0 }));

    const formData = new FormData();
    formData.append("file", file);

    const apiPathMap: Record<string, string> = {
      brochure: "brochure",
      masterplan_pdf: "masterplan-pdf",
      masterplan_image: "masterplan-image",
    };

    try {
      const xhr = new XMLHttpRequest();
      const uploadUrl = `/api/admin/uploads/${apiPathMap[key]}`;

      await new Promise<void>((resolve, reject) => {
        xhr.open("POST", uploadUrl, true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress((prev) => ({ ...prev, [key]: percent }));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.success && res.data) {
                setMediaAssets((prev) => ({ ...prev, [key]: res.data }));
                toast.success(`${file.name} uploaded successfully!`);
              }
            } catch (err) {
              console.error(err);
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
          reject(new Error("Network error uploading file"));
        };

        xhr.send(formData);
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload document");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
      setUploadProgress((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="w-full flex justify-start overflow-x-auto bg-[#0F2535] border border-[rgba(176,120,72,0.25)] text-[#8A9BB0] h-auto p-1 whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-[#1A3348] data-[state=active]:text-[#D4A46A]"
          >
            Contact Info
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="data-[state=active]:bg-[#1A3348] data-[state=active]:text-[#D4A46A]"
          >
            Project Content
          </TabsTrigger>
          <TabsTrigger
            value="pricing"
            className="data-[state=active]:bg-[#1A3348] data-[state=active]:text-[#D4A46A]"
          >
            Pricing Copy
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-[#1A3348] data-[state=active]:text-[#D4A46A]"
          >
            Documents & Downloads
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[#1A3348] data-[state=active]:text-[#D4A46A]"
          >
            Security & Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-6 mt-6 max-w-lg">
          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 shadow-md space-y-6">
            <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider border-b border-[rgba(176,120,72,0.15)] pb-3">
              Configure Call Channels
            </h3>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  Public Phone Number
                </label>
                <Input
                  id="phone"
                  placeholder="e.g. 9035624148"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/20 focus-visible:ring-[#B07848]"
                />
                <p className="text-[10px] text-[#8A9BB0]/60 italic">
                  10 digits, must start with 6–9 (e.g. 9035624148)
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="whatsapp" className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  WhatsApp Number with Country Code
                </label>
                <Input
                  id="whatsapp"
                  placeholder="e.g. 919035624148"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/20 focus-visible:ring-[#B07848]"
                />
                <p className="text-[10px] text-[#8A9BB0]/60 italic">
                  Must start with 91 followed by 10 digits (e.g. 919035624148)
                </p>
              </div>

              <Button
                type="submit"
                disabled={savingContact}
                className="w-full bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center justify-center gap-2 mt-2"
              >
                <Save className="h-4 w-4" />
                {savingContact ? "Saving..." : "Save Config"}
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6 mt-6 max-w-2xl">
          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 shadow-md space-y-6">
            <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider border-b border-[rgba(176,120,72,0.15)] pb-3">
              Configure Pricing Text
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  Pricing Text — Lifestyle Plots
                </label>
                <Textarea
                  placeholder="Enter lifestyle collection pricing info..."
                  value={pricingLifestyle}
                  onChange={(e) => setPricingLifestyle(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] min-h-[70px] focus-visible:ring-[#B07848]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  Pricing Text — Premium Plots
                </label>
                <Textarea
                  placeholder="Enter premium collection pricing info..."
                  value={pricingPremium}
                  onChange={(e) => setPricingPremium(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] min-h-[70px] focus-visible:ring-[#B07848]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  Pricing Text — Signature Plots
                </label>
                <Textarea
                  placeholder="Enter signature collection pricing info..."
                  value={pricingSignature}
                  onChange={(e) => setPricingSignature(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] min-h-[70px] focus-visible:ring-[#B07848]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  General Pricing Note
                </label>
                <Textarea
                  placeholder="Enter general notes or tax additions text..."
                  value={pricingGeneral}
                  onChange={(e) => setPricingGeneral(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] min-h-[70px] focus-visible:ring-[#B07848]"
                />
              </div>

              <Button
                onClick={handleSavePricing}
                disabled={savingPricing}
                className="w-full bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center justify-center gap-2 mt-2"
              >
                <Save className="h-4 w-4" />
                {savingPricing ? "Saving..." : "Save All Prices"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6 mt-6 max-w-2xl">
          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 shadow-md space-y-6">
            <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider border-b border-[rgba(176,120,72,0.15)] pb-3">
              Configure Project Content
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  Project Description / Content
                </label>
                <Textarea
                  placeholder="Enter detailed project description or welcome content..."
                  value={projectContent}
                  onChange={(e) => setProjectContent(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] min-h-[140px] focus-visible:ring-[#B07848]"
                />
              </div>

              <Button
                onClick={handleSaveContent}
                disabled={savingContent}
                className="w-full bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center justify-center gap-2 mt-2"
              >
                <Save className="h-4 w-4" />
                {savingContent ? "Saving..." : "Save Project Content"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6 mt-6 max-w-3xl">
          {[
            {
              key: "brochure",
              title: "Dollars Colony Brochure PDF",
              ref: brochureInputRef,
              accept: ".pdf",
              hint: "PDF format up to 20 MB size limit",
            },
            {
              key: "masterplan_pdf",
              title: "Masterplan PDF Document",
              ref: masterplanPdfInputRef,
              accept: ".pdf",
              hint: "PDF format up to 20 MB size limit",
            },
            {
              key: "masterplan_image",
              title: "Masterplan Image Graphic",
              ref: masterplanImgInputRef,
              accept: "image/jpeg,image/png,image/webp",
              hint: "JPEG, PNG, or WebP images only up to 8 MB. SVG is blocked.",
            },
          ].map((doc) => {
            const asset = mediaAssets[doc.key];
            const hasFile = asset && asset.fileUrl !== "";
            const isUploading = uploading[doc.key];
            const progress = uploadProgress[doc.key] || 0;

            return (
              <div
                key={doc.key}
                className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 shadow-md grid gap-6 md:grid-cols-2"
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F5F0E8]">
                    {doc.title}
                  </h4>
                  <div className="bg-[#0A1D2B]/50 rounded-lg p-4 border border-[rgba(176,120,72,0.10)] min-h-[100px] flex flex-col justify-center">
                    {hasFile ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 text-emerald-400">
                          <CheckCircle className="h-5 w-5 shrink-0" />
                          <span className="text-xs font-semibold uppercase tracking-wider">File Active</span>
                        </div>
                        <p className="text-sm font-bold text-[#F5F0E8] truncate font-mono" title={asset.fileName}>
                          {asset.fileName}
                        </p>
                        <p className="text-[10px] text-[#8A9BB0]">
                          Uploaded: {new Date(asset.uploadedAt).toLocaleString()}
                        </p>
                        <a
                          href={asset.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block text-xs font-semibold text-[#D4A46A] hover:underline"
                        >
                          View Current File →
                        </a>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-xs text-[#8A9BB0] italic font-medium">No file uploaded yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                      Upload Replacement File
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        ref={doc.ref}
                        accept={doc.accept}
                        disabled={isUploading}
                        className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-xs text-[#F5F0E8] focus-visible:ring-[#B07848] h-9 file:text-xs file:bg-[#0A1D2B] file:text-[#D4A46A]"
                      />
                      <Button
                        onClick={() => handleUploadDocument(doc.key, doc.ref)}
                        disabled={isUploading}
                        className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase h-9 flex gap-1.5 px-3 shrink-0"
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileUp className="h-4 w-4" />
                        )}
                        Upload
                      </Button>
                    </div>
                    <p className="text-[10px] text-[#8A9BB0]/60 italic">
                      {doc.hint}
                    </p>
                  </div>

                  {isUploading && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-[#8A9BB0]">
                        <span>Uploading...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-[#1A3348] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#B07848] h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6 max-w-2xl">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Change Password Form */}
            <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 shadow-md space-y-6">
              <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider border-b border-[rgba(176,120,72,0.15)] pb-3">
                Change Password
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/20 focus-visible:ring-[#B07848]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                    New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/20 focus-visible:ring-[#B07848]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/20 focus-visible:ring-[#B07848]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center justify-center gap-2 mt-2"
                >
                  <Save className="h-4 w-4" />
                  {savingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>

          {/* Add New Admin Form */}
          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 shadow-md space-y-6">
            <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider border-b border-[rgba(176,120,72,0.15)] pb-3">
              Add Admin Account
            </h3>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  Admin Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter admin name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/20 focus-visible:ring-[#B07848]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/20 focus-visible:ring-[#B07848]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/20 focus-visible:ring-[#B07848]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                  Confirm Your Current Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your current password to authorize"
                  value={currentAdminPassword}
                  onChange={(e) => setCurrentAdminPassword(e.target.value)}
                  className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/20 focus-visible:ring-[#B07848]"
                />
              </div>

              <Button
                type="submit"
                disabled={savingAdmin}
                className="w-full bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center justify-center gap-2 mt-2"
              >
                <Plus className="h-4 w-4" />
                {savingAdmin ? "Adding..." : "Add Admin Account"}
              </Button>
            </form>
          </div>

          {/* Admins List Panel */}
          <div className="md:col-span-2 bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-[rgba(176,120,72,0.15)] pb-3">
              <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider">
                Admin Accounts List
              </h3>
              <span className="self-start sm:self-auto text-xs bg-[#1A3348] border border-[rgba(176,120,72,0.25)] text-[#D4A46A] px-2.5 py-1 rounded-full font-semibold">
                Total Admins: {adminsList.length}
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(176,120,72,0.10)] text-[#8A9BB0] text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Created At</th>
                    <th className="py-3 px-4 font-semibold">Last Login</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(176,120,72,0.05)] text-sm text-[#F5F0E8]">
                  {adminsList.map((admin) => (
                    <tr key={admin.id} className="hover:bg-[#1A3348]/20 transition-colors">
                      <td className="py-3 px-4 font-medium">{admin.name || "N/A"}</td>
                      <td className="py-3 px-4 font-mono text-xs">{admin.email}</td>
                      <td className="py-3 px-4 text-xs text-[#8A9BB0]">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-xs text-[#8A9BB0]">
                        {admin.lastLoginAt
                          ? new Date(admin.lastLoginAt).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setDeletingAdminId(admin.id);
                            setDeleteConfirmPassword("");
                          }}
                          className="text-[#E57373] hover:text-[#FF8A80] hover:bg-[#E57373]/10 h-8 px-3 text-xs uppercase font-semibold tracking-wider flex items-center gap-1 ml-auto"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="block md:hidden space-y-4">
              {adminsList.map((admin) => (
                <div
                  key={admin.id}
                  className="bg-[#1A3348]/30 rounded-lg p-4 border border-[rgba(176,120,72,0.15)] space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-[#F5F0E8]">{admin.name || "N/A"}</h4>
                      <p className="text-xs text-[#8A9BB0] font-mono break-all mt-0.5">{admin.email}</p>
                    </div>
                    <span className="text-[10px] bg-[#1A3348] border border-[rgba(176,120,72,0.15)] text-[#D4A46A] px-2 py-0.5 rounded uppercase font-semibold shrink-0">
                      {admin.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8A9BB0] border-t border-[rgba(176,120,72,0.05)] pt-2.5">
                    <div>
                      <span className="block font-semibold uppercase text-[9px] text-[#8A9BB0]/60">Created</span>
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="block font-semibold uppercase text-[9px] text-[#8A9BB0]/60">Last Login</span>
                      {admin.lastLoginAt
                        ? new Date(admin.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDeletingAdminId(admin.id);
                        setDeleteConfirmPassword("");
                      }}
                      className="text-[#E57373] hover:text-[#FF8A80] hover:bg-[#E57373]/10 h-8 px-3 text-xs uppercase font-semibold tracking-wider flex items-center gap-1 w-full justify-center"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>

    {/* Delete Admin Modal */}
    {deletingAdminId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.4)] p-6 shadow-2xl max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-200">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#F5F0E8] uppercase tracking-wide">
              Remove Admin Account
            </h3>
            <p className="text-sm text-[#8A9BB0]">
              Are you sure you want to remove this admin? This action cannot be undone. To proceed, please enter your current password.
            </p>
          </div>

          <form onSubmit={handleDeleteAdmin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">
                Your Password
              </label>
              <Input
                type="password"
                placeholder="Enter your current password"
                value={deleteConfirmPassword}
                onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/20 focus-visible:ring-[#B07848]"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                onClick={() => {
                  setDeletingAdminId(null);
                  setDeleteConfirmPassword("");
                }}
                variant="ghost"
                className="text-[#8A9BB0] hover:text-[#F5F0E8] hover:bg-[#1A3348]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isDeletingAdmin}
                className="bg-[#E57373] hover:bg-[#E57373]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center gap-1.5"
              >
                {isDeletingAdmin ? "Removing..." : "Confirm Removal"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}
