import React, { useMemo, useState } from 'react';
import { X, Check, Info, Pencil } from 'lucide-react';
import { FOOD_DATABASE } from '../data';
import { DailyUsage, FoodItem, FoodGroup } from '../types';

interface FoodPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: FoodItem) => void;
  currentUsage: DailyUsage;
  mealName: string;
  dayName: string;
  isEditMode?: boolean;
  foodGroups?: FoodGroup[];
}

export const FoodPicker: React.FC<FoodPickerProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentUsage,
  mealName,
  dayName,
  isEditMode = false,
  foodGroups
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  
  // Use custom food groups if provided, otherwise default
  const groups = foodGroups || FOOD_DATABASE;

  const groupStatus = useMemo(() => {
    return groups.map(group => {
      const used = currentUsage[group.name] || 0;
      const limit = group.maxDaily;
      const isFull = !isEditMode && limit !== 'Ilimitado' && used >= limit;
      return { ...group, used, isFull };
    });
  }, [currentUsage, isEditMode, groups]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              {isEditMode && <Pencil className="w-4 h-4 text-blue-600" />}
              {isEditMode ? 'Cambiar Alimento' : 'Agregar Alimento'}
            </h2>
            <p className="text-xs text-gray-500">{dayName} - {mealName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          
          {/* Group List */}
          <div className="w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            {groupStatus.map(group => (
              <button
                key={group.name}
                onClick={() => setSelectedGroup(group.name)}
                disabled={group.isFull}
                className={`w-full text-left p-2 border-b border-gray-100 transition text-sm
                  ${selectedGroup === group.name ? 'bg-white border-l-2 border-l-gray-800' : 'hover:bg-gray-100'}
                  ${group.isFull ? 'opacity-40 cursor-not-allowed' : ''}
                `}
              >
                <div className="font-medium text-gray-800 text-xs">{group.name}</div>
                <div className={`text-xs ${group.isFull ? 'text-red-500' : 'text-gray-500'}`}>
                  {group.used} / {group.maxDaily === 'Ilimitado' ? '∞' : group.maxDaily}
                </div>
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="w-2/3 overflow-y-auto p-3 bg-white">
            {!selectedGroup ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                <Info className="w-8 h-8 mb-2 opacity-40" />
                <p>Selecciona un grupo</p>
              </div>
            ) : (
              <div className="space-y-1">
                {groups.find(g => g.name === selectedGroup)?.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="w-full group text-left p-2 border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.portion}</div>
                        <div className="text-xs text-blue-600 mt-0.5">
                          {item.calories} kcal • P:{item.protein}g C:{item.carbs}g G:{item.fat}g
                        </div>
                        {item.notes && (
                          <div className="text-xs text-amber-600 mt-0.5">{item.notes}</div>
                        )}
                      </div>
                      <Check className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
