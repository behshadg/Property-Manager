import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const property = await db.property.delete({
      where: {
        id: params.propertyId,
        userId,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("[PROPERTY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const property = await db.property.update({
      where: {
        id: params.propertyId,
        userId,
      },
      data: body,
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("[PROPERTY_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}