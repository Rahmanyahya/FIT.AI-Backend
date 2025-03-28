import { FoodType } from "@prisma/client";

export interface Food {
  name: string;
  type: FoodType;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface FoodRequest {
  dailyProtein: number;
  dailyCarbohydrate: number;
  dailyCalories: number;
  dailyFat: number;
}
