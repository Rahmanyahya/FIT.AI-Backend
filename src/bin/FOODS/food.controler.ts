import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/config";
import { FoodService } from "./food.service";

export class FoodControler {

    static async GetFood (req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await FoodService.getFood(req.id!)
            res.status(200).json({success: true, data: response})
        } catch (e) {
            next(e)
        }
    } 

}