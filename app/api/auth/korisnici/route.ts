import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// CREATE
export async function POST(request: NextRequest) {
  const body = await request.json();
  const noviKorisnik = await prisma.korisnik.create({
    data: body,
  });
  return NextResponse.json(noviKorisnik);
}

// READ (svi todo)
export async function GET() {
  const korisnici = await prisma.korisnik.findMany();
  return NextResponse.json(korisnici);
}