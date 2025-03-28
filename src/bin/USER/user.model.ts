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
  id: string;
};

export type getProfile = {
  id: string;
};

export type userResponse = {
  name: string;
  token?: string;
  email?: string;
  newToken?: boolean
};

export function toUserResponse(user: User, token?: string, newToken?: boolean): userResponse {
  return {
    name: user.name,
    email: user.email,
    newToken,
    token
  };
}
