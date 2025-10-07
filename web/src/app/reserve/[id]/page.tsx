import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

async function getCar(id: string) {
  return prisma.carListing.findUnique({ where: { id } });
}

export default async function ReserveCheckout({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect(`/login?callbackUrl=/reserve/${params.id}`);

  const car = await getCar(params.id);
  if (!car) return <div>Car not found</div>;
  if (car.status !== "AVAILABLE") return <div>This car is currently unavailable</div>;

  // Define a flat deposit (e.g., 5% or fixed $1000)
  const depositAmountAud = Math.max(1000, Math.round(car.priceAud * 0.05));

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: session.user.email,
    line_items: [
      {
        price_data: {
          currency: "aud",
          product_data: {
            name: `${car.make} ${car.model} ${car.year} - Deposit`,
            images: [car.mainImageUrl],
          },
          unit_amount: depositAmountAud * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/reserve/success?carId=${car.id}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cars/${car.id}`,
    metadata: {
      carId: car.id,
      depositAmountAud: String(depositAmountAud),
    },
  });

  redirect(checkoutSession.url!);
}
