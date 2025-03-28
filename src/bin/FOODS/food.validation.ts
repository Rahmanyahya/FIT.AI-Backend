import { ZodType, z } from "zod";

export class FoodValidation {

    static readonly foodRequest: ZodType = z.object({
        dailyProtein: z.number(),
        dailyCarbohydrate: z.number(),
        dailyCalories: z.number(),
        dailyFat: z.number()
    })

}