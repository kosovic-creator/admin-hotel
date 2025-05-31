import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// CREATE
export async function POST(request: NextRequest) {
  const body = await request.json();
  const noviGost = await prisma.gost.create({
    data: body,
  });
  return NextResponse.json(noviGost);
}

// READ (svi todo)
export async function GET() {
  const gosti = await prisma.gost.findMany();
  return NextResponse.json(gosti);
}