import { z } from "zod";

const Role = z.enum(["USER", "ADMIN"]);

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: Role,
});

export type User = z.infer<typeof UserSchema>;
