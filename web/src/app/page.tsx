import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="bg-[url('https://images.unsplash.com/photo-1592853625600-5a1f7f51ec47?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center rounded-xl text-white">
        <div className="backdrop-brightness-[.6] rounded-xl">
          <div className="px-6 py-24">
            <h1 className="text-3xl sm:text-5xl font-bold">Premium Japanese Imports in Australia</h1>
            <p className="mt-4 max-w-xl text-white/90">Curated performance and classic JDM cars, fully compliant and ready for Australian roads.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/cars" className="bg-black/70 hover:bg-black text-white px-5 py-2 rounded">Browse Cars</Link>
              <Link href="/import" className="bg-white text-black px-5 py-2 rounded">Import a Car</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured cars placeholder */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold">Featured Listings</h2>
          <Link href="/cars" className="underline">View all</Link>
        </div>
        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-video bg-gray-200" />
              <div className="p-4">
                <div className="font-medium">Toyota Supra 1998</div>
                <div className="text-sm text-gray-600">$89,990 • 120,000 km</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services overview */}
      <section className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {[
          { title: "Import Compliance", desc: "Engineering, compliance, and registration support." },
          { title: "Detailing & Delivery", desc: "Premium detailing, transport, and handover." },
          { title: "Sourcing Service", desc: "We find the exact car you want in Japan." },
        ].map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow p-6">
            <div className="font-semibold">{card.title}</div>
            <div className="text-sm text-gray-600 mt-2">{card.desc}</div>
            <Link href="/services" className="inline-block mt-4 underline">Learn more</Link>
          </div>
        ))}
      </section>
    </div>
  );
}
