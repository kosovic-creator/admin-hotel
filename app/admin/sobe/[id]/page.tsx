/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sobe } from '@/types/sobe';
import Toast from '@/components/ui/Toast';

export default function SobeId() {
  const params = useParams();
  const id = params?.id as string;
  const [error, setError] = useState<Error | null>(null);
  const [soba, setSoba] = useState<Sobe | null>(null);
  const [sobaId, setSobaId] = useState<number | null>(null);
  const [naziv, setNaziv] = useState<string>('');
  const [opis, setOpis] = useState<string>('');
  const [cijena, setCijena] = useState<number>(0);
  const [slike, setSlike] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function učitajSobuId() {
      try {
        const response = await fetch(`/api/hotel/sobe/${id}`);
        if (!response.ok) {
          throw new Error('Greška kod servera');
        }
        const data = await response.json();
        setSoba(data);
        setSobaId(data.id);
        setNaziv(data.naziv);
        setOpis(data.opis);
        setCijena(data.cijena);
        setSlike(data.slike);

      } catch (error) {
        setError(error as Error);
      }
    }
    if (id) učitajSobuId();
  }, [id]);
  function brišiSobu(id: number) {
    fetch(`/api/hotel/sobe/${id}`, {
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
        setSoba(null);
        setTimeout(() => {
          setToast('Uspješno uklonili sobu.');
        }
          , 2000);
        router.push('/admin/sobe');
      })
      .catch((error) => {
        setError(error);
      });
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-tight border-b pb-4">
          Detalji soba
        </h1>
        <div className="space-y-4 mb-8">

          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">Broj:</span>
            <span className="text-gray-900">{soba?.sobaBroj}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">Opis:</span>
            <span className="text-gray-900">{soba?.opis}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">Cijena:</span>
            <span className="text-gray-900">{soba?.tipSobe.cijena} €</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-32 text-gray-600">Status:</span>
            <span className="text-gray-900">{soba?.status}</span>
          </div>
          {soba && soba.slike && Array.isArray(soba.slike) && soba.slike.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center">
              {soba.slike.map((url: string, idx: number) => (
                <Image
                  key={idx}
                  src={url.trim()}
                  alt={`slika apartmana ${soba.tipSobe.ime}`}
                  width={128}
                  height={96}
                  className="w-32 h-24 object-cover rounded-xl border border-gray-200 shadow"
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold transition  cursor-pointer"
            onClick={() => router.push(`/admin/sobe`)}
          >
            Nazad
          </button>
          <button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition cursor-pointer"
            onClick={() => router.push(`/admin/sobe/uredi/${soba?.id}`)}
          >
            Ažuriraj
          </button>
          <button
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-xl font-semibold transition cursor-pointer"
            onClick={() => brišiSobu(soba?.id as number)}
          >
            Briši sobu
          </button>
        </div>
        {error && (
          <p className="mt-6 text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 text-center font-medium">
            Error: {error.message}
          </p>
        )}
      </div>
      <Toast message={toast} />
    </div>
  );
}