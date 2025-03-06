import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { GlobalEnv } from "./GlobalEnv";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../config/config";

export class jwtService {
  static generateToken(user: User): string {
    return jwt.sign({id: user.id}, GlobalEnv.JWT_SECRET!, {expiresIn: '1d'});
  }
  static verifyToken(req: CustomRequest,res: Response, next: NextFunction): void { 
    
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) throw new Error("Not Allowed");

    jwt.verify(token, GlobalEnv.JWT_SECRET || "", (err: jwt.VerifyErrors | null, decode: any) => {
      if (err) {
        throw new Error("Not Authenticated");
      }

      req.id = decode.id;
  
      next()
    });

  }
}
