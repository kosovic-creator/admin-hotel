'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Toast from '@/components/ui/Toast';
import { sobaSchema } from '@/types/zod/sobaSchema';

export default function AzurirajSobu() {
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [sobaBroj, setSobaBroj] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [slike, setSlike] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [opis, setOpis] = useState<string>('');

  useEffect(() => {
    const id = params.id;
    async function učitajSobuId() {
      try {
        const response = await fetch(`/api/hotel/sobe/${id}`);
        if (!response.ok) {
          throw new Error('Greška na serveru');
        }
        const data = await response.json();
        setSobaBroj(data.sobaBroj);
        setStatus(data.status);
        setSlike(data.slike);
        setOpis(data.opis);
      } catch (error) {
        setError(error as Error);
      }
    }
    if (id) učitajSobuId();
  }, [params.id]);

  async function azurirajSobu() {
    console.log('Pozvana funkcija azurirajSobu');
    setErrors({});
    const body = { sobaBroj, status, slike, opis };
    console.log('Body za validaciju:', body);
    const parsed = sobaSchema.safeParse(body);
    console.log('Rezultat validacije:', parsed);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    const id = params.id;
    try {
      const response = await fetch(`/api/hotel/sobe/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response);
      if (!response.ok) {
        throw new Error('Nema odgovora sa servera');
      }
      const data = await response.json();
      setSobaBroj(data.sobaBroj);
      setStatus(data.status);
      setSlike([]);
      setToast('Soba uspešno ažurirana!');
      setTimeout(() => router.push('/admin/sobe'), 2000);
    } catch (error) {
      setToast('Greška pri ažuriranju sobe.');
      console.error('Greska pri azuriranju sobe', error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col items-center">
        <p className="text-2xl font-bold  text-center text-gray-800 mb-8">Ažuriranje Sobe</p>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            azurirajSobu();
          }}
        >
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Odaberite status</option>
            <option value="spremna">Spremna</option>
            <option value="nije spremna">Nije spremna</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
          <input
            type="number"
            value={sobaBroj}
            onChange={(e) => setSobaBroj(Number(e.target.value))}
            placeholder="Unesite broj sobe"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.sobaBroj && <p className="text-red-500 text-sm">{errors.sobaBroj}</p>}
          <input
            type="text"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            placeholder="Unesite opis"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.opis && <p className="text-red-500 text-sm">{errors.opis}</p>}

          <div>
            <label
              htmlFor="slike-upload"
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-blue-600   text-lg cursor-pointer block my-2 text-center"
            >
              Nađi fajl
            </label>
            <input
              id="slike-upload"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                const files = e.target.files;
                if (!files) return;
                const fileUrls = Array.from(files).map((file) => URL.createObjectURL(file));
                setSlike(fileUrls);
              }}
            />
          </div>
          {errors.slike && <p className="text-red-500 text-sm">{errors.slike}</p>}
          {slike.length > 0 && (
            <div className="flex gap-4 flex-wrap my-4 justify-center">
              {slike.map((url, idx) => (
                <Image
                  key={idx}
                  src={url}
                  alt={`Slika ${idx + 1}`}
                  width={90}
                  height={90}
                  className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow"
                />
              ))}
            </div>
          )}
          <div className="flex gap-4">
            <button
              type="button"

              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-medium transition cursor-pointer"
              onClick={() => {
                router.push(`/admin/sobe`);
              }}
            >
              Odloži
            </button>
            <button
              type="submit" // <-- OVO MORA BITI submit

              className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-700 transition  cursor-pointer"
            >
              Ažuriraj Sobu
            </button>
          </div>
        </form>
        {error && (
          <p className="mt-4 text-red-600 text-center w-full">Error: {error.message}</p>
        )}
        <Toast message={toast} />
      </div>
    </div>
  );
}
