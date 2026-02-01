import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // DashboardView handles its own full-screen layout
  return <>{children}</>;
}
