import { z } from "zod";

export const RegisterUserSchema = z.object({
  username: z.string().min(4, "4 caratères minimum !"),
  email: z.string().email("Email invalide !"),
  password: z.string().min(6, " 6 caractères minimum !"),
});

export type RegisterUser = z.infer<typeof RegisterUserSchema>;
