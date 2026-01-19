export interface FoodItem {
  id: string;
  group: string;
  name: string;
  portion: string;
  notes: string;
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
