import { NextFunction, Response } from "express";
import { registerUser, updateUser, userLogin } from "./user.model";
import { UserService } from "./user.service";
import { CustomRequest } from "../../config/config";

export class UserController {
  static async Register(
    req: CustomRequest,
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
    req: CustomRequest,
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

  static async GetProfile(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await UserService.getProfile({ id: req.id! });

      res.status(200).json({ success: true, data: response });
    } catch (e) {
      next(e);
    }
  }

  static async Update(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userRequest: updateUser = req.body as updateUser;

      const response = await UserService.updateUser(userRequest, req.id!);

      res.status(200).json({ success: true, data: response });
    } catch (e) {
      next(e);
    }
  }

  static async Delete(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id: string = req.params.id;

      const response = await UserService.deleteUser({ id: req.id! });

      res.status(200).json({ success: true, data: response });
    } catch (e) {
      next(e);
    }
  }
}
