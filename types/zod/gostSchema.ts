import { z } from "zod";


export const gostSchema = z.object({
  id: z.number().int().optional(), // ili .optional() ako se koristi za unos
  email: z.string().email(),
  ime: z.string().min(2, 'Ime je obavezo polje i mora imati najmanje 2 karaktera').nullable().optional(),
  prezime: z.string().min(2, 'Prezime je obavezo polje i mora imati najmanje 2 karaktera').nullable().optional(),
  // rezervacije: z.array(z.any()).optional() // ako treba, može se dodati kasnije
});
