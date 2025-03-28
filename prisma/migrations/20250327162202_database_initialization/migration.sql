-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS', 'DRINK', 'CARBS');

-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('WEIGHT_LOSS', 'WEIGHT_GAIN', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "currentWeight" DOUBLE PRECISION NOT NULL,
    "goalWeight" DOUBLE PRECISION,
    "activityLevel" INTEGER NOT NULL,
    "goal" "Goal" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyCalories" DOUBLE PRECISION NOT NULL,
    "dailyProtein" DOUBLE PRECISION NOT NULL,
    "dailyFatin" DOUBLE PRECISION NOT NULL,
    "dailyCarbs" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodConsumption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dailyRecord" TEXT,
    "userId" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "sugar" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "foodType" "FoodType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoodConsumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyRecordConsuming" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProte" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFatin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCarbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyRecordConsuming_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionPlan_userId_key" ON "NutritionPlan"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodConsumption_dailyRecord_key" ON "FoodConsumption"("dailyRecord");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRecordConsuming_userId_key" ON "DailyRecordConsuming"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRecordConsuming_userId_createdAt_key" ON "DailyRecordConsuming"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionPlan" ADD CONSTRAINT "NutritionPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodConsumption" ADD CONSTRAINT "FoodConsumption_dailyRecord_fkey" FOREIGN KEY ("dailyRecord") REFERENCES "DailyRecordConsuming"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodConsumption" ADD CONSTRAINT "FoodConsumption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRecordConsuming" ADD CONSTRAINT "DailyRecordConsuming_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
