import { NutritionPlan } from "@prisma/client"

export interface nutritionResponse {
    dailyCarbohydrate: number
    dailyProtein: number
    dailyFat: number
    dailyCalories: number
}

export function toNutritionResponse (Nutrition: NutritionPlan):nutritionResponse {
    return {
        dailyCarbohydrate: Nutrition.dailyCarbs,
        dailyProtein: Nutrition.dailyProtein,
        dailyFat: Nutrition.dailyFatin,
        dailyCalories: Nutrition.dailyCalories
    }
}