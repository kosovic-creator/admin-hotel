import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// CREATE
export async function POST(request: NextRequest) {
  const body = await request.json();
  const novaSoba = await prisma.soba.create({
    data: body,
  });
  return NextResponse.json(novaSoba);
}

// READ
export async function GET() {
  const soba = await prisma.soba.findMany({
    include: {
      tipSobe: true, 
    },
  });
  return NextResponse.json(soba);
}
