import express from "express";
import { UserController } from "../bin/USER/user.controller";
import { jwtService } from "../helper/jwt";
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
Router.put(
  `${BaseUrl}/user/:id`,
  jwtService.verifyToken,
  UserController.Update
);

// Delete
Router.delete(
  `${BaseUrl}/user/:id`,
  jwtService.verifyToken,
  UserController.Delete
);

// Get Profile
Router.get(
  `${BaseUrl}/user/me/:id`,
  jwtService.verifyToken,
  UserController.getProfile
);
