import React, { useState } from 'react';
import { DAYS_OF_WEEK, MEAL_TIMES, WeeklyPlan, FoodItem, DailyUsage } from '../types';
import { getFoodById } from '../data';
import { Plus, Trash2, Zap } from 'lucide-react';
import { calculateDailyUsage } from '../utils';

interface PlanGridProps {
  plan: WeeklyPlan;
  onAddItem: (day: string, meal: string, item: FoodItem) => void;
  onRemoveItem: (day: string, meal: string, entryId: string) => void;
  onAutoFill: () => void;
  onClear: () => void;
  openPicker: (day: string, meal: string, usage: DailyUsage) => void;
}

export const PlanGrid: React.FC<PlanGridProps> = ({ 
  plan, 
  onRemoveItem, 
  onAutoFill, 
  onClear,
  openPicker 
}) => {
  const [selectedDay, setSelectedDay] = useState<string>(DAYS_OF_WEEK[0]); 

  // Safety check: ensure plan has keys
  if (!plan || Object.keys(plan).length === 0) {
    return <div className="p-8 text-center text-gray-500">Cargando planificador...</div>;
  }

  // Desktop View: Full Table
  const renderDesktop = () => (
    <div className="hidden lg:block overflow-x-auto border rounded-xl shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-brand-50 text-brand-900 font-semibold uppercase text-xs tracking-wider">
          <tr>
            <th className="p-4 border-b border-r w-32 bg-brand-100/50 sticky left-0 z-10">Horario</th>
            {DAYS_OF_WEEK.map(day => (
              <th key={day} className="p-4 border-b border-r min-w-[180px]">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEAL_TIMES.map(meal => (
            <tr key={meal} className="hover:bg-gray-50/50">
              <td className="p-4 border-r font-bold text-gray-700 bg-gray-50/30 sticky left-0 z-10">{meal}</td>
              {DAYS_OF_WEEK.map(day => {
                // Safety access
                const dayPlan = plan[day];
                if (!dayPlan) return <td key={`${day}-${meal}`} className="border-r p-2">Error</td>;
                
                const entries = dayPlan[meal] || [];
                const usage = calculateDailyUsage(dayPlan);
                
                return (
                  <td key={`${day}-${meal}`} className="p-2 border-r align-top h-32 relative group transition-colors hover:bg-white">
                    <div className="flex flex-col gap-1 h-full">
                      {entries.map(entry => {
                        const food = getFoodById(entry.foodId);
                        if (!food) return null;
                        return (
                          <div key={entry.id} className="group/item flex justify-between items-start bg-blue-50/50 p-1.5 rounded border border-blue-100 text-xs">
                            <span className="truncate w-full pr-1 font-medium text-blue-900" title={food.name}>{food.name}</span>
                            <button 
                              type="button"
                              onClick={() => onRemoveItem(day, meal, entry.id)}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                      <button 
                        type="button"
                        onClick={() => openPicker(day, meal, usage)}
                        className="mt-auto w-full py-1 text-center border border-dashed border-gray-300 rounded text-gray-400 hover:border-brand-400 hover:text-brand-500 hover:bg-brand-50 transition text-xs flex justify-center items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Agregar
                      </button>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mobile View: Day Tabs + Vertical List
  const renderMobile = () => {
    const dayData = plan[selectedDay];
    // Guard clause for mobile view safety
    if (!dayData) return null;
    
    const usage = calculateDailyUsage(dayData);

    return (
      <div className="lg:hidden">
        {/* Day Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
          {DAYS_OF_WEEK.map(day => (
            <button
              type="button"
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                ${selectedDay === day ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-gray-600 border'}`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Meal List */}
        <div className="space-y-4">
          {MEAL_TIMES.map(meal => (
            <div key={meal} className="bg-white p-4 rounded-xl border shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex justify-between items-center">
                {meal}
                <button 
                  type="button"
                  onClick={() => openPicker(selectedDay, meal, usage)}
                  className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded hover:bg-brand-100 flex items-center gap-1 border border-brand-200"
                >
                  <Plus className="w-3 h-3" /> Agregar
                </button>
              </h3>
              <div className="space-y-2">
                {!dayData[meal] || dayData[meal].length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Nada planificado</p>
                ) : (
                  dayData[meal].map(entry => {
                    const food = getFoodById(entry.foodId);
                    if (!food) return null;
                    return (
                      <div key={entry.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                        <div>
                          <span className="font-medium text-gray-900">{food.name}</span>
                          <span className="text-xs text-gray-500 block">{food.portion}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => onRemoveItem(selectedDay, meal, entry.id)}
                          className="text-gray-400 hover:text-red-500 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Plan Semanal</h2>
          <p className="text-gray-500 text-sm">Distribuye tus porciones según las restricciones diarias.</p>
        </div>
        <div className="flex gap-2">
           <button 
            type="button"
            onClick={onClear}
            className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition border border-transparent hover:border-red-200"
          >
            <Trash2 className="w-4 h-4" /> Limpiar Todo
          </button>
          <button 
            type="button"
            onClick={onAutoFill}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg shadow-sm hover:bg-brand-700 transition text-sm font-medium hover:shadow-md active:translate-y-0.5"
          >
            <Zap className="w-4 h-4" /> Generar Auto
          </button>
        </div>
      </div>

      {renderMobile()}
      {renderDesktop()}
    </div>
  );
};