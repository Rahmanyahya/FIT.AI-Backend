import { NextFunction, Request, Response } from "express";
import {
  registerUser,
  updateUser,
  userLogin,
} from "./user.model";
import { UserService } from "./user.service";

export class UserController {
  static async Register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userRequest: registerUser = req.body as registerUser;

      const response = await UserService.userRegister(userRequest);

      res.status(200).json({ success: true, data: response });
    } catch (e) {
      next(e);
    }
  }

  static async Login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userRequest: userLogin = req.body as userLogin;

      const response = await UserService.userLogin(userRequest);

      res.status(200).json({ success: true, data: response });
    } catch (e) {
      next(e);
    }
  }

  static async Update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: number = parseInt(req.params.id);

      const userRequest: updateUser = req.body as updateUser;

      const response = await UserService.updateUser(userRequest, userId);

      res.status(200).json({ success: true, data: response });
    } catch (e) {
      next(e);
    }
  }

  static async Delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id: number = parseInt(req.params.id);

      const response = await UserService.deleteUser({ id });

      res.status(200).json({ success: true, data: response });
    } catch (e) {
      next(e);
    }
  }
}
