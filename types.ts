export interface FoodItem {
  id: string;
  group: string;
  name: string;
  portion: string;
  notes: string;
  // Campos nutricionales
  calories: number;      // kcal por porción
  protein: number;       // gramos
  carbs: number;         // gramos
  fat: number;           // gramos
}

export interface FoodGroup {
  name: string;
  maxDaily: number | 'Ilimitado';
  items: FoodItem[];
}

export type MealTime = 'Desayuno' | 'Media Mañana' | 'Almuerzo' | 'Once' | 'Cena';

export const MEAL_TIMES: MealTime[] = ['Desayuno', 'Media Mañana', 'Almuerzo', 'Once', 'Cena'];
export const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export interface PlanEntry {
  id: string; // Unique instance ID
  foodId: string;
}

// Map: Day -> MealTime -> Array of PlanEntry
export type WeeklyPlan = Record<string, Record<MealTime, PlanEntry[]>>;

export interface DailyUsage {
  [groupName: string]: number;
}

// Constantes de distribución calórica
export const CALORIE_DISTRIBUTION: Record<MealTime, number> = {
  'Desayuno': 0.30,
  'Media Mañana': 0.10,
  'Almuerzo': 0.30,
  'Once': 0.20,
  'Cena': 0.10
};

export const DAILY_CALORIE_TARGET = 1500;
