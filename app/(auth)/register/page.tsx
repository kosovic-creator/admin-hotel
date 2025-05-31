/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";


export default function RegisterPage() {
const [toast, setToast] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
         setToast('Uspješno je dodat novi korisnik!');
        router.push("/login");
      } else {
        const data = await response.json();
        alert(data.error || "Greška pri registraciji");
      }
    } catch (error) {
      alert("Server error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 tracking-tight">
          Registracija
        </h2>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Lozinka</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
         className="bg-gray-900 hover:bg-gray-500 text-amber-50 transition font-semibold py-3 rounded-lg shadow"
        >
          Registruj se
        </button>
        <Toast message={toast} />
      </form>
    </div>
  );
}
