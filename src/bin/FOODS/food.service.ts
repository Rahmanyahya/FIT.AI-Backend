import logger from "../../config/logger";
import prisma from "../../config/prisma";
import { ErrorHandler } from "../../Error/ErrorHandler";
import { startOfDay, endOfDay } from 'date-fns'
import { decryptor } from "../../utils/kriptografi";
import { Food } from "./food.model";
import axios from "axios";


export class FoodService {

    static async getFood(id: string) {
        const userId = decryptor(id)
      
        const data = await prisma.nutritionPlan.findFirst({
          where: {
            userId: userId
          }
        })
      
        if (!data) {
          logger.error("Get User", "User not found", "User")
          throw new ErrorHandler(404, 'User not found')
        }
      
        /** NOTE 
         * Request To Machine Learning
         */
        const responseMl: any = await axios.post('http://localhost:4000/api/v1/recommendations', {
          userid: data.userId,
          calories: data.dailyCalories,
          fat: data.dailyFatin,
          proteins: data.dailyProtein,
          carbohydrate: data.dailyCarbs
        })
      
        if (!responseMl.data.success) {
          logger.error('AI', 'Failed fetch data from ai', 'Get Food')
          throw new ErrorHandler(400, 'Please try again')
        }
      
        const todayStart = startOfDay(new Date())
        const todayEnd = endOfDay(new Date())
      
        const dailyRecordCount = await prisma.dailyRecordConsuming.count({
          where: {
            userId: data.userId,
            createdAt: {
              gte: todayStart,
              lte: todayEnd
            }
          }
        })
      
        if (dailyRecordCount !== 0) {
          logger.info('Daily Record', 'You cannot request double food at the same day', 'Daily Record')
          throw new ErrorHandler(400, 'You cannot request double food at the same day')
        }
      
        const newDailyRecord = await prisma.dailyRecordConsuming.create({
          data: {
            userId: data.userId,
          }
        })
      
        let foods: Food[] = responseMl.data.data.data
      
        if (foods.length === 0) throw new ErrorHandler(500, 'Machine Learning Server Error')
      
        logger.info('Food', 'success get food from machine learning', 'Food')
      
        for (const item of foods) {
            await prisma.foodConsumption.create({
              data: {
                dailyRecord: newDailyRecord.id,
                userId: data.userId,
                name: item.food.name,
                protein: isNaN(item.food.proteins) ? 0 : item.food.proteins,
                calories: isNaN(item.food.calories) ? 0 : item.food.calories,
                carbs: isNaN(item.food.carbo) ? 0 : item.food.carbo,
                fat: isNaN(item.food.fat) ? 0 : item.food.fat,
                foodType: item.type,
                status: false,
              }
            });
          }
          
          
        logger.info('Food', 'success save food into db', 'Food')
      
        return foods.map((item) => ({
          name: item.food.name,
          type: item.type,
          calories: item.food.calories,
          carbohydrates: item.food.carbo,
          protein: item.food.proteins,
          fat: item.food.fat
        }))
      }

}