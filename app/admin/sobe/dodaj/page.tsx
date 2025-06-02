/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Toast from '@/components/ui/Toast';
import { sobaSchema } from "@/types/zod/sobaSchema";
export default function DodajSobu() {
  const params = useParams();
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [opis, setOpis] = useState<string>('');
  const [statusAktivna, setStatusAktivna] = useState(true);
  const [sobaBroj, setSobaBroj] = useState<string>('');
  const [slike, setSlike] = useState<string[]>([]);
  const [tip, setTip] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tipoviSoba, setTipoviSoba] = useState<{ id: number; ime: string }[]>([]);
  useEffect(() => {
    async function fetchTipoviSoba() {
      try {
        const res = await fetch('/api/hotel/tipSobe');
        if (!res.ok) throw new Error('Greška pri učitavanju tipova soba');
        const data = await res.json();
        setTipoviSoba(data);
      } catch (e) {
      }
    }
    fetchTipoviSoba();
  }, []);
  async function novaSoba() {
    setErrors({});
    const body = {
      sobaBroj: sobaBroj === '' ? undefined : Number(sobaBroj),
      tipSobeId: tip === '' ? undefined : Number(tip),
      opis,
      status: statusAktivna ? 'spremna' : 'nije  spremna',
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
      setSobaBroj('');
      setTip('');
      setOpis('');
      setStatusAktivna(true);
      setSlike([]);
      setToast('Uspješno ste dodali novu sobu.');
      setTimeout(() => router.push('/admin/sobe'), 1500);
    } catch (error) {
      console.error('Greška u dodavanju nove sobe:', error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg space-y-8">
        <p className="text-2xl font-bold text-center text-black mb-4 tracking-tight">Nova Soba</p>
        <div className="space-y-5">
          <input
            type="number"
            value={sobaBroj}
            onChange={(e) => setSobaBroj(e.target.value)}
            placeholder="Broj Sobe"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
          />
          <select
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
          >
            <option value="">Odaberite tip sobe</option>
            {tipoviSoba.map((t) => (
              <option key={t.id} value={t.id}>
                {t.ime}
              </option>
            ))}
          </select>
          {errors.tip && <p className="text-red-500 text-sm">{errors.tip}</p>}
          <input
            type="text"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            placeholder="Opis"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="statusAktivna"
              checked={statusAktivna}
              onChange={() => setStatusAktivna((prev) => !prev)}
              className="w-5 h-5"
            />
            <label htmlFor="statusAktivna" className="text-lg">
              Soba je spremna
            </label>
          </div>
        </div>
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
            type="button"
            onClick={novaSoba}
            className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-700 transition cursor-pointer"
          >
            Dodaj Sobu
          </button>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  );
}
