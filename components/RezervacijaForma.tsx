'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';
import { useRouter } from 'next/navigation';

type Interval = { start: Date; end: Date };

export default function RezervacijaForma({ apartmanId }: { apartmanId: number }) {
  const [pocetak, setPocetak] = useState<Date | null>(null);
  const [kraj, setKraj] = useState<Date | null>(null);
  const [zauzeti, setZauzeti] = useState<Interval[]>([]);
  const router = useRouter();
  useEffect(() => {
    fetch(`/api/rezervacije/zauzeti/${apartmanId}`)
      .then(res => res.json())
      .then((data: { start: string; end: string }[]) => {
        setZauzeti(
          data.map(i => ({
            start: new Date(i.start),
            end: new Date(i.end),
          }))
        );
      });
  }, [apartmanId]);

  const potvrdiRezervaciju = async () => {
    router.push('/pregled-slobodnih-apartmana');
  };

  return (
    <div className="max-w-4xl p-10 bg-white rounded-lg shadow w-full">
      <div className="mb-4 w-full">
        {/* <label className="block mb-2">Odaberite datume:</label> */}
        <DatePicker
          selected={pocetak}
          onChange={(dates: [Date | null, Date | null]) => {
            const [start, end] = dates;
            setPocetak(start);
            setKraj(end);
          }}
          startDate={pocetak}
          endDate={kraj}
          selectsRange
          minDate={new Date()}
          inline
          excludeDateIntervals={zauzeti}
          className="custom-datepicker-input"
          calendarClassName="custom-calendar"
        />
      </div>
      <button
        onClick={potvrdiRezervaciju}
        className="w-60 py-2 text-white bg-blue-900 rounded hover:bg-blue-700"
      >
        Rezerviši
      </button>
      <Link href="/admin" className="px-4 py-2 text-blue-700 hover:text-blue-400 mb-4">
        Admin
      </Link>
    </div>
  );
}
