import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { GlobalEnv } from "../../global";
import { NextFunction, Request } from "express";

export class jwtService {
  static generateToken(user: User): string {
    return jwt.sign(user.name, GlobalEnv.JWT_SECRET || "", {
      expiresIn: "24h"
    });
  }
  static verifyToken(req: Request, next: NextFunction): void {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) throw new Error("Not Allowed");

    const isVerifed = jwt.verify(token, GlobalEnv.JWT_SECRET || "");

    if (!isVerifed) throw new Error("Not Authenticated");

    return next();
  }
}
