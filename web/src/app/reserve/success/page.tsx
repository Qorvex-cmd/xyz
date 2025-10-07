import { prisma } from "@/src/lib/prisma";
import { NextRequest } from "next/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const carId = typeof searchParams.carId === "string" ? searchParams.carId : undefined;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold">Payment processing</h1>
      <p className="mt-2">Thanks! Your payment was successful. Your reservation will appear in your dashboard shortly.</p>
      <div className="mt-6">
        {carId && <Link className="underline" href={`/cars/${carId}`}>Back to car page</Link>}
        <span className="mx-2">or</span>
        <Link className="underline" href="/dashboard">Go to dashboard</Link>
      </div>
    </div>
  );
}
