import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TenantForm } from "@/components/forms/tenant-form";
import { db } from "@/lib/db";

export default async function NewTenantPage({ 
  params 
}: { 
  params: { propertyId: string } 
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const property = await db.property.findFirst({
    where: {
      id: params.propertyId,
      userId,
    },
    include: {
      units: true
    }
  });

  if (!property) {
    redirect("/properties");
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Add New Tenant</h2>
      <TenantForm propertyId={params.propertyId} unitId={""} />
    </div>
  );
}