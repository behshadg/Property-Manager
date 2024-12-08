import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, assignedTo, cost } = body;

    const request = await db.maintenanceReq.update({
      where: {
        id: params.requestId,
        property: {
          userId,
        },
      },
      data: {
        status,
        assignedTo,
        cost,
        ...(status === "COMPLETED" ? { completedAt: new Date() } : {}),
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error("[MAINTENANCE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.maintenanceReq.delete({
      where: {
        id: params.requestId,
        property: {
          userId,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MAINTENANCE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}