import { Gender, Goal, Profile } from "@prisma/client";

export type createProfile = {
  age: number;
  gender: Gender;
  height: number;
  currentWeight: number;
  goalWeight?: number;
  activityLevel: number;
  goal: Goal;
};

export type updateProfile = Partial<createProfile>;

export type deleteProfile = {
  id: string;
};

export type profileResponse = {
  age: number;
  gender: "MALE" | "FEMALE";
  height: number;
  currentWeight: number;
  goalWeight?: number;
  activityLevel: number;
  goal: Goal;
};

export function toProfileResponse(profile: Profile): profileResponse {
  return {
    age: profile.age,
    gender: profile.gender,
    height: profile.height,
    currentWeight: profile.currentWeight,
    goalWeight: profile.goalWeight!,
    activityLevel: profile.activityLevel,
    goal: profile.goal
  };
}
