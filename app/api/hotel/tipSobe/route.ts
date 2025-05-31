import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// CREATE
export async function POST(request: NextRequest) {
  const body = await request.json();
  const noviTip = await prisma.tipSobe.create({
    data: body,
  });
  return NextResponse.json(noviTip);
}

// READ
export async function GET() {
  const soba = await prisma.tipSobe.findMany();
  return NextResponse.json(soba);
}
