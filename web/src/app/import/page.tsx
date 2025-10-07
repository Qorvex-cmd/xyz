"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const Schema = z.object({
  carDetails: z.string().min(5),
  estimatedBudget: z.number({ coerce: true }).min(1000),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

export default function ImportRequestPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
  });

  async function onSubmit(values: FormValues) {
    const res = await fetch("/api/import-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) router.push("/dashboard");
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold">Custom Import Request</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm">Car Details</label>
          <textarea {...register("carDetails")} rows={4} className="w-full border rounded px-3 py-2" />
          {errors.carDetails && <p className="text-sm text-red-600">{errors.carDetails.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Estimated Budget (AUD)</label>
          <input type="number" {...register("estimatedBudget", { valueAsNumber: true })} className="w-full border rounded px-3 py-2" />
          {errors.estimatedBudget && <p className="text-sm text-red-600">{errors.estimatedBudget.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Additional Notes</label>
          <textarea {...register("additionalNotes")} rows={3} className="w-full border rounded px-3 py-2" />
        </div>
        <button disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
