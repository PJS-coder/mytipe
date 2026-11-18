import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isValidAdminSecret } from "@/server/auth/admin";
import AdminView from "../AdminView";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ secret: string }>;
}

export default async function SecretAdminPage({ params }: Props) {
  const { secret } = await params;

  if (!isValidAdminSecret(secret)) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
          <div className="w-8 h-8 border-3 border-slate-700 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading Admin Panel...</p>
        </div>
      }
    >
      <AdminView hasSecret={true} />
    </Suspense>
  );
}
