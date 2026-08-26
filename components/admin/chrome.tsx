"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand/logo";

export function AdminChrome() {
  const pathname = usePathname();
  const router = useRouter();
  const onLogin = pathname === "/manage/login";

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/manage/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gold/25 bg-ink">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Logo href="/manage" imageClassName="h-10 w-auto" />
        {!onLogin ? (
          <div className="flex items-center gap-4">
            <Link
              href="/manage"
              className="text-sm text-white/75 transition-colors hover:text-gold"
            >
              Galleries
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="min-h-11 px-3 text-sm text-white/75 transition-colors hover:text-gold"
            >
              Log out
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
