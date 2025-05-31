// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react'

export default function Profil() {
  // const router = useRouter();
  return (
    <div>
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="mt-4">Ovdje možete vidjeti svoj profil.</p>
        <div className="mt-4">
            <h2 className="text-xl font-semibold">Osnovne informacije</h2>
        </div>
<Link href="/login">Prijavi se</Link>
    </div>
  )
}
