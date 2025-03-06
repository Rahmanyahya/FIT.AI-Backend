import logger from "../../config/logger";
import prisma from "../../config/prisma";
import { jwtService } from "../../helper/jwt";
import { Validation } from "../../validator/validation";
import {
  deleteUser,
  getProfile,
  registerUser,
  toUserResponse,
  updateUser,
  userLogin,
  userResponse
} from "./user.model";
import { UserValidation } from "./user.validation";
import bcrypt from "bcryptjs";

export class UserService {
  static async userRegister(req: registerUser): Promise<userResponse> {
    const ctx = 'User Registration';
    const scp = 'User'
    const userRequest = Validation.validate(UserValidation.REGISTER_USER, req);

    const isUserExist = await prisma.user.count({
      where: {
        email: userRequest.email
      }
    });

    if (isUserExist != 0) {
      logger.warn(ctx, "User already exist", scp)

      throw new Error("User already exist");
    }

    const hashedPassword = await bcrypt.hash(userRequest.password, 10);

    userRequest.password = hashedPassword;

    const user = await prisma.user.create({ data: userRequest });

    logger.info(ctx, "User created", scp)

    return toUserResponse(user);
  }

  static async userLogin(req: userLogin): Promise<userResponse> {
    const ctx = 'User Login';
    const scp = 'User'
  
    const userRequest = Validation.validate(UserValidation.LOGIN_USER, req);

    const user = await prisma.user.findUnique({
      where: {
        email: userRequest.email
      }
    });

    if (!user) {
      logger.warn(ctx, "User not found", scp)
      throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(
      userRequest.password,
      user.password
    );

    if (!isPasswordMatch) {
      logger.warn(ctx, "Invalid password", scp)
      throw new Error("Invalid password");
    }

    user.id = await bcrypt.hash(user.id, 10)

    const token = jwtService.generateToken(user);
    
    logger.info(ctx, "Login User Success", scp)

    return toUserResponse(user, token);
  }

  static async getProfile(req: getProfile, userId: string) {
    const ctx = 'Get Profile';
    const scp = 'User'
    const { id } = req;

    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });

    if (!user) {
      logger.warn(ctx, "User not found", scp)
      throw new Error("User not found");
    }

    const isYourOwn = await bcrypt.compare(user.id, userId)
    
    if (!isYourOwn) {
      logger.warn(ctx, "Unauthorized User", scp)
      throw new Error("is not your own");
    }

    logger.info(ctx, "Get User Success", scp)

    return toUserResponse(user);
  }

  static async updateUser(
    req: updateUser,
    id: string,
    personalId: string
  ): Promise<userResponse> {
    const ctx = 'User Update';
    const scp = 'User'
    const userRequest = Validation.validate(UserValidation.UPDATE_USER, req);

    const isUserExist = await prisma.user.findUnique({
      where: {
        id
      }
    });

    if (!isUserExist) {
      logger.warn(ctx, "User not found", scp)
      throw new Error("User not found");
    }

    const isYourOwn = await bcrypt.compare(isUserExist.id, personalId)

    if (!isYourOwn) {
      logger.warn(ctx,'Unauthorized User', 'User')
      throw new Error("is not your own");
    }

    userRequest.email ??= isUserExist.email;
    userRequest.password ??= isUserExist.password;
    userRequest.name ??= isUserExist.name;

    const updatedUser = await prisma.user.update({
      where: {
        id
      },
      data: userRequest
    });

    return toUserResponse(updatedUser);
  }

  static async deleteUser(req: deleteUser, personalId: string) {
    const ctx = 'User Delete';
    const scp = 'User'
    const userRequest = Validation.validate(UserValidation.DELETE_USER, req);

    const isUserExist = await prisma.user.findUnique({
      where: {
        id: userRequest.id
      }
    });

    if (!isUserExist) throw new Error("User not found");

    const isYourOwn = await bcrypt.compare(isUserExist.id, personalId)

    if (!isYourOwn) {
      logger.warn(ctx,'Unauthorized User', 'User')
      throw new Error("is not your own");
    }

    await prisma.user.delete({
      where: {
        id: userRequest.id
      }
    });

    return "OK";
  }


}
