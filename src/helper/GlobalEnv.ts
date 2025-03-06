import dotenv from 'dotenv/config'

export const GlobalEnv = {
    PORT: process.env.PORT,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
}
