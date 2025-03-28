import prisma from "../../config/prisma";
import logger from "../../config/logger";
import { Validation } from "../../validator/validation";
import { ProfileValidation } from "./profile.validation";
import {
  createProfile,
  updateProfile,
  toProfileResponse,
  profileResponse
} from "./profile.model";
import { decryptor } from "../../utils/kriptografi";
import { ErrorHandler } from "../../Error/ErrorHandler";
import { Goal } from "@prisma/client";
import { NutritionService } from "../NUTRITION/nutrition.service";

export class ProfileService {
  static isIdeal(goalWeight: number, currentWeight: number, height: number, months: number = 1): boolean {
    const heightInMeters = height / 100;
    const minIdealWeight = Math.round(18.5 * heightInMeters ** 2);
    const maxIdealWeight = Math.round(24.9 * heightInMeters ** 2);

    // Batas perubahan berat badan yang aman per bulan
    const maxSafeWeightChangePerMonth = 5; 
    const totalAllowedChange = maxSafeWeightChangePerMonth * months;

    const weightDifference = Math.abs(goalWeight - currentWeight);

    return (
      goalWeight >= minIdealWeight &&
      goalWeight <= maxIdealWeight &&
      weightDifference <= totalAllowedChange
    );
  }

  static async createProfile(req: createProfile, personalId: string): Promise<profileResponse> {
    const ctx = "Profile Creation";
    const scp = "Profile";

    const profileRequest = Validation.validate(ProfileValidation.CREATE_PROFILE, req);

    const isExist = await prisma.profile.findFirst({
      where: { userId: decryptor(personalId) }
    });

    if (isExist) {
      logger.warn(ctx, "Profile already exists", scp);
      throw new ErrorHandler(401, "Profile already exists");
    }

    if (!profileRequest.goalWeight || profileRequest.goalWeight === 0) {
      profileRequest.goalWeight = profileRequest.currentWeight;
      profileRequest.goal = Goal.MAINTENANCE;
    } else {
      const months = 1; 
      const isIdeal = this.isIdeal(profileRequest.goalWeight, profileRequest.currentWeight, profileRequest.height, months);

      if (!isIdeal) {
        logger.warn(ctx, "Not Ideal weight for goal", scp);
        throw new ErrorHandler(400, "Target berat badan tidak realistis dalam waktu yang diberikan");
      }

      profileRequest.goal = profileRequest.goalWeight > profileRequest.currentWeight ? Goal.WEIGHT_GAIN : Goal.WEIGHT_LOSS;
    }

    const profile = await prisma.profile.create({
      data: {
        userId: decryptor(personalId),
        age: profileRequest.age,
        gender: profileRequest.gender,
        height: profileRequest.height,
        currentWeight: profileRequest.currentWeight,
        goalWeight: profileRequest.goalWeight,
        activityLevel: profileRequest.activityLevel,
        goal: profileRequest.goal
      }
    });

    await NutritionService.createDailyIntake(profile)

    logger.info(ctx, "Profile Created", scp);
    return toProfileResponse(profile);
  }

  static async updateProfile(req: updateProfile, personalId: string): Promise<profileResponse> {
    const ctx = "Profile Update";
    const scp = "Profile";

    const profileRequest = Validation.validate(ProfileValidation.CREATE_PROFILE, req);

    const isExist = await prisma.profile.findUnique({
      where: { userId: decryptor(personalId) }
    });

    if (!isExist) {
      logger.warn(ctx, "Profile does not exist", scp);
      throw new ErrorHandler(404, "Profile does not exist");
    }

    profileRequest.goalWeight ??= isExist.goalWeight!;
    profileRequest.activityLevel ??= isExist.activityLevel;
    profileRequest.age ??= isExist.age;
    profileRequest.gender ??= isExist.gender;
    profileRequest.height ??= isExist.height;
    profileRequest.currentWeight ??= isExist.currentWeight;

    if (profileRequest.goalWeight === profileRequest.currentWeight) {
      profileRequest.goal = Goal.MAINTENANCE;
    } else {
      const months = 1;
      const isIdeal = this.isIdeal(profileRequest.goalWeight, profileRequest.currentWeight, profileRequest.height, months);

      if (!isIdeal) {
        logger.warn(ctx, "Not Ideal weight for goal", scp);
        throw new ErrorHandler(400, "Target berat badan tidak realistis dalam waktu yang diberikan");
      }

      profileRequest.goal = profileRequest.goalWeight > profileRequest.currentWeight ? Goal.WEIGHT_GAIN : Goal.WEIGHT_LOSS;
    }

    const profile = await prisma.profile.update({
      where: { userId: decryptor(personalId) },
      data: {
        age: profileRequest.age,
        gender: profileRequest.gender,
        height: profileRequest.height,
        currentWeight: profileRequest.currentWeight,
        goalWeight: profileRequest.goalWeight,
        activityLevel: profileRequest.activityLevel,
        goal: profileRequest.goal
      }
    });

    await NutritionService.updateDailyIntake(profile);

    logger.info(ctx, "Profile Updated", scp);
    return toProfileResponse(profile);
  }

  static async getProfile(personalId: string): Promise<profileResponse> {
    const ctx = "Get Profile";
    const scp = "Profile";

    const profileUser = await prisma.profile.findUnique({
      where: { userId: decryptor(personalId) }
    });

    if (!profileUser) {
      logger.warn(ctx, "Profile is not exist", scp);
      throw new ErrorHandler(404, "Profile is not exist");
    }

    return toProfileResponse(profileUser);
  }
}
