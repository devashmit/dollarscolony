import React from "react";
import { db } from "@/lib/db";
import SettingsManager from "@/components/admin/SettingsManager";

export const revalidate = 0;

export default async function SettingsPage() {
  const [dbConfigs, dbAssets, dbAdmins] = await Promise.all([
    db.siteConfig.findMany(),
    db.mediaAsset.findMany(),
    db.adminUser.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const configs = dbConfigs.map((c) => ({
    key: c.key,
    value: c.value,
    label: c.label,
  }));

  const assets = dbAssets.map((a) => ({
    key: a.key,
    title: a.title,
    fileUrl: a.fileUrl || "",
    fileName: a.fileName || "",
    uploadedAt: a.updatedAt,
  }));

  const admins = dbAdmins.map((admin) => ({
    id: admin.id,
    name: admin.name || "",
    email: admin.email,
    role: admin.role,
    lastLoginAt: admin.lastLoginAt ? admin.lastLoginAt.toISOString() : null,
    createdAt: admin.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-wide text-[#F5F0E8] uppercase">
          Portal & Document Settings
        </h2>
        <p className="text-sm text-[#8A9BB0] mt-1">
          Adjust the general contact details, dynamic pricing note text, or upload active document assets.
        </p>
      </div>

      <SettingsManager configs={configs} assets={assets} admins={admins} />
    </div>
  );
}
