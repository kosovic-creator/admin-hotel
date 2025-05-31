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
  const [sobaId, setSobeId] = useState<number>(); // promenite ime iz 'sobaId' u 'sobaId'
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
          sobaId, // <-- ispravljeno ime polja
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
      setToast('Uspješno napravili izmjenu .');
      router.push('/admin/rezervacije');
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
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-medium transition"
              onClick={() => {
                router.push(`/admin/rezervacije`);
              }}
            >
              Odloži
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >
              Ažuriraj Rezervaciju
            </button>

          </div>
        </form>
        {error && (
          <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>
        )}
      </div>
    </div>
  );
}




//   const router = useRouter();
//   const params = useParams<{ id: string }>();
//   const [form, setForm] = useState<Rezervacija>({
//     apartmanId: 0,
//     korisnikId: 0,
//     pocetak: '',
//     kraj: '',
//     gosti: 1,
//   });
//   const [greske, setGreske] = useState<Record<string, string[]>>({});
//   const [loading, setLoading] = useState(false);

//   // Učitaj postojeće podatke rezervacije
//   useEffect(() => {
//     async function fetchRezervacija() {
//       const res = await fetch(`/api/rezervacije/${params.id}`);
//       if (res.ok) {
//         const data = await res.json();
//         setForm({
//           apartmanId: data.apartmanId ?? 0,
//           korisnikId: data.korisnikId ?? 0,
//           pocetak: data.pocetak ? data.pocetak.slice(0, 16) : '',
//           kraj: data.kraj ? data.kraj.slice(0, 16) : '',
//           gosti: data.gosti ?? 1,
//         });
//       }
//     }
//     fetchRezervacija();
//   }, [params.id]);

//   // Handler za promjenu inputa
//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: name === 'gosti' || name === 'apartmanId' || name === 'korisnikId'
//         ? Number(value)
//         : value,
//     }));
//   }
//   // Slanje forme
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setGreske({});
//     const res = await fetch(`/api/rezervacije/${params.id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     if (res.ok) {
//         setToast('Rezervacija je uspešno izmjenjena!');
//       router.push('/admin/rezervacije');
//     } else {
//       const data = await res.json();
//       setGreske(data.greske?.fieldErrors || {});
//     }
//     setLoading(false);
//   }

//   return (
//     <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl  mb-6 text-center text-black">Ažuriraj Rezervaciju</h2>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="block font-medium">Apartman ID</label>
//           <input
//             type="number"
//             name="apartmanId"
//             value={form.apartmanId}
//             onChange={handleChange}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           {greske.apartmanId && <p className="text-red-500 text-sm">{greske.apartmanId.join(', ')}</p>}
//         </div>
//         <div>
//           <label className="block font-medium">Korisnik ID</label>
//           <input
//             type="number"
//             name="korisnikId"
//             value={form.korisnikId}
//             onChange={handleChange}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           {greske.korisnikId && <p className="text-red-500 text-sm">{greske.korisnikId.join(', ')}</p>}
//         </div>
//         <div>
//           <label className="block font-medium">Početak</label>
//           <input
//             type="datetime-local"
//             name="pocetak"
//             value={form.pocetak}
//             onChange={handleChange}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           {greske.pocetak && <p className="text-red-500 text-sm">{greske.pocetak.join(', ')}</p>}
//         </div>
//         <div>
//           <label className="block font-medium">Kraj</label>
//           <input
//             type="datetime-local"
//             name="kraj"
//             value={form.kraj}
//             onChange={handleChange}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           {greske.kraj && <p className="text-red-500 text-sm">{greske.kraj.join(', ')}</p>}
//         </div>
//         <div>
//           <label className="block font-medium">Broj gostiju</label>
//           <input
//             type="number"
//             name="gosti"
//             min={1}
//             value={form.gosti}
//             onChange={handleChange}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           {greske.gosti && <p className="text-red-500 text-sm">{greske.gosti.join(', ')}</p>}
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-blue-900 transition"
//         >
//           {loading ? 'Ažuriranje...' : 'Ažuriraj'}
//         </button>
//       </form>
//       <Toast message={toast} />
//     </div>
//   );
// }
