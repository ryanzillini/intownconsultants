import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function ManageLoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-5 py-16">
      <h1 className="font-serif text-3xl text-gold">Sign in</h1>
      <p className="mt-3 text-sm text-white/70">
        This page is for Intown Consultants staff only.
      </p>
      <div className="mt-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
