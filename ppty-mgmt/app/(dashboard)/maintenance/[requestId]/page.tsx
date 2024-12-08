import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface MaintenanceRequestPageProps {
  params: {
    requestId: string;
  };
}

export default async function MaintenanceRequestPage({ 
  params 
}: MaintenanceRequestPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const request = await db.maintenanceReq.findFirst({
    where: {
      id: params.requestId,
      property: {
        userId,
      },
    },
    include: {
      property: true,
      tenant: true,
      comments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!request) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <MaintenanceRequestDetails request={request} />
    </div>
  );
}