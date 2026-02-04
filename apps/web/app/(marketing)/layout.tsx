import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user
    ? user.user_metadata?.user_name ||
      user.user_metadata?.preferred_username ||
      user.email?.split("@")[0] ||
      "User"
    : null;
  const avatarUrl = user?.user_metadata?.avatar_url;
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <header className="border-b border-border w-full">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-primary shrink-0">
            Tuhnr
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/features"
              className="text-muted hover:text-primary transition-colors hidden sm:block"
            >
              Features
            </Link>
            <Link
              href="/docs"
              className="text-muted hover:text-primary transition-colors"
            >
              Docs
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-muted hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-2">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={userName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-panel flex items-center justify-center text-sm font-medium text-primary">
                      {userName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-primary font-medium">{userName}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-chronicle-blue text-black rounded-lg font-medium hover:bg-chronicle-blue/90 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-panel-alt">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border py-8 w-full">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted text-sm">
              Built for AI-assisted developers
            </p>
            <div className="flex items-center gap-4 text-muted text-sm">
              <a
                href="https://github.com/clokk/tuhnr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <span className="text-subtle">|</span>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
