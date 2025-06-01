/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import {tipoviSobaSchema } from "@/types/zod/tipSobaSchema";

export default function DodajTipSobe() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [ime, setIme] = useState<string>('');
  const [cijena, setCijena] = useState<string>('');
  const [kapacitet, setKapacitet] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function noviTipSobe() {
    setErrors({});
    const body = {
      ime,
      kapacitet: Number(kapacitet),
      cijena: Number(cijena),
    };
    const parsed = tipoviSobaSchema .safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      const response = await fetch(`/api/hotel/tipSobe`, {
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
      setCijena('');
      setKapacitet('');
      setToast('Uspješno ste dodali novi tip sobe.');
      setTimeout(() => (router.push('/admin/sobe/tip_sobe'),2000));
    } catch (error) {
      console.error('Greška u dodavanju novog tipa sobe:', error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg space-y-8">
        <p className="text-2xl font-bold text-center text-blue-900 mb-4 tracking-tight">Novi Tip Sobe</p>
        <div className="space-y-5">
          <input
            type="text"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Tip Sobe"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
          />
          {errors && <p className="text-red-500 text-sm">{errors.ime}</p>}
          <input
            type="number"
            value={kapacitet}
            onChange={(e) => setKapacitet(e.target.value)}
            placeholder="Kapacitet"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
          />
          {errors.kapacitet && <p className="text-red-500 text-sm">{errors.kapacitet}</p>}
          <input
            type="number"
            value={cijena}
            onChange={(e) => setCijena(e.target.value)}
            placeholder="Cijena"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
          />
            {errors.cijena && <p className="text-red-500 text-sm">{errors.cijena}</p>}
        </div>
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
            type="button"
            onClick={noviTipSobe}

            className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-700 transition   cursor-pointer"
          >
            Dodaj Tip
          </button>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  );
}
