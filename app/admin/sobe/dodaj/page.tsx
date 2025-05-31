/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import Toast from '@/components/ui/Toast';
import { sobaSchema } from "@/types/zod/sobaSchema";

export default function DetaljiSobe() {
  const params = useParams();
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [naziv, setNaziv] = useState<string>('');
  const [opis, setOpis] = useState<string>('');
  const [cijena, setCijena] = useState<number>(0);
  const [kapacitet, setKapacitet] = useState<number>(1);
  const [slike, setSlike] = useState<string[]>([]);
  const [tip, setTip] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function novaSoba() {
    setErrors({});
    const body = {
      tip,
      naziv,
      opis,
      kapacitet,
      cijena,
      slike,
    };
    const parsed = sobaSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      const response = await fetch(`/api/hotel/sobe`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Greška kod servera');
      }
      setTip('');
      setNaziv('');
      setOpis('');
      setCijena(0);
      setCijena(1);
      setSlike([]);
      router.push('/admin/sobe');
    } catch (error) {
      setToast('Greška u dodavanju nove soba.');
      console.error('Greška u dodavanju novog gosta:', error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg space-y-8">
        <p className="text-4xl font-extrabold text-center text-blue-900 mb-4 tracking-tight">Nova Soba</p>
        <div className="space-y-5">
          <input
            type="text"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            placeholder="Tip Sobe"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
          />
          {errors.tip && <p className="text-red-500 text-sm">{errors.tip}</p>}
          <input
            type="text"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
            placeholder="Ime"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
          />
          {errors.naziv && <p className="text-red-500 text-sm">{errors.naziv}</p>}
          <input
            type="text"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            placeholder="Opis"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
          />
          {errors.opis && <p className="text-red-500 text-sm">{errors.opis}</p>}
          <input
            type="number"
            value={cijena}
            onChange={(e) => setCijena(Number(e.target.value))}
            placeholder="Cijena"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
          />
           <input
            type="number"
            value={kapacitet}
            onChange={(e) => setKapacitet(Number(e.target.value))}
            placeholder="Cijena"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
          />
          {errors.kapacitet && <p className="text-red-500 text-sm">{errors.kapacitet}</p>}
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
        </div>
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
            type="button"
            onClick={novaSoba}
            className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-700 transition"
          >
            Dodaj Sobu
          </button>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  );
}
