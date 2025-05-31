import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper za izvlačenje ID-ja iz URL-a
function getIdFromRequest(request: NextRequest): number {
  const idStr = request.nextUrl.pathname.split('/').pop();
  if (!idStr || isNaN(Number(idStr))) throw new Error('Neispravan ID');
  return Number(idStr);
}

// READ ONE
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    const rezervacije = await prisma.rezervacija.findUnique({
      where: { id },
      include: {
        soba: true, // ili select: { id: true, naziv: true, status: true }
        gost: { select: { id: true, ime: true, email: true } }
      }
    });
    if (!rezervacije) return NextResponse.json({ error: 'Nije nađena Rezervacija' }, { status: 404 });
    return NextResponse.json(rezervacije);
  } catch {
    return NextResponse.json({ error: 'Neispravan ID' }, { status: 400 });
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Neispravno telo zahteva (nije validan JSON)' }, { status: 400 });
    }

    // Provera da li je sobaId validan broj
    if (!body.sobaId || isNaN(Number(body.sobaId))) {
      return NextResponse.json({ error: 'Nedostaje ili je neispravan sobaId' }, { status: 400 });
    }

    const azurirano = await prisma.rezervacija.update({
      where: { id },
      data: {
        pocetak: new Date(body.pocetak).toISOString(),
        kraj: new Date(body.kraj).toISOString(),
        soba: { connect: { id: Number(body.sobaId) } },
        gost: { connect: { id: Number(body.gostId) } },
      },
    });
    return NextResponse.json(azurirano);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Rezervacija nije nađena ili nisu dobri podaci' }, { status: 404 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    await prisma.rezervacija.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Obrisana' });
  } catch {
    return NextResponse.json({ error: 'Nije nađena' }, { status: 404 });
  }
}
