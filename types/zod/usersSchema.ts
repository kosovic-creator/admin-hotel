
import { z } from 'zod';
const usersSchema = z.object({

  email: z.string().min(1, 'Email je obavezo polje'),
  password: z.string().min(1, 'Pasword moraj imati najmanje 5 karaktera'),
  role: z.enum(["ADMIN", "USER"]).optional(),
});
type usersSchema = z.infer<typeof usersSchema>;

export default usersSchema;