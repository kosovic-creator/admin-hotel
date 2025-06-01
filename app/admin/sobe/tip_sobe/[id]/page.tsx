/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { tipSobe } from '@/types/tipSobe';
import Toast from '@/components/ui/Toast';

export default function DetaljiTipSobe() {
  const params = useParams();
  const id = params?.id as string;
  const [ime, setIme] = useState<string>('');
  const [cijena, setCijena] = useState<number>();
  const [kapacitet, setKapacitet] = useState<number>();
  const router = useRouter();
  const [tipSobeId, setTipSobeId] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [tipSobe, setTipSobe] = useState<tipSobe | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    async function učitajTipSobeId() {
      try {
        const response = await fetch(`/api/hotel/tipSobe/${id}`);
        if (!response.ok) {
          throw new Error('Greška ko servera');
        }
        const data = await response.json();
        setIme(data.ime);
        setCijena(data.cijena);
        setKapacitet(data.kapacitet);
        setTipSobe(data);
        setTipSobeId(data.id);
      } catch (error) {
        setError(error as Error);
      }
    }
    if (id) učitajTipSobeId();
  }, [id]);
  function brišiTipSobe(id: number) {
    fetch(`/api/hotel/tipSobe/${id}`, {
      method: 'DELETE',
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Server ne može da obradi zahtjev: ${response.status} ${errorText}`
          );
        }
        return response.json();
      })
      .then(() => {
        setTipSobe(null);
        setToast('Tip sobe je uspešno obrisan!');
        setTimeout(() => router.push('/admin/sobe/tip_sobe'), 2000);

      })
      .catch((error) => {
        setError(error);
        console.error('Greška pri brisanju tipa sobe:', error);
      });
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 tracking-tight border-b pb-4">
          Detalji Tipa Sobe
        </h1>
        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">ID:</span>
            <span className="text-gray-900">{tipSobe?.id}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">Naziv:</span>
            <span className="text-gray-900">{tipSobe?.ime}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">Kapacitet:</span>
            <span className="text-gray-900">{tipSobe?.kapacitet}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">Cijena:</span>
            <span className="text-gray-900">{tipSobe?.cijena}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold transition  cursor-pointer"
            onClick={() => router.push(`/admin/sobe/tip_sobe`)}
          >
            Nazad
          </button>
          <button

            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition  cursor-pointer"
            onClick={() => router.push(`/admin/sobe/tip_sobe/uredi/${tipSobe?.id}`)}
          >
            Ažuriraj
          </button>
          <button

            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-xl font-semibold transition  cursor-pointer"
            onClick={() => brišiTipSobe(tipSobe?.id as number)}
          >
            Briši Tip
          </button>
        </div>
        {error && (
          <p className="mt-6 text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 text-center font-medium">
            Error: {error.message}
          </p>
        )}
      </div>
     <Toast
        message={toast}></Toast>
    </div>
  );
}
