"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;

  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">JDM Imports AU</Link>
        <div className="flex items-center gap-4">
          <Link href="/cars" className="hover:underline">Cars for Sale</Link>
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/import" className="hover:underline">Import a Car</Link>
          {session ? (
            <>
              {role === "ADMIN" && (
                <Link href="/admin" className="hover:underline">Admin</Link>
              )}
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <button onClick={() => signOut()} className="px-3 py-1 rounded border">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1 rounded border">Login</Link>
              <Link href="/signup" className="px-3 py-1 rounded border bg-black text-white">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
