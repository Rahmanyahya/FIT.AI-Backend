import { DailyRecordConsuming } from "@prisma/client";
import { Food } from "../FOODS/food.model";
import prisma from "../../config/prisma";

export interface FoodRecordRequest {
    personalId: string;
    foodId: string;
}

export interface getRecord {
    start: Date
    end: Date;
}

export interface RecordResponse {
    proteinConsumtion: number
    carbohydrateConsumption: number
    fatConsumption: number
    caloriesConsumption: number
    foods: Food[]
}

export async function toFoodRecordResponse (record: DailyRecordConsuming): Promise<RecordResponse> {
    const foods = await prisma.foodConsumption.findMany({where: {dailyRecord: record.id}})
    return {
        proteinConsumtion: record.totalProte,
        carbohydrateConsumption: record.totalCarbs,
        fatConsumption: record.totalFatin,
        caloriesConsumption: record.totalCalories,
        foods: foods.map((item) => ({
            name: item.name,
            type: item.foodType,
            calories: item.calories,
            protein: item.protein,
            carbohydrates: item.carbs,
            fat: item.fat
        }))
    }
} 

