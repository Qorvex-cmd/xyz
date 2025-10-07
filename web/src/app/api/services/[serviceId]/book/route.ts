import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { serviceId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { requestedDate, customerMessage } = body || {};
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const booking = await prisma.serviceBooking.create({
    data: {
      customerId: user.id,
      serviceId: params.serviceId,
      customerMessage,
      requestedDate: new Date(requestedDate),
    },
  });

  return NextResponse.json({ booking });
}
