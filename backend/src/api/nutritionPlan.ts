import { Request, Response } from 'express';

interface UserMetrics {
  gender: 'male' | 'female' | 'other' | null;
  workoutFrequency: '0-2' | '3-5' | '6+' | null;
  weight: number | null;
  height: number | null;
  birthdate: string | null;
  goal: 'lose' | 'maintain' | 'gain' | null;
  dietType: 'classic' | 'pescatarian' | 'vegetarian' | 'vegan' | null;
  obstacles: string[];
  aims: string[];
  usesMetricSystem: boolean;
}

interface NutritionPlan {
  calories: number;
  macros: {
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
  };
  healthScore: number; // 0-100
}

/**
 * Calculate BMR using Mifflin-St Jeor equation
 * @param gender User's gender
 * @param weight Weight in kg
 * @param height Height in cm
 * @param age Age in years
 * @returns BMR in calories
 */
const calculateBMR = (gender: string, weight: number, height: number, age: number): number => {
  // Mifflin-St Jeor Equation:
  // For men: BMR = 10W + 6.25H - 5A + 5
  // For women: BMR = 10W + 6.25H - 5A - 161
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

/**
 * Calculate activity multiplier based on workout frequency
 * @param workoutFrequency Workout frequency per week
 * @returns Activity multiplier
 */
const getActivityMultiplier = (workoutFrequency: string): number => {
  switch (workoutFrequency) {
    case '0-2':
      return 1.2; // Sedentary to lightly active
    case '3-5':
      return 1.5; // Moderately active
    case '6+':
      return 1.7; // Very active
    default:
      return 1.2; // Default to lightly active
  }
};

/**
 * Calculate macro distribution based on diet type and goal
 * @param calories Total daily calories
 * @param dietType Diet type
 * @param goal User's goal
 * @returns Macronutrient distribution in grams
 */
const calculateMacros = (
  calories: number,
  dietType: string,
  goal: string,
): { protein: number; carbs: number; fat: number } => {
  let proteinPercentage = 0.3; // 30%
  let fatPercentage = 0.3; // 30%
  let carbsPercentage = 0.4; // 40%

  // Adjust based on diet type
  switch (dietType) {
    case 'classic':
      // No adjustment needed
      break;
    case 'pescatarian':
      proteinPercentage = 0.28;
      carbsPercentage = 0.42;
      break;
    case 'vegetarian':
      proteinPercentage = 0.25;
      carbsPercentage = 0.5;
      fatPercentage = 0.25;
      break;
    case 'vegan':
      proteinPercentage = 0.2;
      carbsPercentage = 0.55;
      fatPercentage = 0.25;
      break;
  }

  // Adjust based on goal
  switch (goal) {
    case 'lose':
      proteinPercentage += 0.05;
      carbsPercentage -= 0.05;
      break;
    case 'maintain':
      // No adjustment needed
      break;
    case 'gain':
      proteinPercentage += 0.05;
      fatPercentage -= 0.05;
      break;
  }

  // Calculate macros in grams (protein and carbs = 4 cal/g, fat = 9 cal/g)
  const protein = Math.round((calories * proteinPercentage) / 4);
  const carbs = Math.round((calories * carbsPercentage) / 4);
  const fat = Math.round((calories * fatPercentage) / 9);

  return { protein, carbs, fat };
};

/**
 * Calculate health score based on diet type and macro distribution
 * @param macros Macronutrient distribution
 * @param dietType Diet type
 * @returns Health score (0-100)
 */
const calculateHealthScore = (
  macros: { protein: number; carbs: number; fat: number },
  dietType: string,
): number => {
  // Base score
  let score = 70;

  // Balanced macros increase score
  const proteinCalories = macros.protein * 4;
  const carbsCalories = macros.carbs * 4;
  const fatCalories = macros.fat * 9;
  const totalCalories = proteinCalories + carbsCalories + fatCalories;

  const proteinPercentage = proteinCalories / totalCalories;
  const carbsPercentage = carbsCalories / totalCalories;
  const fatPercentage = fatCalories / totalCalories;

  // Ideal ranges
  const idealRanges = {
    protein: { min: 0.15, max: 0.35 },
    carbs: { min: 0.4, max: 0.65 },
    fat: { min: 0.2, max: 0.35 },
  };

  // Check if macros are in ideal ranges
  if (
    proteinPercentage >= idealRanges.protein.min &&
    proteinPercentage <= idealRanges.protein.max
  ) {
    score += 5;
  }
  if (carbsPercentage >= idealRanges.carbs.min && carbsPercentage <= idealRanges.carbs.max) {
    score += 5;
  }
  if (fatPercentage >= idealRanges.fat.min && fatPercentage <= idealRanges.fat.max) {
    score += 5;
  }

  // Diet type bonus
  switch (dietType) {
    case 'vegetarian':
    case 'pescatarian':
      score += 5;
      break;
    case 'vegan':
      score += 10;
      break;
  }

  // Cap score at 100
  return Math.min(100, score);
};

/**
 * Create a personalized nutrition plan based on user metrics
 * @param req Request with user metrics
 * @param res Response with nutrition plan
 */
export const createNutritionPlan = (req: Request, res: Response) => {
  try {
    const userMetrics: UserMetrics = req.body;

    // Validate required fields
    if (
      !userMetrics.gender ||
      !userMetrics.weight ||
      !userMetrics.height ||
      !userMetrics.birthdate ||
      !userMetrics.goal ||
      !userMetrics.dietType ||
      !userMetrics.workoutFrequency
    ) {
      return res.status(400).json({ error: 'Missing required user metrics' });
    }

    // Convert imperial to metric if needed
    const weight = userMetrics.usesMetricSystem
      ? userMetrics.weight
      : Math.round(userMetrics.weight * 0.453592); // lbs to kg

    const height = userMetrics.usesMetricSystem
      ? userMetrics.height
      : Math.round(userMetrics.height * 2.54); // inches to cm

    // Calculate age from birthdate
    const birthDate = new Date(userMetrics.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    // Calculate BMR
    const bmr = calculateBMR(userMetrics.gender, weight, height, age);

    // Apply activity multiplier
    const activityMultiplier = getActivityMultiplier(userMetrics.workoutFrequency);
    let totalCalories = Math.round(bmr * activityMultiplier);

    // Adjust calories based on goal
    switch (userMetrics.goal) {
      case 'lose':
        totalCalories = Math.round(totalCalories * 0.8); // 20% deficit
        break;
      case 'gain':
        totalCalories = Math.round(totalCalories * 1.1); // 10% surplus
        break;
    }

    // Calculate macronutrient distribution
    const macros = calculateMacros(totalCalories, userMetrics.dietType, userMetrics.goal);

    // Calculate health score
    const healthScore = calculateHealthScore(macros, userMetrics.dietType);

    // Create nutrition plan
    const nutritionPlan: NutritionPlan = {
      calories: totalCalories,
      macros,
      healthScore,
    };

    // Return nutrition plan
    return res.status(200).json({
      plan: nutritionPlan,
      metrics: userMetrics,
    });
  } catch (error) {
    console.error('Error creating nutrition plan:', error);
    return res.status(500).json({
      error: 'Failed to create nutrition plan',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default {
  createNutritionPlan,
};
