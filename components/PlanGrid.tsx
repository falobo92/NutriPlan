import React, { useState } from 'react';
import { DAYS_OF_WEEK, MEAL_TIMES, WeeklyPlan, DailyUsage, PlanEntry } from '../types';
import { getFoodById, FOOD_DATABASE, getGroupColor } from '../data';
import { Plus, Trash2, Zap, Pencil, Printer } from 'lucide-react';
import { calculateDailyUsage } from '../utils';

interface PlanGridProps {
  plan: WeeklyPlan;
  onRemoveItem: (day: string, meal: string, entryId: string) => void;
  onAutoFill: () => void;
  onClear: () => void;
  openPicker: (day: string, meal: string, usage: DailyUsage) => void;
  onEditItem?: (day: string, meal: string, entryId: string, usage: DailyUsage) => void;
}

export const PlanGrid: React.FC<PlanGridProps> = ({ 
  plan, 
  onRemoveItem, 
  onAutoFill, 
  onClear,
  openPicker,
  onEditItem
}) => {
  const [selectedDayMobile, setSelectedDayMobile] = useState<string>(DAYS_OF_WEEK[0]); 

  if (!plan || Object.keys(plan).length === 0) {
    return <div className="p-8 text-center text-gray-500">Cargando planificador...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const getMealCalories = (entries: PlanEntry[]) => {
    return entries.reduce((sum, entry) => {
      const food = getFoodById(entry.foodId);
      return sum + (food?.calories || 0);
    }, 0);
  };

  // Get portion status for a day
  const getPortionStatus = (dayPlan: Record<string, PlanEntry[]>) => {
    const usage = calculateDailyUsage(dayPlan);
    const status: { name: string; used: number; max: number | string; diff: number }[] = [];
    
    FOOD_DATABASE.forEach(group => {
      const used = usage[group.name] || 0;
      const max = group.maxDaily;
      let diff = 0;
      if (max !== 'Ilimitado') {
        diff = used - (max as number);
      }
      status.push({ name: group.name, used, max, diff });
    });
    
    return status;
  };

  // Desktop View - Shows ALL items
  const renderDesktop = () => (
    <div className="hidden lg:block print:block print:flex-1 border border-gray-200 bg-white plan-grid rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-xs text-left table-fixed">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-medium uppercase text-2xs">
          <tr>
            <th className="p-1 border-b border-r w-20 text-center">Horario</th>
            {DAYS_OF_WEEK.map(day => (
              <th key={day} className="p-1 border-b border-r text-center">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEAL_TIMES.map(meal => (
            <tr key={meal}>
              <td className="p-1 border-r font-medium text-gray-600 bg-gray-50 text-center text-2xs align-top">
                {meal}
              </td>
              {DAYS_OF_WEEK.map(day => {
                const dayPlan = plan[day];
                if (!dayPlan) return <td key={`${day}-${meal}`} className="border-r p-1">-</td>;
                
                const entries = dayPlan[meal] || [];
                const usage = calculateDailyUsage(dayPlan);
                const mealCalories = getMealCalories(entries);
                
                return (
                  <td key={`${day}-${meal}`} className="p-0.5 border-r align-top group">
                    <div className="flex flex-col gap-0.5 min-h-12">
                      {/* Show ALL items - no limit */}
                      {entries.map((entry) => {
                        const food = getFoodById(entry.foodId);
                        if (!food) return null;
                        const colors = getGroupColor(food.group);
                        return (
                          <div 
                            key={entry.id} 
                            className={`group/item flex justify-between items-center ${colors.bgLight} border-l-2 ${colors.border} px-1 py-0.5 text-2xs rounded-r transition-all hover:${colors.bg}`}
                          >
                            <span className={`truncate font-medium ${colors.text} leading-tight`} title={food.name}>
                              {food.name}
                            </span>
                            <div className="flex gap-0.5 opacity-0 group-hover/item:opacity-100 print:hidden shrink-0">
                              {onEditItem && (
                                <button 
                                  type="button"
                                  onClick={() => onEditItem(day, meal, entry.id, usage)}
                                  className="text-gray-400 hover:text-blue-500"
                                >
                                  <Pencil className="w-2.5 h-2.5" />
                                </button>
                              )}
                              <button 
                                type="button"
                                onClick={() => onRemoveItem(day, meal, entry.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <div className="mt-auto flex justify-between items-center">
                        {mealCalories > 0 && (
                          <span className="text-2xs text-gray-500 font-medium">{mealCalories}</span>
                        )}
                        <button 
                          type="button"
                          onClick={() => openPicker(day, meal, usage)}
                          className="ml-auto p-0.5 text-gray-400 hover:text-blue-500 print:hidden"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          
          {/* Total Calories row */}
          <tr className="bg-gray-100 font-medium">
            <td className="p-1 border-r text-center text-2xs text-gray-600">kcal</td>
            {DAYS_OF_WEEK.map(day => {
              const dayPlan = plan[day];
              if (!dayPlan) return <td key={`total-${day}`} className="border-r p-1">-</td>;
              
              let dayTotal = 0;
              MEAL_TIMES.forEach(meal => {
                dayTotal += getMealCalories(dayPlan[meal] || []);
              });
              
              const isOk = dayTotal >= 1350 && dayTotal <= 1650;
              const isLow = dayTotal < 1350 && dayTotal > 0;
              const isHigh = dayTotal > 1650;
              
              return (
                <td key={`total-${day}`} className="p-1 border-r text-center text-2xs">
                  <span className={`font-semibold ${isOk ? 'text-green-600' : ''} ${isLow ? 'text-amber-600' : ''} ${isHigh ? 'text-red-600' : ''} ${dayTotal === 0 ? 'text-gray-400' : ''}`}>
                    {dayTotal}
                  </span>
                </td>
              );
            })}
          </tr>

          {/* Portions Status Row */}
          <tr className="bg-gray-50">
            <td className="p-1 border-r text-center text-3xs text-gray-500 align-top">Porciones</td>
            {DAYS_OF_WEEK.map(day => {
              const dayPlan = plan[day];
              if (!dayPlan) return <td key={`portions-${day}`} className="border-r p-1">-</td>;
              
              const status = getPortionStatus(dayPlan);
              
              return (
                <td key={`portions-${day}`} className="p-1 border-r text-3xs align-top">
                  <div className="grid grid-cols-2 gap-x-1 gap-y-px">
                    {status.map(s => {
                      const maxVal = s.max === 'Ilimitado' ? '∞' : s.max;
                      let colorClass = 'text-gray-500';
                      let label = '';
                      
                      if (s.max !== 'Ilimitado') {
                        if (s.diff > 0) {
                          colorClass = 'text-red-600 font-medium';
                          label = `+${s.diff}`;
                        } else if (s.diff < 0) {
                          colorClass = 'text-amber-600';
                          label = `${s.diff}`;
                        } else if (s.used === s.max) {
                          colorClass = 'text-green-600';
                          label = '✓';
                        }
                      }
                      
                      // Abbreviate group names
                      const shortName = s.name.slice(0, 3);
                      
                      return (
                        <div key={s.name} className={`flex justify-between ${colorClass}`} title={`${s.name}: ${s.used}/${maxVal}`}>
                          <span>{shortName}</span>
                          <span>{s.used}/{maxVal}{label ? ` ${label}` : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );

  // Mobile View
  const renderMobile = () => {
    const dayData = plan[selectedDayMobile];
    if (!dayData) return null;
    const usage = calculateDailyUsage(dayData);
    const portionStatus = getPortionStatus(dayData);

    return (
      <div className="lg:hidden print:hidden">
        <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar">
          {DAYS_OF_WEEK.map(day => (
            <button
              type="button"
              key={day}
              onClick={() => setSelectedDayMobile(day)}
              className={`px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap transition border
                ${selectedDayMobile === day ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Portion Status for mobile */}
        <div className="bg-white border border-gray-200 p-3 mb-3 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500 mb-2 font-medium">Porciones del día:</div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {portionStatus.map(s => {
              const maxVal = s.max === 'Ilimitado' ? '∞' : s.max;
              let colorClass = 'text-gray-600';
              if (s.max !== 'Ilimitado') {
                if (s.diff > 0) colorClass = 'text-red-600 font-medium';
                else if (s.diff < 0) colorClass = 'text-amber-600';
                else if (s.used === s.max) colorClass = 'text-green-600';
              }
              return (
                <div key={s.name} className={`${colorClass}`} title={s.name}>
                  <span className="text-gray-500">{s.name.slice(0, 4)}:</span> {s.used}/{maxVal}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          {MEAL_TIMES.map(meal => {
            const mealCalories = getMealCalories(dayData[meal] || []);
            return (
              <div key={meal} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-800">
                    {meal}
                    {mealCalories > 0 && <span className="text-sm font-normal text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded">{mealCalories} kcal</span>}
                  </span>
                  <button 
                    type="button"
                    onClick={() => openPicker(selectedDayMobile, meal, usage)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors hover:bg-blue-100"
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>
                <div className="space-y-1">
                  {!dayData[meal] || dayData[meal].length === 0 ? (
                    <p className="text-sm text-gray-400">Sin alimentos</p>
                  ) : (
                    dayData[meal].map(entry => {
                      const food = getFoodById(entry.foodId);
                      if (!food) return null;
                      const colors = getGroupColor(food.group);
                      return (
                        <div key={entry.id} className={`flex justify-between items-center text-sm ${colors.bgLight} border-l-3 ${colors.border} p-2 rounded-r`}>
                          <div>
                            <span className={`font-medium ${colors.text}`}>{food.name}</span>
                            <span className="text-xs text-gray-500 block">{food.portion} • {food.calories} kcal</span>
                          </div>
                          <div className="flex gap-1">
                            {onEditItem && (
                              <button 
                                type="button"
                                onClick={() => onEditItem(selectedDayMobile, meal, entry.id, usage)}
                                className="text-gray-400 hover:text-blue-500 p-1"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              type="button"
                              onClick={() => onRemoveItem(selectedDayMobile, meal, entry.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3 print:space-y-0 print:h-full print:flex print:flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 print:hidden">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Plan Semanal</h2>
          <p className="text-gray-500 text-sm">1500 kcal/día objetivo</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-gray-600 bg-white hover:bg-gray-50 text-sm border border-gray-200 rounded-lg shadow-sm transition-all hover:shadow"
          >
            <Printer className="w-4 h-4" /> Imprimir
          </button>
          <button 
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 px-4 py-2 text-red-600 bg-white hover:bg-red-50 text-sm border border-red-200 rounded-lg shadow-sm transition-all hover:shadow"
          >
            <Trash2 className="w-4 h-4" /> Limpiar
          </button>
          <button 
            type="button"
            onClick={onAutoFill}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 text-sm rounded-lg shadow-sm transition-all hover:shadow-md"
          >
            <Zap className="w-4 h-4" /> Generar
          </button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block print-header">
        <h1>Plan Nutricional Semanal — 1500 kcal/día</h1>
      </div>

      {renderMobile()}
      {renderDesktop()}
    </div>
  );
};
