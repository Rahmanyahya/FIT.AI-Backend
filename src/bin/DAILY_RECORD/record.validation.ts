import {z, ZodType} from "zod"

export class RECORD_VALIDATION {
    static readonly FOOD_RECORD_REQUEST: ZodType = z.object({
        foodId: z.string().uuid(),
        personalId: z.string()
    })

    static readonly GET_FOOD_REQUEST: ZodType = z.object({
        start: z.date(),
        end: z.date()
    })
}