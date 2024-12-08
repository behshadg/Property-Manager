import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TenantForm } from "@/components/forms/tenant-form";
import { notFound } from "next/navigation";

interface EditTenantPageProps {
  params: {
    propertyId: string;
    unitId: string;
    tenantId: string;
  };
}

export default async function EditTenantPage({ params }: EditTenantPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const tenant = await db.tenant.findFirst({
    where: {
      id: params.tenantId,
      unit: {
        id: params.unitId,
        property: {
          id: params.propertyId,
          userId,
        },
      },
    },
  });

  if (!tenant) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Edit Tenant</h2>
      <TenantForm
        propertyId={params.propertyId}
        unitId={params.unitId}
        initialData={{
          firstName: tenant.firstName,
          lastName: tenant.lastName,
          email: tenant.email,
          phone: tenant.phone,
          emergencyContact: tenant.emergencyContact || "",
          leaseStart: new Date(tenant.leaseStart),
          leaseEnd: new Date(tenant.leaseEnd),
          rentAmount: tenant.rentAmount,
          depositAmount: tenant.depositAmount,
          paymentDue: tenant.paymentDue,
          status: tenant.status,
          documents: tenant.documents || [],
        }}
      />
    </div>
  );
}
