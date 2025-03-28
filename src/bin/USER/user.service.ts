import logger from "../../config/logger";
import prisma from "../../config/prisma";
import { jwtService } from "../../helper/jwt";
import { decryptor, encryptor } from "../../utils/kriptografi";
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
    const ctx = "User Registration";
    const scp = "User";
    const userRequest = Validation.validate(UserValidation.REGISTER_USER, req);

    const isUserExist = await prisma.user.count({
      where: {
        email: userRequest.email
      }
    });

    if (isUserExist != 0) {
      logger.warn(ctx, "User already exist", scp);

      throw new Error("User already exist");
    }

    const hashedPassword = await bcrypt.hash(userRequest.password, 10);

    userRequest.password = hashedPassword;

    const user = await prisma.user.create({ data: userRequest });

    logger.info(ctx, "User created", scp);

    return toUserResponse(user);
  }

  static async userLogin(req: userLogin): Promise<userResponse> {
    const ctx = "User Login";
    const scp = "User";

    // Validasi input
    const userRequest = Validation.validate(UserValidation.LOGIN_USER, req);

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: userRequest.email }
    });

    if (!user) {
      logger.warn(ctx, "User not found", scp);
      throw new Error("User not found");
    }

    // Cek password
    const isPasswordMatch = await bcrypt.compare(userRequest.password, user.password);
    if (!isPasswordMatch) {
      logger.warn(ctx, "Invalid password", scp);
      throw new Error("Invalid password");
    }

    // Simpan ID asli sebelum enkripsi
    const originalUserId = user.id;

    // Enkripsi ID user
    user.id = encryptor(user.id);

    // Cek apakah token masih aktif (hindari error jika token null)
    let isTokenActive = false;
    if (user.token) {
      isTokenActive = jwtService.isActive(user.token);
    }

    if (!isTokenActive) {
      // Buat token baru
      user.token = jwtService.generateToken(user);

      // Update token di database dengan ID asli
      await prisma.user.update({
        where: { id: originalUserId }, // Gunakan ID asli di sini
        data: { token: user.token }
      });

      logger.info(ctx, "Login User Success (New Token)", scp);
      return toUserResponse(user, user.token, true);
    }

    logger.info(ctx, "Login User Success (Existing Token)", scp);
    return toUserResponse(user, user.token!, false);
}

  static async getProfile(req: getProfile) {
    const ctx = "Get Profile";
    const scp = "User";

    const user = await prisma.user.findUnique({
      where: {
        id: decryptor(req.id)
      }
    });

    if (!user) {
      logger.warn(ctx, "User not found", scp);
      throw new Error("User not found");
    }

    logger.info(ctx, "Get User Success", scp);

    return toUserResponse(user);
  }

  static async updateUser(
    req: updateUser,
    personalId: string
  ): Promise<userResponse> {
    const ctx = "User Update";
    const scp = "User";
    const userRequest = Validation.validate(UserValidation.UPDATE_USER, req);

    const isUserExist = await prisma.user.findUnique({
      where: {
        id: decryptor(personalId)
      }
    });

    if (!isUserExist) {
      logger.warn(ctx, "User not found", scp);
      throw new Error("User not found");
    }

    userRequest.email ??= isUserExist.email;
    userRequest.password ??= isUserExist.password;
    userRequest.name ??= isUserExist.name;

    const updatedUser = await prisma.user.update({
      where: {
        id: decryptor(personalId)
      },
      data: userRequest
    });

    return toUserResponse(updatedUser);
  }

  static async deleteUser(req: deleteUser) {
    const ctx = "User Delete";
    const scp = "User";
    const userRequest = Validation.validate(UserValidation.DELETE_USER, req);

    const isUserExist = await prisma.user.findUnique({
      where: {
        id: decryptor(userRequest.id)
      }
    });

    if (!isUserExist) {
      logger.warn(ctx, "User not found", scp);
      throw new Error("User not found");
    }

    await prisma.user.delete({
      where: {
        id: decryptor(userRequest.id)
      }
    });

    return "OK";
  }
}
