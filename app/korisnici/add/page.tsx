/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import userSchema from '@/types/zod/usersSchema'; // Import your Zod schema from the appropriate file
import { Label } from "@/components/ui/label";
import { useSession } from 'next-auth/react';
import Toast from '@/components/ui/Toast';


export default function AddTodoForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession()
  const [toast, setToast] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form data using Zod
    const result = userSchema.safeParse({
      name: name,
      email: email,
      password: password,
      role: role,
    });

    if (!result.success) {
      // Map errors to display them
      const errorMessages = result.error.errors.map((err) => err.message).join(', ');
      setError(errorMessages);
      return;
    }

    try {
      const response = await fetch('/api/auth/korisnici', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.data), // Use validated data
      });

      if (response.ok) {
        setToast('Korisnik je uspješno dodat!');
        setName('');
        setEmail('');
        setPassword('');
        setRole('');
        setTimeout(() => router.push('/user/users'), 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Greška u dodavanju korisnika.');
      }
    } catch (err) {
      setError('Greška prilikom slanja podataka.');
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto mt-16 p-10 bg-white rounded-2xl shadow-2xl space-y-7 border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6 tracking-tight">
          Dodaj Korisnika
        </h1>
        <div className="space-y-2">
          <Label htmlFor="ime" className="font-semibold text-gray-700">Ime</Label>
          <Input
            id="ime"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
            placeholder="Unesite ime"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-semibold text-gray-700">Email</Label>
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
            placeholder="Unesite email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="šifra" className="font-semibold text-gray-700">Šifra</Label>
          <Input
            id="šifra"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
            placeholder="Unesite šifru"
            type="password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="font-semibold text-gray-700">Rola</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger
              id="role"
              className="border border-gray-300 rounded-xl p-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
            >
              {role ? role : "Odaberite rolu"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-medium transition"
            onClick={() => {
              router.push(`/user/users`);
            }}
          >
            Odloži
          </button>
          <button
            type="submit"
            className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Dodaj Korisnika
          </button>
        </div>

        {error && <p className="text-red-500 text-center font-medium">{error}</p>}
        {success && <p className="text-green-600 text-center font-medium">{success}</p>}
      </form>
      <Toast message={toast} />
    </>
  );
}