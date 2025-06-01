'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import { Rezervacija } from '@/types/rezervacije';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [zauzetiTermini, setZauzetiTermini] = useState<{ start: string; end: string }[]>([]);


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

  useEffect(() => {
    async function fetchZauzetiTermini() {
      if (!sobaId) return;
      const res = await fetch(`/api/hotel/rezervacije/zauzeti/${sobaId}`);
      if (res.ok) {
        const termini = await res.json();
        // Izuzmi trenutnu rezervaciju iz zauzetih termina
        setZauzetiTermini(
          termini.filter(
            (t: { start: string; end: string }) =>
              !(t.start === rezervacija?.pocetak && t.end === rezervacija?.kraj)
          )
        );
      }
    }
    fetchZauzetiTermini();
  }, [sobaId, rezervacija]);

  const excludeIntervals = zauzetiTermini.map(t => ({
    start: new Date(t.start),
    end: new Date(t.end),
  }));

  const isValidRange = pocetak && kraj && new Date(pocetak) < new Date(kraj);

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
        <p className="text-2xl font-bold  text-center text-gray-800 mb-6">Ažuriranje Rezervacije</p>
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
            <DatePicker
              selected={pocetak ? new Date(pocetak) : null}
              onChange={date => setPocetak(date ? date.toISOString().slice(0, 16) : '')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="yyyy-MM-dd'T'HH:mm"
              excludeDateIntervals={excludeIntervals}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Kraj</label>
            <DatePicker
              selected={kraj ? new Date(kraj) : null}
              onChange={date => setKraj(date ? date.toISOString().slice(0, 16) : '')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="yyyy-MM-dd'T'HH:mm"
              excludeDateIntervals={excludeIntervals}
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
              disabled={!gostId || !sobaId || !pocetak || !kraj || !isValidRange}
            >
              Ažuriraj Rezervaciju
            </button>
          </div>
          {!isValidRange && <p className="text-red-500 text-xs mt-1">Početak mora biti prije kraja!</p>}
        </form>
        {error && (
          <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>
        )}
      </div>
      <Toast message={toast} />
    </div>
  );
}
