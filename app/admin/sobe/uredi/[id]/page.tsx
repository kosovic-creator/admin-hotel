'use client';

import React, { useState, useEffect } from 'react';
import {useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Toast from '@/components/ui/Toast';
import { UploadButton } from '@/lib/uploadthing';
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
      } catch (error) {
        setError(error as Error);
      }
    }
    if (id) učitajSobuId();
  }, [params.id]);

  async function azurirajSobu() {
    setErrors({});
    const body = { sobaBroj, status, slike };
    const parsed = sobaSchema.safeParse(body);
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
      if (!response.ok) {
        throw new Error('Nema odgovora sa servera');
      }
      const data = await response.json();
      setToast('Soba uspešno ažurirana!');
      setSobaBroj(data.sobaBroj);
      setStatus(data.status);
      setSlike([]);
      router.push('/admin/sobe');
    } catch (error) {
      setToast('Greška pri ažuriranju sobe.');
      console.error('Greska pri azuriranju sobe', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col items-center">
        <p className="text-2xl font-extrabold  text-center text-gray-800 mb-8">Ažuriranje Sobe</p>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            azurirajSobu();
          }}
        >
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Unesite naziv"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
          <input
            type="number"
            value={sobaBroj}
            onChange={(e) => setSobaBroj(Number(e.target.value))}
            placeholder="Unesite broj sobe"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.sobaBroj && <p className="text-red-500 text-sm">{errors.sobaBroj}</p>}

          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res: { url: string }[]) => {
              setSlike(res.map((file) => file.url));
            }}
            onUploadError={(error: Error) => {
              alert(`Greška pri uploadu: ${error.message}`);
            }}
          />
          {errors.slike && <p className="text-red-500 text-sm">{errors.slike}</p>}
          {slike.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {slike.map((url, idx) => (
                <Image
                  key={idx}
                  src={url}
                  alt={`Slika ${idx + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-medium transition"
              onClick={() => {
                router.push(`/admin/sobe`);
              }}
            >
              Odloži
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-700 transition"
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
