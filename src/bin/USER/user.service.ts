import prisma from "../../config/prisma";
import { jwtService } from "../../helper/jwt";
import { Validation } from "../../validator/validation";
import {
  deleteUser,
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
    const userRequest = Validation.validate(UserValidation.REGISTER_USER, req);

    const isUserExist = await prisma.user.count({
      where: {
        email: userRequest.email
      }
    });

    if (isUserExist != 0) throw new Error("User already exist");

    const hashedPassword = await bcrypt.hash(userRequest.password, 10);

    userRequest.password = hashedPassword;

    const user = await prisma.user.create({ data: userRequest });

    return toUserResponse(user);
  }

  static async userLogin(req: userLogin): Promise<userResponse> {
    const userRequest = Validation.validate(UserValidation.LOGIN_USER, req);

    const user = await prisma.user.findUnique({
      where: {
        email: userRequest.email
      }
    });

    if (!user) throw new Error("User not found");

    const isPasswordMatch = await bcrypt.compare(
      userRequest.password,
      user.password
    );

    if (!isPasswordMatch) throw new Error("Invalid password");

    const token = jwtService.generateToken(user);

    return toUserResponse(user, token);
  }

  static async updateUser(
    req: updateUser,
    userId: number
  ): Promise<userResponse> {
    const userRequest = Validation.validate(UserValidation.UPDATE_USER, req);

    const isUserExist = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!isUserExist) throw new Error("User not found");

    userRequest.email ??= isUserExist.email;
    userRequest.password ??= isUserExist.password;
    userRequest.name ??= isUserExist.name;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: userRequest
    });

    return toUserResponse(updatedUser);
  }

  static async deleteUser(req: deleteUser) {
    const userRequest = Validation.validate(UserValidation.DELETE_USER, req);

    const isUserExist = await prisma.user.findUnique({
      where: {
        id: userRequest.id
      }
    });

    if (!isUserExist) throw new Error("User not found");

    await prisma.user.delete({
      where: {
        id: userRequest.id
      }
    });

    return "OK";
  }
}
