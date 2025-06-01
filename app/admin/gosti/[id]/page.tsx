/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Gost } from '@/types/gosti';
import Toast from '@/components/ui/Toast';

export default function DetaljiGosta() {
  const params = useParams();
  const id = params?.id as string;
  const [ime, setIme] = useState<string>('');
  const [prezime, setPrezime] = useState<string>('');
  const [email, setEmail] = useState<string>('');
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
  function brišiGosta(id: number) {
    fetch(`/api/hotel/gosti/${id}`, {
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
        setGost(null);
        setToast('Gost je uspešno obrisan!');
        setTimeout(() => router.push('/admin/gosti'), 2000);

      })
      .catch((error) => {
        setError(error);
        console.error('Greška pri brisanju gosta:', error);
      });
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-tight border-b pb-4">
          Detalji gosta
        </h1>
        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">ID:</span>
            <span className="text-gray-900">{gost?.id}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">Ime:</span>
            <span className="text-gray-900">{gost?.ime}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">Prezime:</span>
            <span className="text-gray-900">{gost?.prezime}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">Email:</span>
            <span className="text-gray-900">{gost?.email}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold transition cursor-pointer"
            onClick={() => router.push(`/admin/gosti`)}
          >
            Nazad
          </button>
          <button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition cursor-pointer"
            onClick={() => router.push(`/admin/gosti/uredi/${gost?.id}`)}
          >
            Ažuriraj
          </button>
          <button
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-xl font-semibold transition cursor-pointer"
            onClick={() => brišiGosta(gost?.id as number)}
          >
            Briši gosta
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
