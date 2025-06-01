/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import { gostSchema } from '@/types/zod/gostSchema';
import { Gost } from '@/types/gosti';

export default function AzurirajGosta() {
  const params = useParams();
  const id = params?.id as string;
  const [ime, setIme] = useState<string>('');
  const [prezime, setPrezime] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const [gostId, setGostId] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [gost, setGost] = useState<Gost | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function učitajGostaId() {
      try {
        const response = await fetch(`/api/hotel/gosti/${id}`);
        if (!response.ok) {
          throw new Error('Greška ko servera');
        }
        const data = await response.json();
        setGost(data);
        setGostId(data.id);
        setIme(data.ime);
        setPrezime(data.prezime);
        setEmail(data.email);
      } catch (error) {
        setError(error as Error);
      }
    }
    if (id) učitajGostaId();
  }, [id]);

  async function azirirajGosta() {
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
      const response = await fetch(`/api/hotel/gosti/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Nema odgovora sa servera');
      }
      const data = await response.json();
      setIme('');
      setPrezime('');
      setEmail('');
      setToast('Gost je uspešno izmjenjen!');
      setTimeout(() => router.push('/admin/gosti'), 2000);
    } catch (error) {
      console.error('Greska pri azuriranju gosta', error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-2xl  text-center text-gray-800">Ažuriranje Gosta</p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            azirirajGosta();
          }}
        >
          <input
            type="text"
            value={ime ?? ''}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Unesite ime"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.ime && <p className="text-red-500 text-sm">{errors.ime}</p>}
          <input
            type="text"
            value={prezime ?? ''}
            onChange={(e) => setPrezime(e.target.value)}
            placeholder="Unesite prezime"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.prezime && <p className="text-red-500 text-sm">{errors.prezime}</p>}
          <input
            type="email"
            value={email ?? ''}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Unesite email"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              type="submit"
              className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-700 transition cursor-pointer"
            >
              Ažuriraj gosta
            </button>
          </div>
        </form>
        {error && (
          <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>
        )}
      </div>
      <Toast message={toast} />
    </div>
  );
}
