'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users } from "@/types/users";
import Toast from "@/components/ui/Toast";
import PotvrdiBrisanjeUser from "@/components/PotvrdaBrisanjaModal/PotvrdiBrisanjeUser";


export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);

  const [users, setUsers] = useState<Users | null>(null);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todos, setTodos] = useState<Users[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setId(resolved.id);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return; // Dodaj ovu proveru
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
            errorData = { message: text || "Greška pri učitavanju podataka." };
          }
          setError(errorData.message || "Greška pri učitavanju podataka.");
          return;
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      }
    };

    fetchUsers();
  }
    , [id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUsers(null);

    try {
      const response = await fetch(`/api/auth/korisnici/${id}`, {
        method: "GET",
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch korisnici.");
        return;
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Nepoznata greška.");
      console.error(err);
    }
  };
  const openDeleteConfirmModal = (id: string | number) => {
    setSelectedItemId(id);
    setIsModalOpen(true);
  };
  const closeDeleteConfirmModal = () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
  };
  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }
  const router = useRouter();
  // Delete user function
  const deleteTodo = async (id: string) => {
    await fetch(`/api/auth/korisnici/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t.id !== Number(id)));
    setIsModalOpen(false);

    showToast('Korisnkje uspešno obrisan!');
    setTimeout(() => router.push('/korisnici'), 1500);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {users && (
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6 tracking-tight border-b pb-4">
                Detalji korisnika
              </h1>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="font-semibold w-32 text-gray-600">Email:</span>
                  <span className="text-gray-900">{users.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-32 text-gray-600">Password:</span>
                  <span className="text-gray-900">{users.password ? "Da" : "Ne"}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-32 text-gray-600">Role:</span>
                  <span className="text-gray-900">{users.role || "N/A"}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link
                  href="/korisnici"
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-center font-semibold"
                >
                  Nazad
                </Link>
                <Link
                  href={`/korisnici/update/${users.id}`}
                  className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-center font-semibold"
                >
                  Izmjeni
                </Link>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition text-center font-semibold"
                  onClick={() => openDeleteConfirmModal(users.id)}
                >
                  Briši
                </button>
              </div>
            </div>
          )}
        </form>
        <PotvrdiBrisanjeUser
          isOpen={isModalOpen}
          onClose={closeDeleteConfirmModal}
          onConfirm={() => deleteTodo(String(selectedItemId!))}
          itemId={selectedItemId!}
          email={users?.email ?? ""}
        />
        <Toast message={toast} />
        {error && (
          <div className="mt-6 text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 text-center font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
