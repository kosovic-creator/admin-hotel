"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/admin");
    } else {
      alert("Pogrešan email ili lozinka");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 tracking-tight">
          Prijava
        </h2>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Lozinka"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
        />
        <Button
          type="submit"
         className="bg-black hover:bg-gray-500 text-amber-50 transition font-semibold py-3 rounded-lg shadow cursor-pointer  "
        >
          Prijavi se
        </Button>
        <div className="text-center">
          <Button
            asChild
            variant="link"
            className="text-gray-900 hover:text-gray-500 font-medium"
          >
            <Link href="/register">
              Ako nemate nalog? Napravite nalog
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
