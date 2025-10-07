"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const Schema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number({ coerce: true }).int().min(1950),
  priceAud: z.number({ coerce: true }).min(0),
  mileageKm: z.number({ coerce: true }).min(0),
  vin: z.string().min(3),
  description: z.string().min(1),
  mainImageUrl: z.string().url(),
  photoUrls: z.string().optional(),
  engineSize: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

export default function NewListingPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    const res = await fetch("/api/admin/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        photoUrls: values.photoUrls ? values.photoUrls.split(/\s*,\s*/) : [],
      }),
    });
    if (res.ok) router.push("/admin");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold">Add Listing</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <input placeholder="Make" {...register("make")} className="border rounded px-3 py-2" />
        <input placeholder="Model" {...register("model")} className="border rounded px-3 py-2" />
        <input placeholder="Year" type="number" {...register("year", { valueAsNumber: true })} className="border rounded px-3 py-2" />
        <input placeholder="Price (AUD)" type="number" {...register("priceAud", { valueAsNumber: true })} className="border rounded px-3 py-2" />
        <input placeholder="Mileage (km)" type="number" {...register("mileageKm", { valueAsNumber: true })} className="border rounded px-3 py-2" />
        <input placeholder="VIN/Chassis" {...register("vin")} className="border rounded px-3 py-2" />
        <input placeholder="Main Image URL" {...register("mainImageUrl")} className="border rounded px-3 py-2 md:col-span-2" />
        <textarea placeholder="Photo URLs (comma-separated)" {...register("photoUrls")} rows={2} className="border rounded px-3 py-2 md:col-span-2" />
        <textarea placeholder="Description" {...register("description")} rows={4} className="border rounded px-3 py-2 md:col-span-2" />
        <input placeholder="Engine Size" {...register("engineSize")} className="border rounded px-3 py-2" />
        <input placeholder="Transmission" {...register("transmission")} className="border rounded px-3 py-2" />
        <input placeholder="Fuel Type" {...register("fuelType")} className="border rounded px-3 py-2" />
        <button disabled={isSubmitting} className="bg-black text-white px-4 py-2 rounded md:col-span-2">Create</button>
      </form>
    </div>
  );
}
