import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const sobaId = parseInt(pathParts[pathParts.length - 1], 10);
  if (isNaN(sobaId)) {
    return NextResponse.json({ error: 'Neispravan ID apartmana' }, { status: 400 });
  }
  const rezervacije = await prisma.rezervacija.findMany({
    where: { sobaId },
    select: {
      pocetak: true,
      kraj: true,
      gost: {
        select: {
          ime: true,
          prezime: true
        }
      }
    }
  });
  return NextResponse.json(
    rezervacije.map(r => ({
      start: r.pocetak,
      end: r.kraj,
      imeKorisnika: r.gost?.ime ?? null,
      prezimeKorisnika: r.gost?.prezime ?? null
    }))
  );
}
