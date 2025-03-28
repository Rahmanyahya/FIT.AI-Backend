import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GlobalEnv } from "./GlobalEnv";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../config/config";
import { ErrorHandler } from "../Error/ErrorHandler";

export class jwtService {
  static generateToken(user: User): string {
    return jwt.sign({ id: user.id }, GlobalEnv.JWT_SECRET!, {
      expiresIn: "30d"
    });
  }
  static verifyToken(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): void {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) throw new ErrorHandler(403, "Not Allowed");

    jwt.verify(
      token,
      GlobalEnv.JWT_SECRET || "",
      (
        err: jwt.VerifyErrors | null,
        decode: JwtPayload | undefined | string
      ) => {
        if (err || !decode || typeof decode === "string") {
          throw new ErrorHandler(403, "Not Authenticated");
        }

        req.id = decode.id;

        next();
      }
    );
  }

  static isActive(token: string): boolean{
      const isActive = jwt.verify(token, GlobalEnv.JWT_SECRET || "")
      return !isActive? false : true
  }
}
