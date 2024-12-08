import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { TenantDetails } from "@/components/tenants/tenant-details";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

interface TenantPageProps {
  params: {
    propertyId: string;
    unitId: string;
    tenantId: string;
  };
}

export default async function TenantPage({ params }: TenantPageProps) {
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
    include: {
      unit: {
        include: {
          property: true,
        },
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      maintenanceReqs: {
        include: {
          property: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      documents: true,
    },
  });

  if (!tenant) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/properties/${params.propertyId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Tenant Details</h2>
        </div>
        <Link href={`/properties/${params.propertyId}/units/${params.unitId}/tenant/${params.tenantId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Tenant
          </Button>
        </Link>
      </div>
      <TenantDetails tenant={tenant} />
    </div>
  );
}