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
    const gosti = await prisma.gost.findUnique({
      where: { id: Number(id) },
    });
    if (!gosti) return NextResponse.json({ error: 'Nije nađen Gost' }, { status: 404 });
    return NextResponse.json(gosti);
  } catch {
    return NextResponse.json({ error: 'Neispravan ID' }, { status: 400 });
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    const body = await request.json();
    const azurirano = await prisma.gost.update({
      where: { id: Number(id) },
      data: body,
    });
    return NextResponse.json(azurirano);
  } catch {
    return NextResponse.json({ error: 'Soba nije nađena ili nisu dobri podaci' }, { status: 404 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    await prisma.gost.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Obrisana' });
  } catch {
    return NextResponse.json({ error: 'Nije nađena' }, { status: 404 });
  }
}
