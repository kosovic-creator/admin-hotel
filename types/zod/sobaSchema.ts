import { z } from "zod";
export const sobaSchema = z.object({
  id: z.number().int().optional(), // optional ako se koristi za kreiranje
  status: z.string(),
  sobaBroj: z.number(),
  slike: z.array(z.string()),
  // rezervacije: ovde možeš staviti z.array(z.object({...})) ako želiš validaciju i za rezervacije
});