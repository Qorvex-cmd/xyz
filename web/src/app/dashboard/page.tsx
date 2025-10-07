import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null;
  if (!user) return <div>Please login.</div>;

  const [reservations, bookings, requests] = await Promise.all([
    prisma.reservation.findMany({ where: { customerId: user.id }, include: { carListing: true }, orderBy: { reservationDate: "desc" } }),
    prisma.serviceBooking.findMany({ where: { customerId: user.id }, include: { service: true }, orderBy: { requestedDate: "desc" } }),
    prisma.importRequest.findMany({ where: { customerId: user.id }, orderBy: { submissionDate: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Your Dashboard</h1>

      <section>
        <h2 className="font-medium">Reservations</h2>
        <div className="mt-3 space-y-2">
          {reservations.length === 0 && <div className="text-gray-600 text-sm">No reservations yet.</div>}
          {reservations.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded shadow">
              <div className="font-medium">{r.carListing.make} {r.carListing.model} {r.carListing.year}</div>
              <div className="text-sm text-gray-600">Deposit: ${'{'}r.depositAmount.toLocaleString(){'}'} • Status: {r.paymentStatus}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-medium">Service Bookings</h2>
        <div className="mt-3 space-y-2">
          {bookings.length === 0 && <div className="text-gray-600 text-sm">No bookings yet.</div>}
          {bookings.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded shadow">
              <div className="font-medium">{b.service.name}</div>
              <div className="text-sm text-gray-600">{new Date(b.requestedDate).toLocaleDateString()} • {b.status.replaceAll('_',' ')}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-medium">Import Requests</h2>
        <div className="mt-3 space-y-2">
          {requests.length === 0 && <div className="text-gray-600 text-sm">No requests yet.</div>}
          {requests.map((i) => (
            <div key={i.id} className="bg-white p-4 rounded shadow">
              <div className="font-medium">Budget: ${'{'}i.estimatedBudget.toLocaleString(){'}'}</div>
              <div className="text-sm text-gray-600">{i.carDetails}</div>
              <div className="text-sm">Status: {i.status.replaceAll('_',' ')}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
