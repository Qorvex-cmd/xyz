import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getCar(id: string) {
  return prisma.carListing.findUnique({ where: { id } });
}

export default async function CarDetail({ params }: { params: { id: string } }) {
  const car = await getCar(params.id);
  if (!car) return <div>Car not found</div>;

  const isAvailable = car.status === "AVAILABLE";
  const photos: string[] = Array.isArray(car.photoUrls) ? (car.photoUrls as any) : [];

  return (
    <div className="space-y-6">
      <Link href="/cars" className="underline">Back to listings</Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="aspect-video rounded bg-gray-200" style={{ backgroundImage: `url(${car.mainImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          {photos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {photos.map((url, idx) => (
                <div key={idx} className="aspect-video rounded bg-gray-100" style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              ))}
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h1 className="text-xl font-semibold">{car.make} {car.model} {car.year}</h1>
          <div className="mt-2 text-gray-700">{car.description}</div>
          <div className="mt-4">
            <div className="font-medium">Price</div>
            <div>${'{'}car.priceAud.toLocaleString(){'}'}</div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>Mileage</div><div>{car.mileageKm.toLocaleString()} km</div>
            {car.engineSize && (<><div>Engine</div><div>{car.engineSize}</div></>)}
            {car.transmission && (<><div>Transmission</div><div>{car.transmission}</div></>)}
            {car.fuelType && (<><div>Fuel</div><div>{car.fuelType}</div></>)}
          </div>
          <div className="mt-6">
            {isAvailable ? (
              <Link href={`/reserve/${car.id}`} className="block text-center bg-black text-white px-4 py-2 rounded">Reserve Now</Link>
            ) : (
              <div className="text-red-600 font-medium">This car is currently unavailable</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
