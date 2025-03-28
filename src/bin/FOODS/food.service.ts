import logger from "../../config/logger";
import prisma from "../../config/prisma";
import { ErrorHandler } from "../../Error/ErrorHandler";
import { GlobalEnv } from "../../helper/GlobalEnv";
import { Validation } from "../../validator/validation";
import { Food, FoodRequest } from "./food.model";
import { FoodValidation } from "./food.validation";

export class FoodService {

    static async getFood (req: FoodRequest, id: string): Promise<Food[]> {
        const userRequest = Validation.validate(FoodValidation.foodRequest, req);

        /** NOTE 
         * Request To Machine Learning
         * */ 
        const responseMl: any = await fetch(`${GlobalEnv.LLM_URL}/api/v1/fitapi/recomendationFoods`,
            {
                method: "GET",
                body: JSON.stringify({
                    calories: userRequest.dailyCalories,
                    fat: userRequest.dailyFat,
                    proteins: userRequest.dailyProtein,
                    carbohydrate: userRequest.dailyCarbohydrate
                })
            }
        ) || []


        const dailyRecord = await prisma.dailyRecordConsuming.findFirst({
          where: {
            AND: {
                userId: id,
                createdAt: new Date()
            }
          }
        })

        const foods: Food[]  = responseMl.data

        if (foods.length === 0) throw new ErrorHandler(500, 'Machine Learning Server Error')

            logger.info('Food', 'sucess get food from machine learning', 'Food')

        foods.forEach(async (item) => (
            await prisma.foodConsumption.create({
                data: {
                   dailyRecord: dailyRecord!.id,
                   protein: item.protein,
                   calories: item.calories,
                   carbs: item.carbohydrates,
                   fat: item.fat,
                   userId: id,
                   status: false,
                   foodType: item.type,
                   name: item.name
                }
            })
        ))

        logger.info('Food', 'sucess save food into db', 'Food')

        return foods.map((item) => ({
          name: item.name,
          type: item.type,
          calories: item.calories,
          carbohydrates: item.carbohydrates,
          protein: item.protein,
          fat: item.fat
        }))

    } 

}