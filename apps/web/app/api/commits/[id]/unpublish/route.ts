import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { unpublishCommit } from "@cogcommit/supabase/queries";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await unpublishCommit(supabase, id, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to unpublish commit:", error);
    return NextResponse.json(
      { error: "Failed to unpublish commit" },
      { status: 500 }
    );
  }
}
