import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const created = await prisma.carListing.create({
    data: {
      make: body.make,
      model: body.model,
      year: Number(body.year),
      priceAud: Number(body.priceAud),
      mileageKm: Number(body.mileageKm),
      vin: String(body.vin),
      description: String(body.description),
      mainImageUrl: String(body.mainImageUrl),
      photoUrls: body.photoUrls ?? [],
      engineSize: body.engineSize ?? null,
      transmission: body.transmission ?? null,
      fuelType: body.fuelType ?? null,
    },
  });

  return NextResponse.json({ car: created });
}
