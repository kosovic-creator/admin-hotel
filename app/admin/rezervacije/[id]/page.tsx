/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { Rezervacija } from '@/types/rezervacije';
import { Sobe } from '@/types/sobe';

export default function RezervacijaId() {
  const params = useParams();
  const id = params?.id as string;
  const [apartman, setApartman] = useState('');
  const [rezervacija, setRezervacija] = useState<Rezervacija | null>(null);
  const [greska, setGreska] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputId, setInputId] = useState(Number(id));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [soba, setSobe] = useState<Sobe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(soba.length / itemsPerPage);
  const trenutnaSoba = soba.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Funkcija za dohvat rezervacije
  const fetchRezervacija = async (rezId: number) => {
    setGreska('');
    setRezervacija(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/hotel/rezervacije/${rezId}`);
      const data = await res.json();
      if (!res.ok) {
        setGreska(data.greska || 'Greška pri dohvatu rezervacije');
      } else {
        setRezervacija(data);
      }
    } catch (err) {
      setGreska('Greška u mreži');
    } finally {
      setLoading(false);
    }
  };
  // Automatski pozovi kad se promijeni id
  useEffect(() => {
    if (id) {
      setInputId(Number(id));
      fetchRezervacija(Number(id));
    }
  }, [id]);
  const deleteRezervacije = async (id: number) => {
    await fetch(`/api/hotel/rezervacije/${id}`, { method: 'DELETE' });
    setRezervacija(null);
    setTimeout(() => {
      setToast('Rezervacija je uspešno obrisana!');
    }, 2000);
    router.push('/admin/rezervacije');
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-white to-gray-100">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
        {rezervacija && (
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-8 tracking-widest uppercase border-b pb-4">
              Detalji rezervacije
            </h1>
            <div className="space-y-4 mb-8 bg-gray-50 rounded-xl p-6">
              <div className="flex items-center">
                <span className="font-semibold w-32 text-gray-500 text-sm">ID:</span>
                <span className="text-gray-900 text-base">{rezervacija.id}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32 text-gray-500 text-sm">Korisnik:</span>
                <span className="text-gray-900 text-base">{rezervacija.gost?.ime}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32 text-gray-500 text-sm">Početak:</span>
                <span className="text-gray-900 text-base">{rezervacija.pocetak}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32 text-gray-500 text-sm">Završetak:</span>
                <span className="text-gray-900 text-base">{rezervacija.kraj}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/admin/rezervacije" className="flex-1">
                <button className="w-full px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold transition shadow cursor-pointer">
                  Nazad
                </button>
              </Link>
              <Link href={`/admin/rezervacije/uredi/${rezervacija.id}`} className="flex-1">
                <button className="w-full px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 font-semibold transition shadow cursor-pointer">
                  Izmjeni
                </button>
              </Link>
              <button
                className="flex-1 w-full px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 font-semibold transition shadow cursor-pointer"
                onClick={() => deleteRezervacije(rezervacija.id)}
              >
                Briši
              </button>
            </div>
          </div>
        )}
        <Toast message={toast} />
      </div>
    </div>
  );
}