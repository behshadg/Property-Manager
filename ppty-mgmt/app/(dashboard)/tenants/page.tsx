import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TenantCard } from "@/components/tenants/tenant-card";

export default async function TenantsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const tenants = await db.tenant.findMany({
    where: {
      unit: {
        property: {
          userId,
        },
      },
    },
    include: {
      unit: {
        include: {
          property: true,
        },
      },
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tenants</h2>
      </div>
      <div className="grid gap-4">
        {tenants.map((tenant) => (
          <TenantCard key={tenant.id} tenant={tenant} />
        ))}
      </div>
    </div>
  );
}