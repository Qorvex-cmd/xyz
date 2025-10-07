"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof Schema>;

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(Schema),
  });

  async function onSubmit(values: FormValues) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      reset();
      window.location.href = "/login";
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Full name</label>
          <input {...register("fullName")} className="w-full border rounded px-3 py-2" />
          {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input {...register("email")} className="w-full border rounded px-3 py-2" type="email" />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Phone number</label>
          <input {...register("phoneNumber")} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input {...register("password")} className="w-full border rounded px-3 py-2" type="password" />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <button disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded">Sign up</button>
      </form>
      <p className="text-sm mt-4">Already have an account? <a href="/login" className="underline">Login</a></p>
    </div>
  );
}
