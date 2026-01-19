import React, { useState, useEffect } from 'react';
import { WeeklyPlan, FoodItem, DailyUsage } from './types';
import { getEmptyWeek, generateRandomPlan, generateId } from './utils';
import { PlanGrid } from './components/PlanGrid';
import { FoodPicker } from './components/FoodPicker';
import { ShoppingList } from './components/ShoppingList';
import { CalendarDays, ShoppingCart, Leaf } from 'lucide-react';

function App() {
  const [view, setView] = useState<'planner' | 'shopping'>('planner');
  const [plan, setPlan] = useState<WeeklyPlan>(getEmptyWeek());
  
  // Picker Modal State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{ day: string; meal: string; usage: DailyUsage } | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nutriplan_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Simple validation to check if it has keys, otherwise reset
        if (Object.keys(parsed).length > 0) {
          setPlan(parsed);
        }
      } catch (e) {
        console.error("Failed to load plan", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('nutriplan_data', JSON.stringify(plan));
  }, [plan]);

  const handleAddItem = (item: FoodItem) => {
    if (!activeCell) return;
    const { day, meal } = activeCell;

    setPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: [...prev[day][meal as keyof typeof prev[typeof day]], { id: generateId(), foodId: item.id }]
      }
    }));
  };

  const handleRemoveItem = (day: string, meal: string, entryId: string) => {
    setPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: (prev[day][meal as keyof typeof prev[typeof day]] as any[]).filter((entry: any) => entry.id !== entryId)
      }
    }));
  };

  const handleAutoFill = () => {
    // Generate immediately to verify functionality
    const newPlan = generateRandomPlan();
    setPlan(newPlan);
  };

  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el plan semanal?')) {
      setPlan(getEmptyWeek());
    }
  };

  const openPicker = (day: string, meal: string, usage: DailyUsage) => {
    setActiveCell({ day, meal, usage });
    setPickerOpen(true);
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-brand-100 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-brand-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Nutri<span className="text-brand-600">Plan</span></h1>
          </div>
          
          <nav className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('planner')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${view === 'planner' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <CalendarDays className="w-4 h-4" /> Planificador
            </button>
            <button 
              onClick={() => setView('shopping')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${view === 'shopping' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ShoppingCart className="w-4 h-4" /> Lista de Compra
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'planner' ? (
          <PlanGrid 
            plan={plan}
            onAddItem={() => {}} 
            onRemoveItem={handleRemoveItem}
            onAutoFill={handleAutoFill}
            onClear={handleClear}
            openPicker={openPicker}
          />
        ) : (
          <ShoppingList 
            plan={plan} 
            onBack={() => setView('planner')}
          />
        )}
      </main>

      {/* Modal */}
      {activeCell && (
        <FoodPicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleAddItem}
          currentUsage={activeCell.usage}
          dayName={activeCell.day}
          mealName={activeCell.meal}
        />
      )}
    </div>
  );
}

export default App;