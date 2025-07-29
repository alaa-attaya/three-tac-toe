import { z } from "zod";

export const ProfileSchema = z.object({
  username: z.string().min(1),
});
