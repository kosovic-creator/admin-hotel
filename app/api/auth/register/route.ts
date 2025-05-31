import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email i lozinka su obavezni." }, { status: 400 });
  }

  const existingUser = await prisma.korisnik.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Korisnik već postoji." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.korisnik.create({
    data: { email, password: hashedPassword },
  });

  return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 201 });
}
