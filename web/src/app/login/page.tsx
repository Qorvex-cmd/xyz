"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof Schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
  });
  const params = useSearchParams();

  async function onSubmit(values: FormValues) {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: (params.get("callbackUrl") ?? "/"),
    });
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input {...register("email")} className="w-full border rounded px-3 py-2" type="email" />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input {...register("password")} className="w-full border rounded px-3 py-2" type="password" />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <button disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded">Login</button>
      </form>
      <p className="text-sm mt-4">No account? <a href="/signup" className="underline">Sign up</a></p>
    </div>
  );
}
