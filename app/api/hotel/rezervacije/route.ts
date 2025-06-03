/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// CREATE
export async function POST(request: NextRequest) {
  const body = await request.json();
  let gostId = body.gostId;

  // Ako nije poslan gostId, ali je poslano ime gosta, kreiraj novog gosta
  if ((!gostId || isNaN(Number(gostId))) && body.ime) {
    const noviGost = await prisma.gost.create({
      data: {
        ime: body.ime,
        email: body.email || null,
      },
    });
    gostId = noviGost.id;
  }

  if (!gostId || isNaN(Number(gostId))) {
    return NextResponse.json({ greska: "Neispravan gostId ili ime nije poslano" }, { status: 400 });
  }

  // Provjera postoji li gost
  const gost = await prisma.gost.findUnique({
    where: { id: Number(gostId) }
  });
  if (!gost) {
    return NextResponse.json({ greska: "Gost ne postoji" }, { status: 400 });
  }

  const pocetak = new Date(body.pocetak);
  const kraj = new Date(body.kraj);

  // Razlika u milisekundama
  const diffMs = kraj.getTime() - pocetak.getTime();
  // Razlika u danima (zaokruženo na cijeli broj)
  const brojNocenja = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (brojNocenja <= 0) {
    return NextResponse.json({ greska: "Kraj rezervacije mora biti nakon početka" }, { status: 400 });
  }

  // Pronađi sobu i njen tip sobe
  const soba = await prisma.soba.findUnique({
    where: { id: Number(body.sobaId) },
    include: { tipSobe: true }
  });
  if (!soba || !soba.tipSobe) {
    return NextResponse.json({ greska: "Soba ili tip sobe ne postoji" }, { status: 400 });
  }

  const ukupno = brojNocenja * soba.tipSobe.cijena;

  const novaRezervacija = await prisma.rezervacija.create({
    data: {
      sobaId: Number(body.sobaId),
      gostId: Number(gostId),
      pocetak: body.pocetak,
      kraj: body.kraj,
      brojNocenja: brojNocenja,
      ukupno: ukupno ?? 0
    },
  });

  // Nakon što je rezervacija uspješna:
 const transporter = nodemailer.createTransport({
       service: "gmail", // ili npr. "hotmail", "zoho", itd.
       auth: {
         user: 'drasko.kosovic@gmail.com',
         pass: 'civc scwo svdb leup',
       },
     });

  await transporter.sendMail({
    // from: '"Hotel" <hotel@example.com>',
    // to: body.email,
    from: 'drasko.kosovic@gmail.com',
      to: body.email,
    subject: 'Potvrda rezervacije',
    text: `Poštovani ${body.ime}, vaša soba je uspješno rezervisana od ${body.pocetak} do ${body.kraj}.`,
  });

  return NextResponse.json(novaRezervacija);
}

// READ (svi todo)
export async function GET() {
  try {
    const rezervacije = await prisma.rezervacija.findMany({
      include: {
        soba: true,
        gost: {
          select: {
            id: true,
            ime: true,
            email: true
          }
        }
      }
    });
    return NextResponse.json(rezervacije);
  } catch (error) {
    return NextResponse.json(
      { greska: 'Greška pri dohvatu rezervacija' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
