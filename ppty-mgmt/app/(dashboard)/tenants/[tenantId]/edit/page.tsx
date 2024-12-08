import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { TenantForm } from "@/components/forms/tenant-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditTenantPageProps {
  params: {
    propertyId: string;
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
        property: {
          id: params.propertyId,
          userId,
        },
      },
    },
    include: {
      unit: true,
      documents: true,
    },
  });

  if (!tenant) {
    redirect(`/properties/${params.propertyId}/dashboard`);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/properties/${params.propertyId}/dashboard`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Edit Tenant</h2>
            <p className="text-muted-foreground">
              Unit {tenant.unit.unitNumber}
            </p>
          </div>
        </div>
      </div>

      <TenantForm
        propertyId={params.propertyId}
        unitId={tenant.unit.id}
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
          documents: tenant.documents.map(doc => doc.url),
        }}
      />
    </div>
  );
}