import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) return NextResponse.json({ error: "Missing webhook configuration" }, { status: 400 });

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const carId = (session.metadata?.carId as string) || "";
    const depositAmountAud = Number(session.metadata?.depositAmountAud || 0);
    const stripePaymentId = (session.payment_intent as string) || session.id;
    const customerEmail = session.customer_details?.email || session.customer_email || "";

    if (!carId || !depositAmountAud || !customerEmail) {
      return NextResponse.json({ ok: true });
    }

    const user = await prisma.user.findUnique({ where: { email: customerEmail } });
    const car = await prisma.carListing.findUnique({ where: { id: carId } });
    if (!user || !car) return NextResponse.json({ ok: true });

    // Idempotency: check if reservation exists for this payment id
    const existing = await prisma.reservation.findFirst({ where: { stripePaymentId } });
    if (!existing) {
      await prisma.$transaction([
        prisma.reservation.create({
          data: {
            customerId: user.id,
            carListingId: car.id,
            depositAmount: depositAmountAud,
            paymentStatus: "COMPLETED",
            stripePaymentId,
          },
        }),
        prisma.carListing.update({ where: { id: car.id }, data: { status: "RESERVED" } }),
      ]);

      // Notify customer and admin
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      const subject = `Reservation confirmed: ${car.make} ${car.model} ${car.year}`;
      const body = `Your deposit for ${car.make} ${car.model} (${car.year}) has been received. Reservation created. Payment: ${stripePaymentId}`;
      await sendEmail({ to: customerEmail, subject, text: body });
      if (admin?.email) {
        await sendEmail({ to: admin.email, subject: `New reservation: ${user.fullName}`, text: body });
      }
    }
  }

  return NextResponse.json({ received: true });
}
