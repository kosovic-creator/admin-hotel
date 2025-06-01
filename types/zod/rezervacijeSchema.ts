import { z } from "zod";

export const rezervacijaSchema = z.object({
  id: z.number().int().optional(), 
  pocetak: z.coerce.date(), // prihvata string ili Date
  kraj: z.coerce.date(),
  sobaId: z.number().int(),
  ime: z.string().min(1, "Ime je obavezno"),
  email: z.string().email("Neispravna email adresa").optional(),

});

export type Rezervacija = z.infer<typeof rezervacijaSchema>;