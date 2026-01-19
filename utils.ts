import { FOOD_DATABASE, getFoodById } from './data';
import { DailyUsage, FoodItem, MealTime, WeeklyPlan, DAYS_OF_WEEK, CALORIE_DISTRIBUTION, DAILY_CALORIE_TARGET, MEAL_TIMES } from './types';

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

// --- Calorie-Aware Random Plan Generation Logic ---

interface MealTemplate {
  groups: string[];
  optional?: string[];
}

// Define what food groups are typical for each meal
const MEAL_TEMPLATES: Record<MealTime, MealTemplate> = {
  'Desayuno': {
    groups: ['Lácteos', 'Pan y Galletas'],
    optional: ['Frutas']
  },
  'Media Mañana': {
    groups: ['Frutas'],
    optional: ['Lácteos', 'Aceites y Grasas']
  },
  'Almuerzo': {
    groups: ['Proteínas', 'Cereales/Farináceos', 'Verduras'],
    optional: ['Verduras (Libre)', 'Aceites y Grasas']
  },
  'Once': {
    groups: ['Lácteos', 'Pan y Galletas'],
    optional: ['Aceites y Grasas']
  },
  'Cena': {
    groups: ['Proteínas', 'Verduras'],
    optional: ['Verduras (Libre)']
  }
};

const getRandomItemFromGroup = (groupName: string): FoodItem | undefined => {
  const group = FOOD_DATABASE.find(g => g.name === groupName);
  if (!group || group.items.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * group.items.length);
  return group.items[randomIndex];
};

const canAddFromGroup = (groupName: string, dailyUsage: DailyUsage): boolean => {
  const group = FOOD_DATABASE.find(g => g.name === groupName);
  if (!group) return false;
  if (group.maxDaily === 'Ilimitado') return true;
  return (dailyUsage[groupName] || 0) < group.maxDaily;
};

const tryAddItemToMealWithCalories = (
  dailyUsage: DailyUsage,
  groupName: string,
  mealItems: { id: string; foodId: string }[],
  currentMealCalories: number,
  targetCalories: number,
  tolerance: number = 0.15
): { added: boolean; calories: number } => {
  if (!canAddFromGroup(groupName, dailyUsage)) {
    return { added: false, calories: 0 };
  }

  const item = getRandomItemFromGroup(groupName);
  if (!item) {
    return { added: false, calories: 0 };
  }

  // Check if adding this item would exceed the target too much
  const projectedCalories = currentMealCalories + item.calories;
  const maxAllowed = targetCalories * (1 + tolerance);
  
  if (projectedCalories > maxAllowed && currentMealCalories > 0) {
    // Try to find a lower calorie item from the same group
    const group = FOOD_DATABASE.find(g => g.name === groupName);
    if (group) {
      const sortedItems = [...group.items].sort((a, b) => a.calories - b.calories);
      for (const lowerCalItem of sortedItems) {
        if (currentMealCalories + lowerCalItem.calories <= maxAllowed) {
          mealItems.push({ id: generateId(), foodId: lowerCalItem.id });
          dailyUsage[groupName] = (dailyUsage[groupName] || 0) + 1;
          return { added: true, calories: lowerCalItem.calories };
        }
      }
    }
    return { added: false, calories: 0 };
  }

  mealItems.push({ id: generateId(), foodId: item.id });
  dailyUsage[groupName] = (dailyUsage[groupName] || 0) + 1;
  return { added: true, calories: item.calories };
};

const fillMealToTarget = (
  meal: MealTime,
  mealItems: { id: string; foodId: string }[],
  dailyUsage: DailyUsage,
  targetCalories: number
): void => {
  const template = MEAL_TEMPLATES[meal];
  let currentCalories = 0;

  // First pass: add required groups
  for (const groupName of template.groups) {
    const result = tryAddItemToMealWithCalories(
      dailyUsage, 
      groupName, 
      mealItems, 
      currentCalories, 
      targetCalories
    );
    if (result.added) {
      currentCalories += result.calories;
    }
  }

  // Second pass: add optional groups if we're below target
  if (template.optional && currentCalories < targetCalories * 0.9) {
    for (const groupName of template.optional) {
      if (currentCalories >= targetCalories * 0.95) break;
      
      const result = tryAddItemToMealWithCalories(
        dailyUsage, 
        groupName, 
        mealItems, 
        currentCalories, 
        targetCalories
      );
      if (result.added) {
        currentCalories += result.calories;
      }
    }
  }

  // Third pass: if still significantly below target, try adding more from any available group
  if (currentCalories < targetCalories * 0.7) {
    const allGroups = [...template.groups, ...(template.optional || [])];
    for (const groupName of allGroups) {
      if (currentCalories >= targetCalories * 0.85) break;
      
      const result = tryAddItemToMealWithCalories(
        dailyUsage, 
        groupName, 
        mealItems, 
        currentCalories, 
        targetCalories,
        0.2
      );
      if (result.added) {
        currentCalories += result.calories;
      }
    }
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

    // Fill each meal according to caloric targets
    MEAL_TIMES.forEach(meal => {
      const targetCalories = Math.round(DAILY_CALORIE_TARGET * CALORIE_DISTRIBUTION[meal]);
      fillMealToTarget(meal, plan[day][meal], dailyUsage, targetCalories);
    });
  });

  return plan;
};

// Calculate total calories for a day
export const calculateDayCalories = (dayPlan: Record<MealTime, { id: string; foodId: string }[]>): number => {
  let total = 0;
  MEAL_TIMES.forEach(meal => {
    const entries = dayPlan[meal] || [];
    entries.forEach(entry => {
      const food = getFoodById(entry.foodId);
      if (food) {
        total += food.calories;
      }
    });
  });
  return total;
};

// Calculate meal calories
export const calculateMealCalories = (entries: { id: string; foodId: string }[]): number => {
  return entries.reduce((sum, entry) => {
    const food = getFoodById(entry.foodId);
    return sum + (food?.calories || 0);
  }, 0);
};
