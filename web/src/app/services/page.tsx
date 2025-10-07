import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Services</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {services.map((s) => (
          <div key={s.id} className="bg-white rounded shadow p-6">
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm text-gray-700 mt-2 whitespace-pre-line">{s.description}</div>
            <div className="mt-2 text-gray-600">Estimated price: {s.estimatedPrice}</div>
            <Link href={`/book/${s.id}`} className="inline-block mt-4 bg-black text-white px-4 py-2 rounded">Book / Enquire</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
