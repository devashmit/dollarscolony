import { NextRequest, NextResponse } from "next/server";
import { getPublicDownloads } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  try {
    const downloads = await getPublicDownloads();
    
    if (filename === "dollars-colony-brochure.pdf" && downloads.brochure?.fileUrl) {
      const url = new URL(downloads.brochure.fileUrl);
      url.searchParams.set("download", "1");
      return NextResponse.redirect(url.toString());
    }
    
    if (filename === "masterplan.pdf" && downloads.masterplan_pdf?.fileUrl) {
      const url = new URL(downloads.masterplan_pdf.fileUrl);
      url.searchParams.set("download", "1");
      return NextResponse.redirect(url.toString());
    }
  } catch (err) {
    console.error("Error redirecting document link:", err);
  }

  // Fallback if not found
  return new NextResponse("Document not found", { status: 404 });
}
