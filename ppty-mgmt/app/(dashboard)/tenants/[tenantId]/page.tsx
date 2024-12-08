import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { TenantDetails } from "@/components/tenants/tenant-details";

interface TenantPageProps {
  params: {
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
      <TenantDetails tenant={tenant} />
    </div>
  );
}