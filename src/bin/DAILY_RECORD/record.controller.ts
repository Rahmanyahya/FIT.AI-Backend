import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/config";
import { FoodRecordRequest, getRecord } from "./record.model";
import { RecordService } from "./record.service";

export class RecordController {
    static async Record(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const foodId = req.params.foodId
            const request: FoodRecordRequest = { personalId: req.id!, foodId };
            const response = await RecordService.RecordFood(request);
            res.status(201).json({ success: true, data: response });
        } catch (e) {
            next(e)
        }
    }

    static async UnRecord(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const foodId = req.params.foodId
            const request: FoodRecordRequest = { personalId: req.id!, foodId };
            const response = await RecordService.UnRecordFood(request);
            res.status(200).json({ success: true, data: response });
            } catch (e) {
            next(e)
            }
    }

    static async GetRecord(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
           const {start, end} = req.query;
           const request: getRecord = { start: new Date(start as string), end: new Date(end as string) };
           const response = await RecordService.GetFoodRecord(request, req.id!);
           res.status(200).json({ success: true, data: response });
        } catch (e) {
            next(e)
        }
    }
}