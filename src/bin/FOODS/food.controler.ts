import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/config";
import { FoodRequest } from "./food.model";
import { FoodService } from "./food.service";

export class FoodControler {

    static async GetFood (req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const Request: FoodRequest  = req.body as FoodRequest
            const response = await FoodService.getFood(Request, req.id!)
            res.status(200).json({success: true, data: response})
        } catch (e) {
            next(e)
        }
    } 

}