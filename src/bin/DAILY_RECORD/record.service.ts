import logger from "../../config/logger";
import prisma from "../../config/prisma";
import { ErrorHandler } from "../../Error/ErrorHandler";
import { decryptor } from "../../utils/kriptografi";
import { Validation } from "../../validator/validation";
import { FoodRecordRequest, getRecord, RecordResponse, toFoodRecordResponse } from "./record.model";
import { RECORD_VALIDATION } from "./record.validation";

export class RecordService {
    static async RecordFood (req: FoodRecordRequest): Promise<RecordResponse> {
    const ctx = "Record Food";
    const scp = "Record Food";
    const userRequest = Validation.validate(RECORD_VALIDATION.FOOD_RECORD_REQUEST, req);
    const userId = decryptor(userRequest.personalId);

    let dailyRecord = await prisma.dailyRecordConsuming.findFirst({
        where: {
            userId,
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),  
                lt: new Date(new Date().setHours(23, 59, 59, 999)) 
            }
        }
    });

    if (!dailyRecord) {
       dailyRecord = await prisma.dailyRecordConsuming.create({
            data: {
                userId,
            }
        });
    }

    const food = await prisma.foodConsumption.findUnique({
        where: {
            id: userRequest.foodId
        }
    });

    if (!food) {
        logger.warn(ctx, "Food not found", scp);
        throw new Error("Food not found");
    }

    await prisma.foodConsumption.update({
        where: { id: userRequest.foodId },
        data: {
            dailyRecord: dailyRecord.id, 
            status: true 
        }
    });

    dailyRecord = await prisma.dailyRecordConsuming.update({
        where: { id: dailyRecord.id },
        data: {
            totalCalories: { increment: food.calories },
            totalProte: { increment: food.protein },
            totalCarbs: { increment: food.carbs },
            totalFatin: { increment: food.fat }
        }
    });

    logger.info(ctx, "Record Food Success", scp);
    return toFoodRecordResponse(dailyRecord);
}

static async UnRecordFood (req: FoodRecordRequest): Promise<RecordResponse> {
    const ctx = "Un-Record Food";
    const scp = "Record Food";
    const userRequest = Validation.validate(RECORD_VALIDATION.FOOD_RECORD_REQUEST, req);
    const userId = decryptor(userRequest.personalId);

    let dailyRecord = await prisma.dailyRecordConsuming.findFirst({
        where: {
            userId,
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),  
                lt: new Date(new Date().setHours(23, 59, 59, 999)) 
            }
        }
    });

    if (!dailyRecord) {
      logger.warn(ctx, "No record found", scp);
      throw new ErrorHandler(404, 'no record matches')
    }

    const food = await prisma.foodConsumption.findFirst({
        where: {
          AND: {
            id: userRequest.foodId,
            userId,
          }
        }
    });

    if (!food) {
        logger.warn(ctx, "Food not found", scp);
        throw new Error("Food not found");
    }

    await prisma.foodConsumption.update({
        where: { id: food.id },
        data: {
            dailyRecord: null, 
            status: false 
        }
    });

    dailyRecord = await prisma.dailyRecordConsuming.update({
        where: { id: dailyRecord.id },
        data: {
            totalCalories: { decrement: food.calories },
            totalProte: { decrement: food.protein },
            totalCarbs: { decrement: food.carbs },
            totalFatin: { decrement: food.fat }
        }
    });

    logger.info(ctx, "Record Food Success", scp);
    return toFoodRecordResponse(dailyRecord);
}

static async GetFoodRecord (req: getRecord, personalId: string): Promise<RecordResponse[]> {
    const ctx = "Get Food Record";
    const scp = "Record Food";
    
    const userRequest = Validation.validate(RECORD_VALIDATION.GET_FOOD_REQUEST, req);

    const userId = decryptor(personalId);
    let dailyRecords = await prisma.dailyRecordConsuming.findMany({
        where: {
            userId,
            createdAt: {
                gte: new Date(userRequest.start),
                lt: new Date(userRequest.end)
            }
        },
        include: {
            foods: true
        }
    });

    if (!dailyRecords.length) {
        logger.warn(ctx, "No record found", scp);
        throw new ErrorHandler(404, 'no record matches')
    }

    logger.info(ctx, "Get Food Record Success", scp);
    return Promise.all(dailyRecords.map(toFoodRecordResponse))
}

}