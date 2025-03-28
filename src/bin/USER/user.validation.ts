import { ZodType, z } from "zod";

export class UserValidation {
  static readonly REGISTER_USER: ZodType = z.object({
    name: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(20)
  });

  static readonly UPDATE_USER: ZodType = z.object({
    name: z.string().min(3).max(20).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).max(20).optional()
  });

  static readonly LOGIN_USER: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20)
  });

  static readonly DELETE_USER: ZodType = z.object({
    id: z.string()
  });
}
