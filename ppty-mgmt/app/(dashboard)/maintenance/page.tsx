import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function MaintenancePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const requests = await db.maintenanceReq.findMany({
    where: {
      property: {
        userId,
      },
    },
    include: {
      property: true,
      tenant: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Maintenance Requests</h2>
      </div>
      <div className="grid gap-4">
        {requests.map((request) => (
          <MaintenanceRequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}