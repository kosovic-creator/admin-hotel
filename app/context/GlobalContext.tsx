/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Session } from 'next-auth';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Definicija tipa za stanje
interface GlobalState {
  user: string | null;
  setUser: (user: string | null) => void;
}

// Inicijalno stanje
const initialState: GlobalState = {
  user: null,
  setUser: () => {},
};

// Kreiranje konteksta
const GlobalContext = createContext<GlobalState>(initialState);

// Provider komponenta
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Simulacija poziva API-ja za autentifikaciju
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session"); // Pretpostavljeni API endpoint
        const data = await res.json();
        setSession(data);

        // Postavljanje korisnika u kontekst nakon uspješnog učitavanja sesije
        if (data?.user?.email) {
          setUser(data.user.email);
        }
      } catch (error) {
        console.error("Greška prilikom učitavanja sesije:", error);
        setSession(null);
      }
    };

    fetchSession();
  }, []);

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook za korištenje konteksta
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalContextProvider");
  }
  return {
    ...context,
    setUserManually: (user: string) => context.setUser(user),
  };
};
