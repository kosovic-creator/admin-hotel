/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Sobe } from '@/types/sobe';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import { rezervacijaSchema } from '@/types/zod/rezervacijeSchema'; // prilagodi putanju ako treba
import { Gost } from '@/types/gosti';
import Toast from '@/components/ui/Toast';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

function DodajRezrvaciju() {
  const searchParams = useSearchParams();
  const sobaId = searchParams.get('sobaId'); // ispravno ime parametra
  const pocetak = searchParams.get('pocetak');
  const kraj = searchParams.get('kraj');
  const [selectedSobaId, setSelectedSobaId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [ime, setIme] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [toast, setToast] = useState<string | null>(null);
  const [soba, setSoba] = useState<Sobe[]>([]);
  const [gost, setGost] = useState<Gost[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    fetch('/api/hotel/sobe')
      .then(res => res.json())
      .then(setSoba);
    fetch('/api/hotel/gosti')
      .then(res => res.json())
      .then(setGost);
  }, []);

  useEffect(() => {
    if (sobaId) setSelectedSobaId(Number(sobaId));
    if (pocetak) setStartDate(new Date(pocetak));
    if (kraj) setEndDate(new Date(kraj));
  }, [sobaId, pocetak, kraj]);

  async function novaRezervacija(e?: React.FormEvent) {
    if (e) e.preventDefault();
    console.log('Pokušaj slanja forme'); // Dodaj ovo

    const data = {
      sobaId: selectedSobaId ? Number(selectedSobaId) : undefined,
      pocetak: startDate ? startDate.toISOString() : undefined,
      kraj: endDate ? endDate.toISOString() : undefined,

      ime,
      email,
      // status,
    };

    const result = rezervacijaSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    if (!selectedSobaId) {
      setErrors(prev => ({ ...prev, sobaId: "Morate izabrati sobu!" }));
      return;
    }
    setErrors({});
    try {
      const body = {
        sobaId: Number(selectedSobaId),
        pocetak: startDate ? startDate.toISOString() : undefined,
        kraj: endDate ? endDate.toISOString() : undefined,

        ime,      // dodaj ovo
        email,    // i ovo
        // status, // ako backend očekuje status
      };
      const response = await fetch(`/api/hotel/rezervacije`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        setToast('Greška u dodavanju nove rezervacije.');
        throw new Error('Greška kod servera');
      }
      setStartDate(null);
      setEndDate(null);
      setIme('');
      setEmail('');
      // setStatus('');
      setToast('Uspješno dodata nova rezrvacija.');
      router.push('/admin/rezervacije');
    } catch (error) {
      console.error('Greška u dodavanju nove rezervacije:', error);
      setToast('Greška u dodavanju nove rezervacije.');
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <p className="text-3xl font-bold text-center text-black-700 mb-2">Nova Rezervacija</p>
        <form
          onSubmit={novaRezervacija}
          className="space-y-4"
        >
          <div className="flex flex-col gap-1 font-medium text-gray-700">
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholderText="Izaberi datum početka"
            />
            {errors.pocetak && <p className="text-red-500 text-xs mt-1">{errors.pocetak}</p>}
          </div>
          <div className="flex flex-col gap-1 font-medium text-gray-700">
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholderText="Izaberi datum kraja"
            />
            {errors.kraj && <p className="text-red-500 text-xs mt-1">{errors.kraj}</p>}
          </div>

          {/* <Select value={status} onValueChange={setStatus}>
            <SelectTrigger
              id="role"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
            >
              {status ? status : "Odaberite status rezervacije"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rezervisano">Rezrevisano</SelectItem>
              <SelectItem value="zauzeto">Zauzeto</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>} */}
          <div>
            <input
              type="text"
              value={ime}
              onChange={(e) => setIme(e.target.value)}
              placeholder="Ime gosta"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {errors.ime && <p className="text-red-500 text-xs mt-1">{errors.ime}</p>}
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email gosta"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
              className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-700 transition"
            >
              Dodaj
            </button>
          </div>
        </form>
      </div>
      <Toast message={toast} />
    </div>
  );
}

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <DodajRezrvaciju />
    </Suspense>
  );
}
