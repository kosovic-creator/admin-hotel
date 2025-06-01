'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import Toast from '@/components/ui/Toast';
import { gostSchema } from '@/types/zod/gostSchema';

export default function DodajGosta() {
  const [toast, setToast] = useState<string | null>(null);
  const [ime, setIme] = useState<string>('');
  const [prezime, setPrezime] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  async function noviGost() {
    setErrors({});
    const body = { ime, prezime, email };
    const validation = gostSchema.safeParse(body);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      const response = await fetch(`/api/hotel/gosti`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Greška kod servera');
      }
      setIme('');
      setPrezime('');
      setEmail('');
      setToast('Gost je uspešno dodan!');
      setTimeout(() => { router.push('/admin/gosti') }, 2000);
    } catch (error) {
      console.error('Greška u dodavanju novog gosta:', error);
      setToast('Greška pri dodavanju Gosta!');
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-50 to-gray-100 px-4">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-lg space-y-8 border border-gray-200">
        <p className="text-4xl font-extrabold text-center text-blue-900 mb-4 tracking-tight drop-shadow cursor-pointer">Novi Gost</p>
        <div className="space-y-5">
          <input
            type="text"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Ime"
            className="w-full border border-blue-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 shadow-sm"
          />
          {errors.ime && <p className="text-red-500 text-sm">{errors.ime}</p>}
          <input
            type="text"
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
            placeholder="Prezime"
            className="w-full border border-blue-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 shadow-sm"
          />
          {errors.prezime && <p className="text-red-500 text-sm">{errors.prezime}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-blue-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 shadow-sm"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-medium transition cursor-pointer"
              onClick={() => {
                router.push(`/admin/gosti`);
              }}
            >
              Odloži
            </button>
            <button
              type="button"
              onClick={noviGost}
              className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Dodaj Gosta
            </button>
          </div>
        </div>
        <Toast message={toast} />
      </div>
    </div>
  );
}
