import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  if (!isAdmin) return <div>Unauthorized</div>;

  const [reservations, bookings, requests, cars] = await Promise.all([
    prisma.reservation.findMany({ include: { carListing: true, customer: true }, orderBy: { reservationDate: "desc" } }),
    prisma.serviceBooking.findMany({ include: { service: true, customer: true }, orderBy: { requestedDate: "desc" } }),
    prisma.importRequest.findMany({ include: { customer: true }, orderBy: { submissionDate: "desc" } }),
    prisma.carListing.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <Link href="/admin/listings/new" className="inline-block bg-black text-white px-4 py-2 rounded">Add Listing</Link>

      <section>
        <h2 className="font-medium">Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {cars.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded shadow flex gap-3">
              <div className="w-40 h-24 bg-gray-200 rounded" style={{ backgroundImage: `url(${c.mainImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="flex-1">
                <div className="font-medium">{c.make} {c.model} {c.year}</div>
                <div className="text-sm text-gray-600">${'{'}c.priceAud.toLocaleString(){'}'} • {c.mileageKm.toLocaleString()} km • {c.status}</div>
                <div className="mt-2 flex gap-2">
                  <Link href={`/admin/listings/${c.id}`} className="underline">Edit</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-medium">Reservations</h2>
        <div className="mt-2 space-y-2">
          {reservations.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded shadow">
              <div className="font-medium">{r.customer.fullName} • {r.carListing.make} {r.carListing.model} {r.carListing.year}</div>
              <div className="text-sm text-gray-600">Deposit: ${'{'}r.depositAmount.toLocaleString(){'}'} • {r.paymentStatus}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-medium">Service Bookings</h2>
        <div className="mt-2 space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded shadow">
              <div className="font-medium">{b.customer.fullName} • {b.service.name}</div>
              <div className="text-sm text-gray-600">{new Date(b.requestedDate).toLocaleDateString()} • {b.status.replaceAll('_',' ')}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-medium">Import Requests</h2>
        <div className="mt-2 space-y-2">
          {requests.map((i) => (
            <div key={i.id} className="bg-white p-4 rounded shadow">
              <div className="font-medium">{i.customer.fullName} • Budget: ${'{'}i.estimatedBudget.toLocaleString(){'}'}</div>
              <div className="text-sm text-gray-600">{i.carDetails}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
