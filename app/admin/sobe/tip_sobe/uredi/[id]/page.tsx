/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import { tipSobe } from '@/types/tipSobe';
import { tipoviSobaSchema } from "@/types/zod/tipSobaSchema";

export default function AzurirajTipSobu() {
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [ime, setIme] = useState<string>('');
  const [cijena, setCijena] = useState<number>();
  const [kapacitet, setKapacitet] = useState<number>();
  const [error, setError] = useState<Error | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tipSoba, setTipSoba] = useState<tipSobe | null>(null);

  useEffect(() => {
    const id = params.id;
    async function učitajTipSobeId() {
      try {
        const response = await fetch(`/api/hotel/tipSobe/${id}`);
        if (!response.ok) {
          throw new Error('Greška na serveru');
        }
        const data = await response.json();
        setKapacitet(data.kapacitet ?? 0);
        setIme(data.ime);
        setCijena(data.cijena ?? '');
        setTipSoba(data);

      } catch (error) {
        setError(error as Error);
      }
    }
    učitajTipSobeId();
  }, [params.id]);

  async function azurirajTipSobe() {
    setError(null);
    setErrors({});
    const body = {
      ime,
      kapacitet: Number(kapacitet),
      cijena: Number(cijena),

    };
    const parsed = tipoviSobaSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setError(new Error('Greška u validaciji podataka'));
      return;
    }
    const id = params.id;
    try {
      const response = await fetch(`/api/hotel/tipSobe/${id}`, {
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
      setToast('Tip sobe uspješno ažuriran!');
      setIme('');
      setKapacitet(0);
      setCijena(0);
      router.push('/admin/soba/tip_sobe');
    } catch (error) {
      setToast('Greška pri ažuriranju soba.');
      console.error('Greska pri azuriranju soba', error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-2xl text-center text-gray-800">Ažuriranje Sobe</p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            azurirajTipSobe();
          }}
        >
          <input
            type="text"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Unesite ime sobe"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.naziv && <p className="text-red-500 text-sm">{errors.naziv}</p>}
          <input
            type="number"
            value={kapacitet}
            onChange={(e) => setKapacitet(Number(e.target.value))}
            placeholder="Unesite kapacitet"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.kapacitet && <p className="text-red-500 text-sm">{errors.kapacitet}</p>}
          <input
            type="number"
            value={cijena}
            onChange={(e) => setCijena(Number(e.target.value))}
            placeholder="Unesite cijenu"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.cijena && <p className="text-red-500 text-sm">{errors.cijena}</p>}
          <div className="flex gap-4">
            <button
              type="button"

              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-medium transition  cursor-pointer"
              onClick={() => {
                router.push(`/admin/sobe/tip_sobe`);
              }}
            >
              Odloži
            </button>
            <button
              type="submit"

              className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-700 transition   cursor-pointer"
            >
              Ažuriraj Tip Sobe
            </button>
          </div>
        </form>
        {error && (
          <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>
        )}
        <Toast message={toast} />
      </div>
    </div>
  );
}
