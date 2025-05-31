import type { Gost } from './gosti';

export type Rezervacija = {
  id: number;
  soba: { id: number, sobaBroj: number, status: string, tipSobe: { ime: string, cijena: number, kapacitet: number } };
  gost: Gost;
  pocetak: string;
  kraj: string;
  brojNocenja: number;
  ukupno: number;
};