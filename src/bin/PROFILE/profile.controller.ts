import { Response, NextFunction } from "express";
import { ProfileService } from "./profile.service";
import { CustomRequest } from "../../config/config";
import { createProfile, updateProfile } from "./profile.model";

export class ProfileController {
  static async createProfile(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: createProfile = req.body as createProfile;
      const response = await ProfileService.createProfile(request, req.id!);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await ProfileService.getProfile(req.id!);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: updateProfile = req.body as updateProfile;
      const response = await ProfileService.updateProfile(request, req.id!);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  
}
