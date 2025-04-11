import { FoodType } from "@prisma/client";

export interface Food {
  type: FoodType
  food: foodDetail
}

export interface foodDetail {
  name: string,
  proteins: number,
  calories: number,
  fat: number,
  carbo: number,
  status: boolean
} 

