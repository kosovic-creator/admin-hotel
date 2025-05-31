/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/rezervacije/dostupnost/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const Schema = z.object({
 sobaId: z.number().int().positive(),
  pocetak: z.string().datetime(),
  kraj: z.string().datetime()
});
  try {
    const {sobaId, pocetak, kraj } = await req.json();

    const postojeceRezervacije = await prisma.rezervacija.findMany({
      where: {
       sobaId,
       AND: [
  { pocetak: { lt: kraj } },
  { kraj: { gt: pocetak } }
]

      }
    });

    return NextResponse.json({ dostupno: postojeceRezervacije.length === 0 });

  } catch (error) {
    return NextResponse.json(
      { greska: 'Greška pri provjeri dostupnosti' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
