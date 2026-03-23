/**
 * Enhanced food database service.
 * Combines USDA FoodData Central API with Open Food Facts for barcode lookups.
 */

const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const USDA_API_KEY = 'DEMO_KEY'; // USDA provides free access with DEMO_KEY (limited) or register for a key
const OPEN_FOOD_FACTS_BASE_URL = 'https://world.openfoodfacts.org/api/v2';

// ---------- Types ----------

export interface USDAFoodNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
}

export interface USDAFoodItem {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner?: string;
  brandName?: string;
  ingredients?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients: USDAFoodNutrient[];
}

export interface USDASearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: USDAFoodItem[];
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // mg
  servingSize: string;
}

export interface FoodSearchResult {
  id: string;
  name: string;
  brand: string | null;
  nutrition: NutritionInfo;
  source: 'usda' | 'openfoodfacts' | 'ai';
  confidence: number; // 0-1
}

export interface BarcodeLookupResult {
  found: boolean;
  product: FoodSearchResult | null;
}

// USDA nutrient number constants
const NUTRIENT_IDS = {
  ENERGY_KCAL: '208',
  PROTEIN: '203',
  TOTAL_FAT: '204',
  CARBOHYDRATES: '205',
  FIBER: '291',
  SUGARS: '269',
  SODIUM: '307',
} as const;

// ---------- USDA FoodData Central ----------

/**
 * Search for foods in the USDA FoodData Central database.
 */
export async function searchUSDA(
  query: string,
  pageSize: number = 10,
  pageNumber: number = 1
): Promise<FoodSearchResult[]> {
  try {
    const url = `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        pageSize,
        pageNumber,
        dataType: ['Branded', 'Survey (FNDDS)', 'SR Legacy'],
        sortBy: 'dataType.keyword',
        sortOrder: 'asc',
      }),
    });

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }

    const data: USDASearchResponse = await response.json();
    return data.foods.map(mapUSDAFoodToResult);
  } catch (error) {
    console.error('[FoodDB] USDA search failed:', error);
    return [];
  }
}

/**
 * Get detailed food info by USDA FDC ID.
 */
export async function getUSDAFoodById(fdcId: number): Promise<FoodSearchResult | null> {
  try {
    const url = `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }

    const data: USDAFoodItem = await response.json();
    return mapUSDAFoodToResult(data);
  } catch (error) {
    console.error('[FoodDB] USDA lookup failed:', error);
    return null;
  }
}

// ---------- Open Food Facts (Barcode) ----------

/**
 * Look up a product by barcode (UPC/EAN) using Open Food Facts.
 */
export async function lookupBarcode(barcode: string): Promise<BarcodeLookupResult> {
  try {
    const url = `${OPEN_FOOD_FACTS_BASE_URL}/product/${barcode}?fields=product_name,brands,nutriments,serving_size,serving_quantity`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NutriAI/1.0 (contact@nutriai.app)',
      },
    });

    if (!response.ok) {
      return { found: false, product: null };
    }

    const data = await response.json();

    if (data.status === 0 || !data.product) {
      return { found: false, product: null };
    }

    const product = data.product;
    const nutriments = product.nutriments ?? {};

    const result: FoodSearchResult = {
      id: `off-${barcode}`,
      name: product.product_name ?? 'Unknown Product',
      brand: product.brands ?? null,
      nutrition: {
        calories: nutriments['energy-kcal_100g'] ?? nutriments['energy-kcal'] ?? 0,
        protein: nutriments.proteins_100g ?? nutriments.proteins ?? 0,
        carbs: nutriments.carbohydrates_100g ?? nutriments.carbohydrates ?? 0,
        fat: nutriments.fat_100g ?? nutriments.fat ?? 0,
        fiber: nutriments.fiber_100g ?? nutriments.fiber ?? 0,
        sugar: nutriments.sugars_100g ?? nutriments.sugars ?? 0,
        sodium: nutriments.sodium_100g ? nutriments.sodium_100g * 1000 : 0, // convert g to mg
        servingSize: product.serving_size ?? '100g',
      },
      source: 'openfoodfacts',
      confidence: 0.9,
    };

    return { found: true, product: result };
  } catch (error) {
    console.error('[FoodDB] Barcode lookup failed:', error);
    return { found: false, product: null };
  }
}

// ---------- Combined Search ----------

/**
 * Combined food search: tries USDA first, returns results.
 * Can be combined with AI recognition results for better accuracy.
 */
export async function searchFood(query: string): Promise<FoodSearchResult[]> {
  const usdaResults = await searchUSDA(query, 10);
  return usdaResults;
}

/**
 * Merge AI recognition results with USDA data for higher accuracy.
 * Uses the AI-recognized food name to search USDA and cross-reference nutrients.
 */
export async function mergeWithAIResults(
  aiName: string,
  aiNutrition: NutritionInfo
): Promise<FoodSearchResult> {
  try {
    const usdaResults = await searchUSDA(aiName, 3);

    if (usdaResults.length > 0) {
      const bestMatch = usdaResults[0];
      // Average the AI and USDA values for better accuracy
      return {
        id: bestMatch.id,
        name: aiName,
        brand: bestMatch.brand,
        nutrition: {
          calories: Math.round((aiNutrition.calories + bestMatch.nutrition.calories) / 2),
          protein: Math.round(((aiNutrition.protein + bestMatch.nutrition.protein) / 2) * 10) / 10,
          carbs: Math.round(((aiNutrition.carbs + bestMatch.nutrition.carbs) / 2) * 10) / 10,
          fat: Math.round(((aiNutrition.fat + bestMatch.nutrition.fat) / 2) * 10) / 10,
          fiber: bestMatch.nutrition.fiber,
          sugar: bestMatch.nutrition.sugar,
          sodium: bestMatch.nutrition.sodium,
          servingSize: bestMatch.nutrition.servingSize || aiNutrition.servingSize,
        },
        source: 'usda',
        confidence: 0.95,
      };
    }

    // Fall back to AI-only result
    return {
      id: `ai-${Date.now()}`,
      name: aiName,
      brand: null,
      nutrition: aiNutrition,
      source: 'ai',
      confidence: 0.7,
    };
  } catch (error) {
    console.error('[FoodDB] Merge with AI results failed:', error);
    return {
      id: `ai-${Date.now()}`,
      name: aiName,
      brand: null,
      nutrition: aiNutrition,
      source: 'ai',
      confidence: 0.7,
    };
  }
}

// ---------- Helpers ----------

function extractNutrientValue(nutrients: USDAFoodNutrient[], nutrientNumber: string): number {
  const nutrient = nutrients.find((n) => n.nutrientNumber === nutrientNumber);
  return nutrient?.value ?? 0;
}

function mapUSDAFoodToResult(food: USDAFoodItem): FoodSearchResult {
  const nutrients = food.foodNutrients;

  return {
    id: `usda-${food.fdcId}`,
    name: food.description,
    brand: food.brandOwner ?? food.brandName ?? null,
    nutrition: {
      calories: extractNutrientValue(nutrients, NUTRIENT_IDS.ENERGY_KCAL),
      protein: extractNutrientValue(nutrients, NUTRIENT_IDS.PROTEIN),
      carbs: extractNutrientValue(nutrients, NUTRIENT_IDS.CARBOHYDRATES),
      fat: extractNutrientValue(nutrients, NUTRIENT_IDS.TOTAL_FAT),
      fiber: extractNutrientValue(nutrients, NUTRIENT_IDS.FIBER),
      sugar: extractNutrientValue(nutrients, NUTRIENT_IDS.SUGARS),
      sodium: extractNutrientValue(nutrients, NUTRIENT_IDS.SODIUM),
      servingSize: food.servingSize
        ? `${food.servingSize}${food.servingSizeUnit ?? 'g'}`
        : '100g',
    },
    source: 'usda',
    confidence: 0.85,
  };
}
