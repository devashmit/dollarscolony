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
      return NextResponse.redirect(downloads.brochure.fileUrl);
    }
    
    if (filename === "masterplan.pdf" && downloads.masterplan_pdf?.fileUrl) {
      return NextResponse.redirect(downloads.masterplan_pdf.fileUrl);
    }
  } catch (err) {
    console.error("Error redirecting document link:", err);
  }

  // Fallback if not found
  return new NextResponse("Document not found", { status: 404 });
}
