import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TenantForm } from "@/components/forms/tenant-form";
import { db } from "@/lib/db";

export default async function NewTenantPage({
  params
}: {
  params: { propertyId: string; unitId: string }
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const unit = await db.unit.findFirst({
    where: {
      id: params.unitId,
      property: {
        id: params.propertyId,
        userId,
      },
    },
    include: {
      property: true,
    },
  });

  if (!unit) {
    redirect("/properties");
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Add New Tenant</h2>
      <p className="text-muted-foreground">
        {unit.property.name} - Unit {unit.unitNumber}
      </p>
      <TenantForm
        propertyId={params.propertyId}
        unitId={params.unitId}
      />
    </div>
  );
}