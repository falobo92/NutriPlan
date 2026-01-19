import React, { useState, useEffect } from 'react';
import { WeeklyPlan, FoodItem, DailyUsage, DAYS_OF_WEEK, FoodGroup, MealTime, PlanEntry } from './types';
import { getEmptyWeek, generateRandomPlan, generateId } from './utils';
import { PlanGrid } from './components/PlanGrid';
import { FoodPicker } from './components/FoodPicker';
import { ShoppingList } from './components/ShoppingList';
import { CalorieSummary } from './components/CalorieSummary';
import { FoodEditor } from './components/FoodEditor';
import { FOOD_DATABASE, loadCustomFoods, saveCustomFoods, clearCustomFoods } from './data';
import { CalendarDays, ShoppingCart, Settings } from 'lucide-react';

type ViewType = 'planner' | 'shopping' | 'editor';

function App() {
  const [view, setView] = useState<ViewType>('planner');
  const [plan, setPlan] = useState<WeeklyPlan>(getEmptyWeek());
  const [selectedDay, setSelectedDay] = useState<string>(DAYS_OF_WEEK[0]);
  const [foodGroups, setFoodGroups] = useState<FoodGroup[]>(FOOD_DATABASE);
  
  // Picker Modal State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{ day: string; meal: string; usage: DailyUsage; editEntryId?: string } | null>(null);

  // Load data on mount
  useEffect(() => {
    // Load plan
    const savedPlan = localStorage.getItem('nutriplan_data');
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        if (Object.keys(parsed).length > 0) {
          setPlan(parsed);
        }
      } catch (e) {
        console.error("Failed to load plan", e);
      }
    }
    
    // Load custom foods
    const customFoods = loadCustomFoods();
    if (customFoods) {
      setFoodGroups(customFoods);
    }
  }, []);

  // Save plan to localStorage
  useEffect(() => {
    localStorage.setItem('nutriplan_data', JSON.stringify(plan));
  }, [plan]);

  const handleAddItem = (item: FoodItem) => {
    if (!activeCell) return;
    const { day, meal, editEntryId } = activeCell;
    const mealKey = meal as MealTime;

    if (editEntryId) {
      setPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [mealKey]: prev[day][mealKey].map((entry: PlanEntry) => 
            entry.id === editEntryId ? { id: entry.id, foodId: item.id } : entry
          )
        }
      }));
    } else {
      setPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [mealKey]: [...prev[day][mealKey], { id: generateId(), foodId: item.id }]
        }
      }));
    }
  };

  const handleRemoveItem = (day: string, meal: string, entryId: string) => {
    const mealKey = meal as MealTime;
    setPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealKey]: prev[day][mealKey].filter((entry: PlanEntry) => entry.id !== entryId)
      }
    }));
  };

  const handleAutoFill = () => {
    const newPlan = generateRandomPlan();
    setPlan(newPlan);
  };

  const handleClear = () => {
    if (window.confirm('¿Borrar todo el plan semanal?')) {
      setPlan(getEmptyWeek());
    }
  };

  const openPicker = (day: string, meal: string, usage: DailyUsage) => {
    setActiveCell({ day, meal, usage });
    setPickerOpen(true);
  };

  const openEditPicker = (day: string, meal: string, entryId: string, usage: DailyUsage) => {
    setActiveCell({ day, meal, usage, editEntryId: entryId });
    setPickerOpen(true);
  };

  const handleSaveFoods = (groups: FoodGroup[]) => {
    setFoodGroups(groups);
    saveCustomFoods(groups);
  };

  const handleResetFoods = () => {
    setFoodGroups(FOOD_DATABASE);
    clearCustomFoods();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-12 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">NutriPlan</h1>
          
          <nav className="flex gap-1">
            <button 
              onClick={() => setView('planner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition ${
                view === 'planner' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Plan
            </button>
            <button 
              onClick={() => setView('shopping')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition ${
                view === 'shopping' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="w-4 h-4" /> Compras
            </button>
            <button 
              onClick={() => setView('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition ${
                view === 'editor' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-4 h-4" /> Alimentos
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-4">
        {view === 'planner' && (
          <div className="space-y-4">
            {/* Day selector */}
            <div className="flex overflow-x-auto gap-1.5 pb-1 no-scrollbar print:hidden">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1 text-sm whitespace-nowrap transition border ${
                    selectedDay === day 
                      ? 'bg-gray-800 text-white border-gray-800' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Calorie Summary - compact */}
            <CalorieSummary plan={plan} selectedDay={selectedDay} />

            {/* Plan Grid */}
            <PlanGrid 
              plan={plan}
              onRemoveItem={handleRemoveItem}
              onAutoFill={handleAutoFill}
              onClear={handleClear}
              openPicker={openPicker}
              onEditItem={openEditPicker}
            />
          </div>
        )}

        {view === 'shopping' && (
          <ShoppingList 
            plan={plan} 
            onBack={() => setView('planner')}
          />
        )}

        {view === 'editor' && (
          <FoodEditor
            foodGroups={foodGroups}
            onSave={handleSaveFoods}
            onReset={handleResetFoods}
          />
        )}
      </main>

      {/* Food Picker Modal */}
      {activeCell && (
        <FoodPicker
          isOpen={pickerOpen}
          onClose={() => {
            setPickerOpen(false);
            setActiveCell(null);
          }}
          onSelect={handleAddItem}
          currentUsage={activeCell.usage}
          dayName={activeCell.day}
          mealName={activeCell.meal}
          isEditMode={!!activeCell.editEntryId}
          foodGroups={foodGroups}
        />
      )}
    </div>
  );
}

export default App;
