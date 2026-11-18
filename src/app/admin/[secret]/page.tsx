import { notFound } from "next/navigation";
import { isValidAdminSecret } from "@/server/auth/admin";
import AdminView from "../AdminView";

interface Props {
  params: Promise<{ secret: string }>;
}

export default async function SecretAdminPage({ params }: Props) {
  const { secret } = await params;

  if (!isValidAdminSecret(secret)) {
    notFound();
  }

  return <AdminView hasSecret={true} />;
}
