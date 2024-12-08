import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const {
      name,
      description,
      address,
      propertyType,
      price,
      bedrooms,
      bathrooms,
      size,
      features,
      images,
      status,
    } = body;

    if (!name || !address) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const property = await db.property.create({
      data: {
        userId,
        name,
        description: description || "",
        address,
        propertyType,
        price: price || 0,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        size: size || 0,
        features: features || [],
        images: images || [],
        status: status || "AVAILABLE",
      },
    });

    return new NextResponse(JSON.stringify(property), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("[PROPERTIES_POST]", error);
    return new NextResponse(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}