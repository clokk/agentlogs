import { createClient } from "@/lib/supabase/server";
import { getUserUsage } from "@cogcommit/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usage = await getUserUsage(supabase, user.id);
    return NextResponse.json({ usage });
  } catch (error) {
    console.error("Failed to fetch usage:", error);
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
