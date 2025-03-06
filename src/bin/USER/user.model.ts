import { User } from "@prisma/client";

export type userLogin = {
  email: string;
  password: string;
};

export type registerUser = {
  email: string;
  password: string;
  name: string;
};

export type updateUser = {
  email?: string;
  password?: string;
  name?: string;
};

export type deleteUser = {
  id: number;
};

export type userResponse = {
  name: string;
  token?: string;
};

export function toUserResponse(user: User, token?: string): userResponse {
  return {
    name: user.name,
    token
  };
}
