import express from "express";
import { UserController } from "../bin/USER/user.controller";

export const Router = express.Router();
const apiVersion = "/api/v1";

/**
 * API FOR USER MODULE
 */

// Login
Router.post(`${apiVersion}/login`, UserController.Login);

// Register
Router.post(`${apiVersion}/register`, UserController.Register);
