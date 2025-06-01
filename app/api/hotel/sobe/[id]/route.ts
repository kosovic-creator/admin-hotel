import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function getIdFromRequest(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // poslednji segment je id
  if (!id) throw new Error('ID id parametar nije nađen');
  return id;
}
// READ ONE
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    const soba = await prisma.soba.findUnique({
      where: { id: Number(id) },
      include: {
        tipSobe: true, // ovo je ispravno prema tvojoj šemi
      },
    });
    if (!soba) return NextResponse.json({ error: 'Nije nađen' }, { status: 404 });
    return NextResponse.json(soba);
  } catch {
    return NextResponse.json({ error: 'Neispravan ID' }, { status: 400 });
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    const body = await request.json();
    console.log('ID:', id);
    console.log('Body:', body);
    const azurirano = await prisma.soba.update({
      where: { id: Number(id) },
      data: body,
    });
    return NextResponse.json(azurirano);
  } catch (e) {
    console.error(e); // Dodaj ovo za detaljnu grešku
    return NextResponse.json({ error: 'Soba nije nađena ili nisu dobri podaci' }, { status: 404 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    console.log('ID iz URL-a:', id, 'Tip:', typeof id);
    const brojId = Number(id);
    if (isNaN(brojId)) {
      return NextResponse.json({ error: 'ID nije broj' }, { status: 400 });
    }
    const soba = await prisma.soba.findUnique({
      where: { id: brojId },
    });
    console.log('Pronađena soba:', soba);
    if (!soba) {
      return NextResponse.json({ error: 'Nije nađena' }, { status: 404 });
    }
    await prisma.soba.delete({
      where: { id: brojId },
    });
    return NextResponse.json({ message: 'Obrisana' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Soba ne može biti obrisana dok postoje rezervacije za nju.' }, { status: 404 });
  }
}
