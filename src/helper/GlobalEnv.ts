import dotenv from "dotenv";
dotenv.config();

export const GlobalEnv = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  ALGHORITHM: process.env.ALGHORITHM,
  LLM_URL: process.env.LLM_URL
};
