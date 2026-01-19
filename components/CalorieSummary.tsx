import React, { useMemo, useState } from 'react';
import { WeeklyPlan, MEAL_TIMES, MealTime, CALORIE_DISTRIBUTION, DAILY_CALORIE_TARGET, DailyUsage } from '../types';
import { getFoodById, FOOD_DATABASE } from '../data';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CalorieSummaryProps {
  plan: WeeklyPlan;
  selectedDay: string;
}

export const CalorieSummary: React.FC<CalorieSummaryProps> = ({ plan, selectedDay }) => {
  const [expanded, setExpanded] = useState(false);

  const dayData = plan[selectedDay];

  const mealCalories = useMemo(() => {
    if (!dayData) return {} as Record<MealTime, number>;
    
    const calories: Record<MealTime, number> = {
      'Desayuno': 0,
      'Media Mañana': 0,
      'Almuerzo': 0,
      'Once': 0,
      'Cena': 0
    };

    MEAL_TIMES.forEach(meal => {
      const entries = dayData[meal] || [];
      entries.forEach(entry => {
        const food = getFoodById(entry.foodId);
        if (food) {
          calories[meal] += food.calories;
        }
      });
    });

    return calories;
  }, [dayData]);

  const totalCalories = useMemo(() => {
    return Object.values(mealCalories).reduce((sum, cal) => sum + cal, 0);
  }, [mealCalories]);

  const macros = useMemo(() => {
    if (!dayData) return { protein: 0, carbs: 0, fat: 0 };
    
    let protein = 0, carbs = 0, fat = 0;

    MEAL_TIMES.forEach(meal => {
      const entries = dayData[meal] || [];
      entries.forEach(entry => {
        const food = getFoodById(entry.foodId);
        if (food) {
          protein += food.protein;
          carbs += food.carbs;
          fat += food.fat;
        }
      });
    });

    return { protein, carbs, fat };
  }, [dayData]);

  const groupUsage: DailyUsage = useMemo(() => {
    if (!dayData) return {};
    
    const usage: DailyUsage = {};
    FOOD_DATABASE.forEach(group => {
      usage[group.name] = 0;
    });

    MEAL_TIMES.forEach(meal => {
      const entries = dayData[meal] || [];
      entries.forEach(entry => {
        const food = getFoodById(entry.foodId);
        if (food) {
          usage[food.group] = (usage[food.group] || 0) + 1;
        }
      });
    });

    return usage;
  }, [dayData]);

  const percentage = Math.round((totalCalories / DAILY_CALORIE_TARGET) * 100);
  const isOnTarget = percentage >= 90 && percentage <= 110;
  const isLow = percentage < 90;
  const isHigh = percentage > 110;

  return (
    <div className="bg-white border border-gray-200 print:hidden">
      {/* Compact Header - Always visible */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{selectedDay}</span>
          <span className={`text-lg font-semibold ${isOnTarget ? 'text-green-600' : ''} ${isLow ? 'text-amber-600' : ''} ${isHigh ? 'text-red-600' : ''}`}>
            {totalCalories} <span className="text-sm font-normal text-gray-500">/ {DAILY_CALORIE_TARGET} kcal</span>
          </span>
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
            <span>P: {Math.round(macros.protein)}g</span>
            <span>C: {Math.round(macros.carbs)}g</span>
            <span>G: {Math.round(macros.fat)}g</span>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-100 pt-3">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Meal Distribution */}
            <div>
              <h4 className="text-xs font-medium text-gray-600 mb-2">Por Comida</h4>
              <div className="space-y-1">
                {MEAL_TIMES.map(meal => {
                  const target = Math.round(DAILY_CALORIE_TARGET * CALORIE_DISTRIBUTION[meal]);
                  const current = mealCalories[meal] || 0;
                  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 150) : 0;
                  
                  return (
                    <div key={meal} className="flex items-center gap-2 text-xs">
                      <span className="w-24 text-gray-600">{meal}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded overflow-hidden">
                        <div 
                          className={`h-full rounded ${pct >= 85 && pct <= 115 ? 'bg-green-500' : pct < 85 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-gray-500">{current}/{target}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Food Groups */}
            <div>
              <h4 className="text-xs font-medium text-gray-600 mb-2">Porciones</h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {FOOD_DATABASE.map(group => {
                  const used = groupUsage[group.name] || 0;
                  const max = group.maxDaily;
                  const isOver = max !== 'Ilimitado' && used > max;
                  const isAtMax = max !== 'Ilimitado' && used === max;
                  
                  return (
                    <div key={group.name} className="flex justify-between py-0.5">
                      <span className="text-gray-600 truncate">{group.name}</span>
                      <span className={`font-medium ${isOver ? 'text-red-500' : isAtMax ? 'text-amber-600' : 'text-gray-700'}`}>
                        {used}/{max === 'Ilimitado' ? '∞' : max}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
