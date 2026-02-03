import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getPublicCommit } from "@cogcommit/supabase/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const { slug } = await params;

  try {
    const result = await getPublicCommit(supabase, slug);

    if (!result) {
      return NextResponse.json(
        { error: "Commit not found or not published" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch public commit:", error);
    return NextResponse.json(
      { error: "Failed to fetch commit" },
      { status: 500 }
    );
  }
}
