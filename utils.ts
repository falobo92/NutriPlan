import { FOOD_DATABASE, getFoodById } from './data';
import { DailyUsage, FoodItem, MealTime, WeeklyPlan, DAYS_OF_WEEK } from './types';

// Simple ID generator to avoid external dependencies
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

export const calculateDailyUsage = (dayPlan: Record<MealTime, { id: string; foodId: string }[]>): DailyUsage => {
  const usage: DailyUsage = {};
  
  // Initialize all groups to 0
  FOOD_DATABASE.forEach(group => {
    usage[group.name] = 0;
  });

  // Sum up usage
  Object.values(dayPlan).forEach(mealItems => {
    if (!Array.isArray(mealItems)) return;
    mealItems.forEach(entry => {
      const food = getFoodById(entry.foodId);
      if (food) {
        usage[food.group] = (usage[food.group] || 0) + 1;
      }
    });
  });

  return usage;
};

export const getEmptyWeek = (): WeeklyPlan => {
  const plan: WeeklyPlan = {};
  DAYS_OF_WEEK.forEach(day => {
    plan[day] = {
      'Desayuno': [],
      'Media Mañana': [],
      'Almuerzo': [],
      'Once': [],
      'Cena': []
    };
  });
  return plan;
};

// --- Random Plan Generation Logic ---

const getRandomItemFromGroup = (groupName: string): FoodItem | undefined => {
  const group = FOOD_DATABASE.find(g => g.name === groupName);
  if (!group || group.items.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * group.items.length);
  return group.items[randomIndex];
};

const tryAddItemToMeal = (
  currentUsage: DailyUsage,
  groupName: string,
  mealItems: { id: string; foodId: string }[]
) => {
  const group = FOOD_DATABASE.find(g => g.name === groupName);
  if (!group) return;

  const currentCount = currentUsage[groupName] || 0;
  // Handle limit check
  if (group.maxDaily !== 'Ilimitado' && currentCount >= group.maxDaily) {
    return; // Limit reached
  }

  const item = getRandomItemFromGroup(groupName);
  if (item) {
    mealItems.push({ id: generateId(), foodId: item.id });
    currentUsage[groupName] = currentCount + 1;
  }
};

export const generateRandomPlan = (): WeeklyPlan => {
  const plan: WeeklyPlan = {};

  DAYS_OF_WEEK.forEach(day => {
    // Initialize day structure
    plan[day] = {
      'Desayuno': [],
      'Media Mañana': [],
      'Almuerzo': [],
      'Once': [],
      'Cena': []
    };

    const dailyUsage: DailyUsage = {};
    FOOD_DATABASE.forEach(g => dailyUsage[g.name] = 0);

    // --- Balanced Meal Templates ---
    
    // Desayuno: Dairy + (Bread OR Cereal)
    tryAddItemToMeal(dailyUsage, 'Lácteos', plan[day]['Desayuno']);
    if (Math.random() > 0.5) {
       tryAddItemToMeal(dailyUsage, 'Pan y Galletas', plan[day]['Desayuno']);
    } else {
       tryAddItemToMeal(dailyUsage, 'Cereales/Farináceos', plan[day]['Desayuno']);
    }
    
    // Media Mañana: Fruit (priority) or Dairy
    if (Math.random() > 0.3) {
      tryAddItemToMeal(dailyUsage, 'Frutas', plan[day]['Media Mañana']);
    } else {
      tryAddItemToMeal(dailyUsage, 'Lácteos', plan[day]['Media Mañana']);
    }

    // Almuerzo: Protein + Cereal + Veggies + Fat
    tryAddItemToMeal(dailyUsage, 'Proteínas', plan[day]['Almuerzo']);
    tryAddItemToMeal(dailyUsage, 'Cereales/Farináceos', plan[day]['Almuerzo']);
    tryAddItemToMeal(dailyUsage, 'Verduras', plan[day]['Almuerzo']);
    tryAddItemToMeal(dailyUsage, 'Verduras (Libre)', plan[day]['Almuerzo']);
    tryAddItemToMeal(dailyUsage, 'Aceites y Grasas', plan[day]['Almuerzo']);

    // Once: Dairy + Bread + Fat
    tryAddItemToMeal(dailyUsage, 'Lácteos', plan[day]['Once']);
    tryAddItemToMeal(dailyUsage, 'Pan y Galletas', plan[day]['Once']);
    tryAddItemToMeal(dailyUsage, 'Aceites y Grasas', plan[day]['Once']);

    // Cena: Protein + Veggies (Light)
    tryAddItemToMeal(dailyUsage, 'Proteínas', plan[day]['Cena']);
    tryAddItemToMeal(dailyUsage, 'Verduras', plan[day]['Cena']);
    tryAddItemToMeal(dailyUsage, 'Verduras (Libre)', plan[day]['Cena']);
    
    // Fill gaps if limits allow (e.g., ensure at least 2 fruits if possible)
    const fruitGroup = FOOD_DATABASE.find(g => g.name === 'Frutas');
    const fruitsUsed = dailyUsage['Frutas'] || 0;
    const fruitMax = fruitGroup?.maxDaily === 'Ilimitado' ? 99 : (fruitGroup?.maxDaily || 0);
    
    if (fruitsUsed < fruitMax) {
        // Add fruit to breakfast or snack if missing
        if (Math.random() > 0.5) {
           tryAddItemToMeal(dailyUsage, 'Frutas', plan[day]['Desayuno']);
        } else {
           tryAddItemToMeal(dailyUsage, 'Frutas', plan[day]['Media Mañana']);
        }
    }
  });

  return plan;
};