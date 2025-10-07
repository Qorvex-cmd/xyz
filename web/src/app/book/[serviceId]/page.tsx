"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const Schema = z.object({
  requestedDate: z.string().min(1),
  customerMessage: z.string().min(1),
});

type FormValues = z.infer<typeof Schema>;

export default function BookServicePage({ params }: { params: { serviceId: string } }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(Schema) });
  const [serviceName, setServiceName] = useState<string>("");

  useEffect(() => {
    fetch(`/api/services/${params.serviceId}`).then(r => r.json()).then(d => setServiceName(d?.service?.name ?? ""));
  }, [params.serviceId]);

  async function onSubmit(values: FormValues) {
    const res = await fetch(`/api/services/${params.serviceId}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold">Book: {serviceName}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm">Preferred date</label>
          <input type="date" {...register("requestedDate")} className="w-full border rounded px-3 py-2" />
          {errors.requestedDate && <p className="text-sm text-red-600">{errors.requestedDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Message</label>
          <textarea rows={4} {...register("customerMessage")} className="w-full border rounded px-3 py-2" />
          {errors.customerMessage && <p className="text-sm text-red-600">{errors.customerMessage.message}</p>}
        </div>
        <button disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
