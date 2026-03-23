// Based on Mifflin-St Jeor Equation

interface CalculationInput {
  gender: 'Male' | 'Female' | 'Other'; // Assuming 'Other' uses average or needs specific handling
  weight_kg: number;
  height_cm: number;
  dob: string; // Expecting YYYY-MM-DD
  workout_frequency?: string; // Added: Used to derive activity multiplier
  goal: 'Lose weight' | 'Maintain' | 'Gain weight';
}

interface CalculationOutput {
  bmr: number;
  tdee: number; // Total Daily Energy Expenditure
  target_calories: number;
  target_protein_g: number;
  target_carbs_g: number;
  target_fat_g: number;
}

// Placeholder values - these should ideally be configurable or based on diet type
const PROTEIN_PERCENTAGE = 0.3; // 30% of calories from protein
const FAT_PERCENTAGE = 0.25; // 25% of calories from fat
// Carbs make up the remainder

// Placeholder for activity level mapping - workout frequency needs translation
// This is a simplification. Real mapping is more complex.
const getActivityMultiplier = (workout_frequency?: string): number => {
  switch (workout_frequency) {
    case '0-2':
      return 1.375; // Light exercise
    case '3-5':
      return 1.55; // Moderate exercise
    case '6+':
      return 1.725; // Heavy exercise
    default:
      return 1.2; // Sedentary (default)
  }
};

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const calculateNutritionalPlan = (input: CalculationInput): CalculationOutput => {
  const { gender, weight_kg, height_cm, dob, goal, workout_frequency } = input;

  const age = calculateAge(dob);
  const activity_level_multiplier = getActivityMultiplier(workout_frequency);

  let bmr: number;
  if (gender === 'Male') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else if (gender === 'Female') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  } else {
    // Simple average for 'Other' - needs refinement based on actual requirements
    const bmrMale = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
    const bmrFemale = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
    bmr = (bmrMale + bmrFemale) / 2;
  }

  const tdee = bmr * activity_level_multiplier;

  let target_calories: number;
  switch (goal) {
    case 'Lose weight':
      target_calories = tdee - 500; // Standard 500 kcal deficit
      break;
    case 'Gain weight':
      target_calories = tdee + 500; // Standard 500 kcal surplus
      break;
    case 'Maintain':
    default:
      target_calories = tdee;
      break;
  }

  // Ensure minimum calorie intake (e.g., 1200 kcal) - adjust as needed
  target_calories = Math.max(target_calories, 1200);

  // Calculate macros (4 kcal/g protein, 4 kcal/g carbs, 9 kcal/g fat)
  const protein_calories = target_calories * PROTEIN_PERCENTAGE;
  const fat_calories = target_calories * FAT_PERCENTAGE;
  const carb_calories = target_calories - protein_calories - fat_calories;

  const target_protein_g = Math.round(protein_calories / 4);
  const target_fat_g = Math.round(fat_calories / 9);
  const target_carbs_g = Math.round(carb_calories / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target_calories: Math.round(target_calories),
    target_protein_g,
    target_carbs_g,
    target_fat_g,
  };
};
