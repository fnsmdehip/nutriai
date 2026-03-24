/**
 * TDEE & Macro Calculation Engine
 * Uses Mifflin-St Jeor equation for BMR estimation.
 */

import type { Gender, Goal, ActivityLevel } from '../store/userSlice';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  athlete: 1.9,
};

/**
 * Mifflin-St Jeor BMR
 * Male:   10 * weight_kg + 6.25 * height_cm - 5 * age + 5
 * Female: 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
 * Other:  average of male and female
 */
export function calculateBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') return base + 5;
  if (gender === 'female') return base - 161;
  // 'other' — use midpoint
  return base + (5 + -161) / 2;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateDailyCalories(tdee: number, goal: Goal): number {
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500);
    case 'gain':
      return Math.round(tdee + 300);
    case 'maintain':
    default:
      return Math.round(tdee);
  }
}

export interface MacroSplit {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

/**
 * Default macro split:
 *   Protein: 0.8g per lb bodyweight (capped at 30% of calories)
 *   Fat: 25% of calories / 9 cal per gram
 *   Carbs: remaining calories / 4 cal per gram
 */
export function calculateMacros(dailyCalories: number, weightKg: number): MacroSplit {
  const weightLbs = weightKg * 2.20462;

  // Protein: 0.8g per lb or 30% of calories, whichever is less
  const proteinFromWeight = Math.round(weightLbs * 0.8);
  const proteinFrom30Pct = Math.round((dailyCalories * 0.3) / 4);
  const protein = Math.min(proteinFromWeight, proteinFrom30Pct);

  // Fat: 25% of calories
  const fat = Math.round((dailyCalories * 0.25) / 9);

  // Carbs: remaining
  const proteinCals = protein * 4;
  const fatCals = fat * 9;
  const carbCals = dailyCalories - proteinCals - fatCals;
  const carbs = Math.round(Math.max(0, carbCals / 4));

  return { protein, carbs, fat };
}

/**
 * Full calculation pipeline: from raw inputs to daily targets.
 */
export function calculateFullPlan(
  gender: Gender,
  age: number,
  heightCm: number,
  weightKg: number,
  goal: Goal,
  activityLevel: ActivityLevel,
): { dailyCalories: number; protein: number; carbs: number; fat: number } {
  const bmr = calculateBMR(gender, weightKg, heightCm, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  const dailyCalories = calculateDailyCalories(tdee, goal);
  const macros = calculateMacros(dailyCalories, weightKg);

  return {
    dailyCalories,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
  };
}

/**
 * Convert height from feet/inches to cm
 */
export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}

/**
 * Convert cm to feet and inches
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Convert lbs to kg
 */
export function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

/**
 * Convert kg to lbs
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

/**
 * Estimate weeks to reach target weight (1-2 lbs/week for loss, 0.5 lb/week for gain).
 */
export function estimateWeeksToGoal(
  currentWeightKg: number,
  goalWeightKg: number,
  goal: Goal,
): number {
  const diffKg = Math.abs(currentWeightKg - goalWeightKg);
  const diffLbs = diffKg * 2.20462;

  if (goal === 'lose') {
    // ~1 lb/week deficit
    return Math.ceil(diffLbs / 1);
  }
  if (goal === 'gain') {
    // ~0.5 lb/week surplus
    return Math.ceil(diffLbs / 0.5);
  }
  return 0;
}

/**
 * Get projected date from weeks.
 */
export function getProjectedDate(weeks: number): string {
  const date = new Date();
  date.setDate(date.getDate() + weeks * 7);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
