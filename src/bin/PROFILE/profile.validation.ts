import { Goal } from "@prisma/client";
import { ZodType, z } from "zod";

export class ProfileValidation {
  static readonly CREATE_PROFILE: ZodType = z.object({
    age: z.number().min(1).max(120),
    gender: z.enum(["MALE", "FEMALE"]),
    height: z.number().min(50).max(250), // in cm
    currentWeight: z.number().min(1).max(300), // in kg
    goalWeight: z.number().min(1).max(300).optional(), // optional
    activityLevel: z.number().min(1).max(4), // 1-4 (sedentary to very active)
    goal: z.enum([Goal.MAINTENANCE, Goal.WEIGHT_GAIN, Goal.WEIGHT_LOSS])
  });

  static readonly UPDATE_PROFILE: ZodType = z.object({
    id: z.string().uuid(),
    age: z.number().min(1).max(120).optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    height: z.number().min(50).max(250).optional(),
    currentWeight: z.number().min(1).max(300).optional(),
    goalWeight: z.number().min(1).max(300).optional(),
    activityLevel: z.number().min(1).max(4).optional(),
    goal: z
      .enum([Goal.MAINTENANCE, Goal.WEIGHT_GAIN, Goal.WEIGHT_LOSS])
      .optional()
  });

  static readonly DELETE_PROFILE: ZodType = z.object({
    profileId: z.string()
  });
}
