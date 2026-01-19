import React, { useMemo, useState } from 'react';
import { X, Check, Info, AlertCircle } from 'lucide-react';
import { FOOD_DATABASE } from '../data';
import { DailyUsage, FoodItem } from '../types';

interface FoodPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: FoodItem) => void;
  currentUsage: DailyUsage;
  mealName: string;
  dayName: string;
}

export const FoodPicker: React.FC<FoodPickerProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentUsage,
  mealName,
  dayName
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Group status calculation
  const groupStatus = useMemo(() => {
    return FOOD_DATABASE.map(group => {
      const used = currentUsage[group.name] || 0;
      const limit = group.maxDaily;
      const isFull = limit !== 'Ilimitado' && used >= limit;
      return { ...group, used, isFull };
    });
  }, [currentUsage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Agregar Alimento</h2>
            <p className="text-sm text-gray-500">{dayName} - {mealName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Group List (Sidebar on desktop, Top bar on mobile) */}
          <div className="w-full md:w-1/3 border-r bg-gray-50 overflow-y-auto max-h-[30vh] md:max-h-full">
            {groupStatus.map(group => (
              <button
                key={group.name}
                onClick={() => setSelectedGroup(group.name)}
                disabled={group.isFull}
                className={`w-full text-left p-3 border-b transition flex justify-between items-center
                  ${selectedGroup === group.name ? 'bg-white border-l-4 border-l-brand-500 shadow-sm' : 'hover:bg-gray-100'}
                  ${group.isFull ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
                `}
              >
                <div>
                  <div className="font-medium text-sm text-gray-900">{group.name}</div>
                  <div className={`text-xs ${group.isFull ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    {group.used} / {group.maxDaily}
                  </div>
                </div>
                {group.isFull && <AlertCircle className="w-4 h-4 text-red-500" />}
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="w-full md:w-2/3 overflow-y-auto p-4 bg-white">
            {!selectedGroup ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Info className="w-12 h-12 mb-2 opacity-50" />
                <p>Selecciona un grupo para ver los alimentos permitidos.</p>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-lg mb-4 text-brand-700">{selectedGroup}</h3>
                <div className="space-y-2">
                  {FOOD_DATABASE.find(g => g.name === selectedGroup)?.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="w-full group text-left p-3 border rounded-lg hover:border-brand-500 hover:bg-brand-50 transition flex justify-between items-start"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-600">Porción: {item.portion}</div>
                        {item.notes && (
                          <div className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                            <Info className="w-3 h-3" /> {item.notes}
                          </div>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 text-brand-600">
                        <Check className="w-5 h-5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
