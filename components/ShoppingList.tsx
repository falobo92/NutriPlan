import React, { useMemo } from 'react';
import { WeeklyPlan } from '../types';
import { FOOD_DATABASE, getFoodById } from '../data';
import { ShoppingBag, Copy, Printer } from 'lucide-react';

interface ShoppingListProps {
  plan: WeeklyPlan;
  onBack: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ plan, onBack }) => {
  
  const aggregatedList = useMemo(() => {
    const list: Record<string, { name: string, portion: string, group: string, count: number }> = {};

    Object.values(plan).forEach(day => {
      Object.values(day).forEach(mealItems => {
        mealItems.forEach(entry => {
          const item = getFoodById(entry.foodId);
          if (item) {
            if (!list[item.id]) {
              list[item.id] = {
                name: item.name,
                portion: item.portion,
                group: item.group,
                count: 0
              };
            }
            list[item.id].count++;
          }
        });
      });
    });

    // Sort by group then name
    return Object.values(list).sort((a, b) => {
      if (a.group !== b.group) return a.group.localeCompare(b.group);
      return a.name.localeCompare(b.name);
    });
  }, [plan]);

  const copyToClipboard = () => {
    const text = aggregatedList.map(item => 
      `[ ] ${item.name} (${item.count} x ${item.portion})`
    ).join('\n');
    navigator.clipboard.writeText(`Mi Lista de Compras - NutriPlan:\n\n${text}`);
    alert('Lista copiada al portapapeles');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-2xl my-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4 gap-4">
        <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <ShoppingBag className="w-8 h-8 text-brand-500" />
            Lista de Compras Semanal
            </h2>
            <p className="text-gray-500 mt-1">Basado en tu planificación actual</p>
        </div>
        <div className="flex gap-2">
            <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
                <Copy className="w-4 h-4" /> Copiar
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
                <Printer className="w-4 h-4" /> Imprimir
            </button>
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium">
                Volver
            </button>
        </div>
      </div>

      {aggregatedList.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No hay alimentos en tu plan aún.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
            {FOOD_DATABASE.map(group => {
                const groupItems = aggregatedList.filter(i => i.group === group.name);
                if (groupItems.length === 0) return null;

                return (
                    <div key={group.name} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-brand-700 mb-3 uppercase text-xs tracking-wider">{group.name}</h3>
                        <ul className="space-y-2">
                            {groupItems.map((item, idx) => (
                                <li key={idx} className="flex justify-between items-start text-sm">
                                    <span className="text-gray-800 font-medium">{item.name}</span>
                                    <span className="text-gray-500 text-right text-xs bg-white px-2 py-1 rounded border">
                                        {item.count} x {item.portion}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}
        </div>
      )}
    </div>
  );
};