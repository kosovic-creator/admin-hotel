/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import { Rezervacija } from '@/types/rezervacije';

export default function AzurirajRezervaciju() {
  const params = useParams();
  const id = params?.id as string;
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const [gostId, setGostId] = useState<number>();
  const [sobaId, setSobeId] = useState<number>();
  const [error, setError] = useState<Error | null>(null);
  const [rezervacija, setRezervacija] = useState<Rezervacija | null>(null);
  const [pocetak, setPocetak] = useState<string>('');
  const [kraj, setKraj] = useState<string>('');


  useEffect(() => {
    async function učitajRezervacijuId() {
      try {
        const response = await fetch(`/api/hotel/rezervacije/${id}`);
        if (!response.ok) {
          throw new Error('Greška ko servera');
        }
        const data = await response.json();
        setRezervacija(data);
        setGostId(data.gost?.id);
        setSobeId(data.soba?.id);
        setPocetak(data.pocetak ? data.pocetak.slice(0, 16) : '');
        setKraj(data.kraj ? data.kraj.slice(0, 16) : '');
      } catch (error) {
        setError(error as Error);
      }
    }
    if (id) učitajRezervacijuId();
  }, [id]);

  async function azirirajRezervaciju() {
    try {
      const response = await fetch(`/api/hotel/rezervacije/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          sobaId,
          gostId,
          pocetak,
          kraj,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Nema odgovora sa servera');
      }
      const data = await response.json();
      console.log('Updated:', data);
      setToast('Uspješno ste izmjenili rezervaciju .');
      setTimeout(() => router.push('/admin/rezervacije'), 2000);
    } catch (error) {
      console.error('Greska pri azuriranju rezervacije', error);
      setError(error as Error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-2xl  text-center text-gray-800">Ažuriranje Rezervacije</p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            azirirajRezervaciju();
          }}
        >
          <div>
            <label className="block font-medium">Gost ID</label>
            <input
              type="number"
              name="gostId"
              value={gostId ?? ''}
              onChange={(e) => setGostId(Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Soba ID</label>
            <input
              type="number"
              name="sobaId"
              value={sobaId ?? ''}
              onChange={(e) => setSobeId(e.target.value === '' ? undefined : Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Početak</label>
            <input
              type="datetime-local"
              name="pocetak"
              value={pocetak}
              onChange={(e) => setPocetak(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Kraj</label>
            <input
              type="datetime-local"
              name="kraj"
              value={kraj}
              onChange={(e) => setKraj(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
          </div>
          <div className="flex gap-4">
            <button
              type="button"

              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-medium transition  cursor-pointer"
              onClick={() => {
                router.push(`/admin/rezervacije`);
              }}
            >
              Odloži
            </button>
            <button
              type="submit"

              className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-700 transition  cursor-pointer"
              disabled={!gostId || !sobaId || !pocetak || !kraj}
            >
              Ažuriraj Rezervaciju
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
