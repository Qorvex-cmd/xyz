import { prisma } from "@/src/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getCars(searchParams: { make?: string; model?: string; q?: string; min?: string; max?: string; }) {
  const where: any = { OR: undefined, status: "AVAILABLE" };
  if (searchParams.make) where.make = { contains: searchParams.make, mode: "insensitive" };
  if (searchParams.model) where.model = { contains: searchParams.model, mode: "insensitive" };
  if (searchParams.q) {
    where.OR = [
      { make: { contains: searchParams.q, mode: "insensitive" } },
      { model: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }
  if (searchParams.min || searchParams.max) {
    where.priceAud = {};
    if (searchParams.min) where.priceAud.gte = Number(searchParams.min);
    if (searchParams.max) where.priceAud.lte = Number(searchParams.max);
  }
  return prisma.carListing.findMany({ where, orderBy: { createdAt: "desc" } });
}

export default async function CarsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const cars = await getCars({
    make: typeof searchParams.make === "string" ? searchParams.make : undefined,
    model: typeof searchParams.model === "string" ? searchParams.model : undefined,
    q: typeof searchParams.q === "string" ? searchParams.q : undefined,
    min: typeof searchParams.min === "string" ? searchParams.min : undefined,
    max: typeof searchParams.max === "string" ? searchParams.max : undefined,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Cars for Sale</h1>

      <form className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-white p-4 rounded shadow">
        <input name="make" placeholder="Make" className="border rounded px-3 py-2 col-span-1" defaultValue={typeof searchParams.make === 'string' ? searchParams.make : ''} />
        <input name="model" placeholder="Model" className="border rounded px-3 py-2 col-span-1" defaultValue={typeof searchParams.model === 'string' ? searchParams.model : ''} />
        <input name="q" placeholder="Search" className="border rounded px-3 py-2 col-span-2 md:col-span-2" defaultValue={typeof searchParams.q === 'string' ? searchParams.q : ''} />
        <input name="min" placeholder="Min Price" className="border rounded px-3 py-2 col-span-1" defaultValue={typeof searchParams.min === 'string' ? searchParams.min : ''} />
        <input name="max" placeholder="Max Price" className="border rounded px-3 py-2 col-span-1" defaultValue={typeof searchParams.max === 'string' ? searchParams.max : ''} />
        <button className="bg-black text-white px-4 py-2 rounded col-span-2 md:col-span-1">Filter</button>
      </form>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link key={car.id} href={`/cars/${car.id}`} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-video bg-gray-200" style={{ backgroundImage: `url(${car.mainImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="p-4">
              <div className="font-medium">{car.make} {car.model} {car.year}</div>
              <div className="text-sm text-gray-600">${'{'}car.priceAud.toLocaleString(){'}'} • {car.mileageKm.toLocaleString()} km</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
