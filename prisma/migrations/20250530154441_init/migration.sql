-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "Gost" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "ime" TEXT,
    "prezime" TEXT,

    CONSTRAINT "Gost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipSobe" (
    "id" SERIAL NOT NULL,
    "kapacitet" INTEGER NOT NULL,
    "cijena" DOUBLE PRECISION NOT NULL,
    "ime" TEXT,

    CONSTRAINT "TipSobe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Soba" (
    "id" SERIAL NOT NULL,
    "sobaBroj" INTEGER NOT NULL,
    "tipSobeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "slike" TEXT[],

    CONSTRAINT "Soba_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rezervacija" (
    "id" SERIAL NOT NULL,
    "sobaId" INTEGER NOT NULL,
    "gostId" INTEGER,
    "pocetak" TIMESTAMP(3) NOT NULL,
    "kraj" TIMESTAMP(3) NOT NULL,
    "brojNocenja" INTEGER NOT NULL,
    "ukupno" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rezervacija_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Korisnik" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Korisnik_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gost_email_key" ON "Gost"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Korisnik_email_key" ON "Korisnik"("email");

-- AddForeignKey
ALTER TABLE "Soba" ADD CONSTRAINT "Soba_tipSobeId_fkey" FOREIGN KEY ("tipSobeId") REFERENCES "TipSobe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rezervacija" ADD CONSTRAINT "Rezervacija_sobaId_fkey" FOREIGN KEY ("sobaId") REFERENCES "Soba"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rezervacija" ADD CONSTRAINT "Rezervacija_gostId_fkey" FOREIGN KEY ("gostId") REFERENCES "Gost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
