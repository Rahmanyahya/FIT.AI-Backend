import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/config";
import { NutritionService } from "./nutrition.service";

export class NutritionController {

    static async getNutrition (req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await NutritionService.getNutritionPlan(req.id!);
            res.status(200).json({ success: true, data: response });
        } catch (e) {
            next(e)
        }
    }
    
}