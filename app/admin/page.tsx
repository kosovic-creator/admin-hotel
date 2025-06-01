'use client';

import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading' || !session) {
    return null // ili spinner dok se proverava sesija
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-xl w-full">
        <p className="text-2xl font-bold text-center text-gray-900 mb-2 tracking-tight">
          Admin Hotel
        </p>
        <p className="text-center text-gray-600 text-lg">
          Dobrodošli u administratorski deo aplikacije.
        </p>
      </div>
    </div>
  )
}

