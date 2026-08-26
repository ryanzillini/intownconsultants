import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminChrome } from "@/components/admin/chrome";

export const metadata: Metadata = {
  title: "Manage galleries",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-ink text-white">
      <AdminChrome />
      <main className="flex-1">{children}</main>
    </div>
  );
}
