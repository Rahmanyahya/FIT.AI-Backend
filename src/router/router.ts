import express from "express";
import { UserController } from "../bin/USER/user.controller";
import { jwtService } from "../helper/jwt";
import { ProfileController } from "../bin/PROFILE/profile.controller";
import { NutritionController } from "../bin/NUTRITION/nutrition.controller";
import { RecordController } from "../bin/DAILY_RECORD/record.controller";
import { FoodControler } from "../bin/FOODS/food.controler";
export const Router = express.Router();
const BaseUrl = "/api/v1/fitai";

// Tes Api
Router.get(`${BaseUrl}`, (req, res) => {
  res.json({ message: "Server is runing" });
});

/**
 * API FOR USER MODULE
 */

// Login
Router.post(`${BaseUrl}/login`, UserController.Login);

// Register
Router.post(`${BaseUrl}/register`, UserController.Register);

// Edit
Router.put(`${BaseUrl}/user`, jwtService.verifyToken, UserController.Update);

// Delete
Router.delete(`${BaseUrl}/user`, jwtService.verifyToken, UserController.Delete);

// Get personal information
Router.get(
  `${BaseUrl}/user/me`,
  jwtService.verifyToken,
  UserController.GetProfile
);

/**
 * API FOR PROFILE MODULE
 */

// Create profile
Router.post(
  `${BaseUrl}/profile`,
  jwtService.verifyToken,
  ProfileController.createProfile
);

// Get profile
Router.get(
  `${BaseUrl}/profile`,
  jwtService.verifyToken,
  ProfileController.getProfile
);

// Update profile
Router.put(
  `${BaseUrl}/profile`,
  jwtService.verifyToken,
  ProfileController.updateProfile
);

/**
 * API FOR NUTRITION PLAN
 */

// Get Plan
Router.get(
  `${BaseUrl}/nutrition/me`,
  jwtService.verifyToken,
  NutritionController.getNutrition
);


/**
 * API FOR RECORD
 */

// Get record / history
Router.get(`${BaseUrl}/record/me/`, jwtService.verifyToken, RecordController.GetRecord)

// Add Food To Record
Router.put(`${BaseUrl}/record`, jwtService.verifyToken, RecordController.Record)

// Remove Food From Record
Router.put(`${BaseUrl}/record`, jwtService.verifyToken, RecordController.UnRecord)

/**
 * API FOR GET FOODS
 */

// Get daily food
Router.get(`${BaseUrl}/dailyfood`, jwtService.verifyToken, FoodControler.GetFood)


