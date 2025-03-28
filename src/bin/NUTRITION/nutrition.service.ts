import { Gender, Profile } from "@prisma/client";
import { ErrorHandler } from "../../Error/ErrorHandler";
import { decryptor } from "../../utils/kriptografi";
import prisma from "../../config/prisma";
import logger from "../../config/logger";
import { nutritionResponse, toNutritionResponse } from "./nutrition.model";

export class NutritionService {
    static async createDailyIntake(
      user: Profile
    ): Promise<void> {
        const ctx = "Nutrition Plan"
        const scp = "nutritionPlan";

        let BMR;
        if (user.gender === Gender.MALE) {
          BMR = 10 * user.currentWeight + 6.25 * user.height - 5 * user.age + 5;
        } else {
          BMR = 10 * user.currentWeight + 6.25 * user.height - 5 * user.age - 161;
        }
    
        // Total Daily Energy Expenditure (TDEE)
        const TDEE = BMR * user.activityLevel;
    
        // Hitung surplus atau defisit berdasarkan target weight
        const weightChange = user.goalWeight! - user.currentWeight;
        const calorieAdjustment = (weightChange * 7700) / 30; // Total kcal untuk target weight dalam 30 hari
    
        const dailyCalories = TDEE + calorieAdjustment;

        const protein = (dailyCalories * 0.3) / 4; // 30% dari kalori untuk protein (1g = 4 kcal)
        const carbs = (dailyCalories * 0.5) / 4; // 50% dari kalori untuk karbohidrat (1g = 4 kcal)
        const fats = (dailyCalories * 0.2) / 9; // 20% dari kalori untuk lemak (1g = 9 kcal)

        await prisma.nutritionPlan.create({
            data: {
                userId: user.userId,
                dailyProtein: Math.round(protein),
                dailyCarbs: Math.round(carbs),
                dailyFatin: Math.round(fats),
                dailyCalories: Math.round(dailyCalories)
            }
        })

        logger.warn(ctx, 'Create Dailt Plan', scp)

    }

    static async updateDailyIntake(
      user: Profile
    ): Promise<void> {
        const ctx = "Nutrition Plan"
        const scp = "nutritionPlan";

        let BMR;
        if (user.gender === Gender.MALE) {
          BMR = 10 * user.currentWeight + 6.25 * user.height - 5 * user.age + 5;
        } else {
          BMR = 10 * user.currentWeight + 6.25 * user.height - 5 * user.age - 161;
        }
    
        // Total Daily Energy Expenditure (TDEE)
        const TDEE = BMR * user.activityLevel;
    
        // Hitung surplus atau defisit berdasarkan target weight
        const weightChange = user.goalWeight! - user.currentWeight;
        const calorieAdjustment = (weightChange * 7700) / 30; // Total kcal untuk target weight dalam 30 hari
    
        const dailyCalories = TDEE + calorieAdjustment;

        const protein = (dailyCalories * 0.3) / 4; // 30% dari kalori untuk protein (1g = 4 kcal)
        const carbs = (dailyCalories * 0.5) / 4; // 50% dari kalori untuk karbohidrat (1g = 4 kcal)
        const fats = (dailyCalories * 0.2) / 9; // 20% dari kalori untuk lemak (1g = 9 kcal)

        await prisma.nutritionPlan.update({
          where: { userId: user.userId },
            data: {
              userId: user.userId,
              dailyProtein: Math.round(protein),
              dailyCarbs: Math.round(carbs),
              dailyFatin: Math.round(fats),
              dailyCalories: Math.round(dailyCalories)
            }
        })

        logger.warn(ctx, 'Update Daily Plan', scp)

    }
  
    static async getNutritionPlan(personalId: string): Promise<nutritionResponse> {
        const ctx = "Get Nutrition";
        const scp = "Nutrition Plan";

      const nutrition = await prisma.nutritionPlan.findUnique({
        where: { userId: decryptor(personalId) }
      });
  
      if (!nutrition) {
        logger.warn(ctx, "Your plan does not exist", scp);
        throw new ErrorHandler(404, "Plan does not exist");
      }
  
      return toNutritionResponse(nutrition)
    }
  }
  