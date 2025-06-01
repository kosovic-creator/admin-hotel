import { z } from "zod";
export const tipoviSobaSchema = z.object({
  id: z.number().int().optional(),
  ime: z.string().min(2, 'Tip sobe je obavezo polje i mora imati najmanje 2 karaktera').nullable().optional(),
  kapacitet: z.number().min(1, 'Kapacitet sobe  je obavezo polje i mora biti veći od 0').int().nullable().optional(),
  cijena: z.number().min(1, 'Cijena je obavezno polje i mora biti veća od 1').int().nullable().optional(),

});