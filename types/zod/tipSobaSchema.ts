import { z } from "zod";
export const tipoviSobaSchema = z.object({
  id: z.number().int().optional(), // optional ako se koristi za kreiranje
  ime: z.string().min(2, 'Tip sobe je obavezo polje i mora imati najmanje 2 karaktera').nullable().optional(),
  kapacitet: z.number(),
  cijena: z.number(),
 
});