import { z } from "zod";
export const sobaSchema = z.object({
  id: z.number().int().optional(), // optional ako se koristi za kreiranje
  status: z.string(),
  opis: z.string().min(1, "Opis je obavezno polje"),
  sobaBroj: z.number().min(1, "Broj sobe je obavezno polje"),
  slike: z.array(z.string()),
  // rezervacije: ovde možeš staviti z.array(z.object({...})) ako želiš validaciju i za rezervacije
});