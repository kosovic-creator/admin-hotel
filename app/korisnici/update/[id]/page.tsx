/* eslint-disable @typescript-eslint/no-unused-vars */
// filepath: /todo-app/todo-app/app/update/page.tsx
'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import usersSchema from '@/types/zod/usersSchema';
import { Input } from "@/components/ui/input";
import { useParams } from 'next/navigation';
import Toast from "@/components/ui/Toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
export default function UpdatePage() {
    const [id, setId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPaswword] = useState<string>('');
    const [role, setRole] = useState('USER');
    const [message, setMessage] = useState('');
    const [toast, setToast] = useState<string | null>(null);
    const router = useRouter();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const params = useParams();
    const idd = params?.id;

    useEffect(() => {
        if (typeof idd === 'string') {
            setId(idd);
        } else {
            setId(null); // Handle the case where idd is not a string
        }
    }, [idd]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/auth/korisnici/${id}`, {
                    method: "GET",
                });

                if (!response.ok) {
                    const text = await response.text();
                    let errorData;
                    try {
                        errorData = JSON.parse(text);
                    } catch {
                        errorData = { message: text || "Greška u učitavanju podataka." };
                    }
                    setMessage(errorData.message || "Greška u učitavanju podataka.");
                    return;
                }

                const data = await response.json();
                setName(data.name);
                setEmail(data.email);
                setPaswword(String(data.password));
                setRole(data.role);
            } catch (err) {
                setMessage("Greška.");
                console.error(err);
            }
        };
        if (id) {
            fetchUsers();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate form data using Zod
        const result = usersSchema.safeParse({ name, email, password, role });

        if (!result.success) {
            // Map errors to display them
            const errorMessages = result.error.errors.map((err) => err.message).join(', ');
            setError(errorMessages);
            return;
        }
        try {
            const response = await fetch(`/api/auth/korisnici/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (response.ok) {
                const updatedTodo = await response.json();
                setToast('Izmjena je uspešno izmjenjena!');
                setMessage('Izmena je uspešno dodata!');
                setTimeout(() => router.push('/korisnici'), 2000);
            } else {
                const text = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(text);
                } catch {
                    errorData = { error: text || "Greška pri izmjeni." };
                }
                setMessage(`Error: ${errorData.error || 'Greška pri izmjeni.'}`);
                setTimeout(() => router.push('/korisnici'), 2000);
                return;
            }
        } catch (error) {
            setMessage('Nepoznata greška.');
            console.error(error);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10">
                <h4 className="text-3xl font-bold text-center mb-8 text-gray-900 tracking-tight">
                    Izmjeni korisnika
                </h4>
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                    <div>
                        <Label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email
                        </Label>
                        <Input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                            placeholder="Unesite email"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </Label>
                        <Input
                            type="text"
                            id="password"
                            value={password}
                            onChange={(e) => setPaswword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                            placeholder="Unesite password"
                        />
                    </div>
                    <div>
                        <Label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">
                            Role
                        </Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger
                                id="role"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
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
                                router.push(`/korisnici/${id}`);
                            }}
                        >
                            Odloži
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-500 transition"
                        >
                            Ažuriraj Korisnika
                        </button>

                    </div>

                    {error && <p className="text-red-500 text-center font-medium">{error}</p>}
                    {success && <p className="text-green-600 text-center font-medium">{success}</p>}
                </form>
                <Toast message={toast} />
            </div>
        </div>
    );
}

