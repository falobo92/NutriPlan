import React, { useMemo } from 'react';
import { WeeklyPlan } from '../types';
import { FOOD_DATABASE, getFoodById } from '../data';
import { Download, Printer, ArrowLeft } from 'lucide-react';

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

    return Object.values(list).sort((a, b) => {
      if (a.group !== b.group) return a.group.localeCompare(b.group);
      return a.name.localeCompare(b.name);
    });
  }, [plan]);

  // Group items by food group
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof aggregatedList> = {};
    aggregatedList.forEach(item => {
      if (!groups[item.group]) {
        groups[item.group] = [];
      }
      groups[item.group].push(item);
    });
    return groups;
  }, [aggregatedList]);

  const generateTextContent = () => {
    let text = 'LISTA DE COMPRAS - NutriPlan\n';
    text += '================================\n\n';
    
    FOOD_DATABASE.forEach(group => {
      const items = groupedItems[group.name];
      if (!items || items.length === 0) return;
      
      text += `${group.name.toUpperCase()}:\n`;
      items.forEach(item => {
        text += `[ ] ${item.name} (${item.count}x ${item.portion})\n`;
      });
      text += '\n';
    });
    
    return text;
  };

  const exportToTxt = () => {
    const text = generateTextContent();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-compras-nutriplan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const text = generateTextContent();
    navigator.clipboard.writeText(text);
    alert('Lista copiada al portapapeles');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header - hidden on print */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 print:hidden">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Lista de Compras</h2>
          <p className="text-gray-500 text-sm">Basado en tu plan semanal</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={exportToTxt} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 bg-white hover:bg-gray-50 text-sm border border-gray-200"
          >
            <Download className="w-4 h-4" /> Exportar TXT
          </button>
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 bg-white hover:bg-gray-50 text-sm border border-gray-200"
          >
            <Printer className="w-4 h-4" /> Imprimir
          </button>
          <button 
            onClick={onBack} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white hover:bg-gray-900 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center mb-3">
        <h1 className="text-lg font-bold">Lista de Compras - NutriPlan</h1>
      </div>

      {aggregatedList.length === 0 ? (
        <div className="text-center py-12 text-gray-400 print:hidden">
          <p>No hay alimentos en tu plan aún.</p>
          <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
            Ir al planificador
          </button>
        </div>
      ) : (
        <>
          {/* Screen view - simple grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:hidden">
            {FOOD_DATABASE.map(group => {
              const items = groupedItems[group.name];
              if (!items || items.length === 0) return null;

              return (
                <div key={group.name} className="bg-white border border-gray-200 p-3">
                  <h3 className="font-medium text-gray-700 text-sm mb-2 pb-1 border-b border-gray-100">
                    {group.name}
                  </h3>
                  <ul className="space-y-1">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-500 text-xs">
                          {item.count}x
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Print view - 3 columns, minimal */}
          <div className="hidden print:block shopping-print">
            {FOOD_DATABASE.map(group => {
              const items = groupedItems[group.name];
              if (!items || items.length === 0) return null;

              return (
                <div key={group.name} className="group-section mb-3">
                  <h3 className="font-bold text-xs uppercase border-b border-gray-400 mb-1 pb-0.5">
                    {group.name}
                  </h3>
                  <ul className="text-xs">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex gap-1">
                        <span className="shrink-0">☐</span>
                        <span>{item.name}</span>
                        <span className="text-gray-600 ml-auto">({item.count}x {item.portion})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
