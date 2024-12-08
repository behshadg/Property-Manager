import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, category, url, propertyId, tenantId } = body;

    if (!name || !type || !category || !url || !propertyId) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // Verify property ownership
    const property = await db.property.findFirst({
      where: {
        id: propertyId,
        userId,
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" }, 
        { status: 404 }
      );
    }

    // If tenantId is provided, verify tenant belongs to property
    if (tenantId) {
      const tenant = await db.tenant.findFirst({
        where: {
          id: tenantId,
          unit: {
            property: {
              id: propertyId,
              userId,
            }
          }
        }
      });

      if (!tenant) {
        return NextResponse.json(
          { error: "Tenant not found" }, 
          { status: 404 }
        );
      }
    }

    // Create document
    const document = await db.document.create({
      data: {
        name,
        type,
        category,
        url,
        propertyId,
        tenantId: tenantId || null,
        fileSize: 0, // This could be calculated if needed
        mimeType: url.split('.').pop() || 'application/octet-stream',
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");
    const tenantId = searchParams.get("tenantId");

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID required" }, 
        { status: 400 }
      );
    }

    // Verify property ownership
    const property = await db.property.findFirst({
      where: {
        id: propertyId,
        userId,
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" }, 
        { status: 404 }
      );
    }

    const documents = await db.document.findMany({
      where: {
        propertyId,
        ...(tenantId && { tenantId }),
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        tenant: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

// Optional: Add DELETE endpoint for document removal
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID required" }, 
        { status: 400 }
      );
    }

    // Verify document belongs to user's property
    const document = await db.document.findFirst({
      where: {
        id: documentId,
        property: {
          userId,
        }
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" }, 
        { status: 404 }
      );
    }

    // Delete document from database
    await db.document.delete({
      where: {
        id: documentId,
      }
    });

    // Optionally delete from uploadthing
    // await utapi.deleteFiles([document.url]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DOCUMENTS_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

