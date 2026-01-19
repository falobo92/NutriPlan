import React, { useMemo, useState, useEffect } from 'react';
import { X, Check, Search, Plus } from 'lucide-react';
import { FOOD_DATABASE, getGroupColor } from '../data';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState<string | null>(null);
  
  // Use custom food groups if provided, otherwise default
  const groups = foodGroups || FOOD_DATABASE;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedGroup(null);
      setAddedItems(new Set());
    }
  }, [isOpen]);

  // Hide toast after 2 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const groupStatus = useMemo(() => {
    return groups.map(group => {
      const used = currentUsage[group.name] || 0;
      const limit = group.maxDaily;
      const isFull = !isEditMode && limit !== 'Ilimitado' && used >= limit;
      const colors = getGroupColor(group.name);
      return { ...group, used, isFull, colors };
    });
  }, [currentUsage, isEditMode, groups]);

  // Search results across all groups
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase().trim();
    const results: { item: FoodItem; group: typeof groupStatus[0] }[] = [];
    
    groupStatus.forEach(group => {
      if (group.isFull) return;
      
      group.items.forEach(item => {
        if (
          item.name.toLowerCase().includes(query) ||
          item.portion.toLowerCase().includes(query) ||
          item.notes?.toLowerCase().includes(query)
        ) {
          results.push({ item, group });
        }
      });
    });
    
    return results;
  }, [searchQuery, groupStatus]);

  const handleAddItem = (item: FoodItem, groupName: string) => {
    onSelect(item);
    setAddedItems(prev => new Set(prev).add(item.id));
    setShowToast(item.name);
    
    // If in edit mode, close after selecting
    if (isEditMode) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const renderFoodItem = (item: FoodItem, group: typeof groupStatus[0]) => {
    const isAdded = addedItems.has(item.id);
    const colors = group.colors;
    
    return (
      <button
        key={item.id}
        onClick={() => handleAddItem(item, group.name)}
        className={`w-full group text-left p-3 rounded-lg border-2 transition-all duration-200
          ${isAdded 
            ? `${colors.bg} ${colors.border} scale-[0.98]` 
            : `bg-white border-gray-100 hover:${colors.bgLight} hover:${colors.border}`
          }
        `}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${colors.bg} ${colors.border} border`}></span>
              <span className="font-medium text-gray-800 text-sm truncate">{item.name}</span>
              {isAdded && (
                <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">Agregado</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 ml-4">{item.portion}</div>
            <div className="text-xs text-gray-600 mt-1 ml-4 flex flex-wrap gap-2">
              <span className="font-medium">{item.calories} kcal</span>
              <span className="text-gray-400">|</span>
              <span>P:{item.protein}g</span>
              <span>C:{item.carbs}g</span>
              <span>G:{item.fat}g</span>
            </div>
            {item.notes && (
              <div className="text-xs text-amber-600 mt-1 ml-4">{item.notes}</div>
            )}
          </div>
          <div className={`p-1 rounded-full transition-all ${isAdded ? 'bg-green-500' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
            {isAdded ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Plus className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-xl shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">
                {isEditMode ? 'Cambiar Alimento' : 'Agregar Alimento'}
              </h2>
              <p className="text-sm text-gray-500">{dayName} - {mealName}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title="Cerrar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alimento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          
          {/* Group List - hidden when searching */}
          {!searchQuery && (
            <div className="w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
              {groupStatus.map(group => {
                const colors = group.colors;
                return (
                  <button
                    key={group.name}
                    onClick={() => setSelectedGroup(group.name)}
                    disabled={group.isFull}
                    className={`w-full text-left p-3 border-b border-gray-100 transition-all
                      ${selectedGroup === group.name 
                        ? `bg-white border-l-4 ${colors.border.replace('border-', 'border-l-')}` 
                        : 'border-l-4 border-l-transparent hover:bg-white'
                      }
                      ${group.isFull ? 'opacity-40 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${colors.bg} ${colors.border} border`}></span>
                      <span className={`font-medium text-sm ${selectedGroup === group.name ? colors.text : 'text-gray-700'}`}>
                        {group.name}
                      </span>
                    </div>
                    <div className={`text-xs mt-1 ml-5 ${group.isFull ? 'text-red-500' : 'text-gray-500'}`}>
                      {group.used} / {group.maxDaily === 'Ilimitado' ? '∞' : group.maxDaily} porciones
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Items List */}
          <div className={`${searchQuery ? 'w-full' : 'w-2/3'} overflow-y-auto p-4 bg-white`}>
            {searchQuery ? (
              // Search Results
              searchResults && searchResults.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-3">
                    {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{searchQuery}"
                  </p>
                  {searchResults.map(({ item, group }) => renderFoodItem(item, group))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                  <Search className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">No se encontraron alimentos</p>
                  <p className="text-xs mt-1">Intenta con otro término</p>
                </div>
              )
            ) : !selectedGroup ? (
              // No group selected
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 opacity-40" />
                </div>
                <p className="text-sm font-medium">Selecciona un grupo</p>
                <p className="text-xs mt-1">o busca un alimento arriba</p>
              </div>
            ) : (
              // Group items
              <div className="space-y-2">
                {groupStatus.find(g => g.name === selectedGroup)?.items.map(item => {
                  const group = groupStatus.find(g => g.name === selectedGroup)!;
                  return renderFoodItem(item, group);
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer with added count */}
        {addedItems.size > 0 && (
          <div className="p-3 border-t border-gray-200 bg-green-50 flex justify-between items-center">
            <span className="text-sm text-green-700">
              {addedItems.size} alimento{addedItems.size !== 1 ? 's' : ''} agregado{addedItems.size !== 1 ? 's' : ''}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              Listo
            </button>
          </div>
        )}

        {/* Toast notification */}
        {showToast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg toast-enter">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">{showToast} agregado</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
