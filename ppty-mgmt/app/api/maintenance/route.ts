import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      priority,
      category,
      status,
      assignedTo,
      cost,
      images,
      propertyId,
      tenantId,
    } = body;

    if (!title || !description || !propertyId || !tenantId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const request = await db.maintenanceReq.create({
      data: {
        title,
        description,
        priority,
        category,
        status,
        assignedTo,
        cost,
        images: images || [],
        propertyId,
        tenantId,
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error("[MAINTENANCE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");
    const tenantId = searchParams.get("tenantId");

    const where = {
      ...(propertyId && { propertyId }),
      ...(tenantId && { tenantId }),
      property: {
        userId,
      },
    };

    const requests = await db.maintenanceReq.findMany({
      where,
      include: {
        property: true,
        tenant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("[MAINTENANCE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}