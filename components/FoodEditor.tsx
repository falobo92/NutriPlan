import React, { useState } from 'react';
import { FoodGroup, FoodItem } from '../types';
import { Plus, Trash2, Save, RotateCcw, ChevronDown, ChevronRight, X } from 'lucide-react';

interface FoodEditorProps {
  foodGroups: FoodGroup[];
  onSave: (groups: FoodGroup[]) => void;
  onReset: () => void;
}

export const FoodEditor: React.FC<FoodEditorProps> = ({ foodGroups, onSave, onReset }) => {
  const [groups, setGroups] = useState<FoodGroup[]>(foodGroups);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ groupName: string; item: FoodItem } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

  const toggleGroup = (groupName: string) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  const updateItem = (groupName: string, itemId: string, updates: Partial<FoodItem>) => {
    setGroups(prev => prev.map(g => {
      if (g.name !== groupName) return g;
      return {
        ...g,
        items: g.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        )
      };
    }));
    setHasChanges(true);
  };

  const addItem = (groupName: string) => {
    const newItem: FoodItem = {
      id: generateId(),
      group: groupName,
      name: 'Nuevo alimento',
      portion: '1 porción',
      notes: '',
      calories: 100,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    
    setGroups(prev => prev.map(g => {
      if (g.name !== groupName) return g;
      return { ...g, items: [...g.items, newItem] };
    }));
    setEditingItem({ groupName, item: newItem });
    setHasChanges(true);
  };

  const deleteItem = (groupName: string, itemId: string) => {
    if (!confirm('¿Eliminar este alimento?')) return;
    
    setGroups(prev => prev.map(g => {
      if (g.name !== groupName) return g;
      return { ...g, items: g.items.filter(item => item.id !== itemId) };
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(groups);
    setHasChanges(false);
    alert('Cambios guardados');
  };

  const handleReset = () => {
    if (!confirm('¿Restaurar todos los alimentos predeterminados? Perderás tus personalizaciones.')) return;
    onReset();
    setHasChanges(false);
  };

  // Edit Modal
  const renderEditModal = () => {
    if (!editingItem) return null;
    const { groupName, item } = editingItem;

    const handleChange = (field: keyof FoodItem, value: string | number) => {
      setEditingItem({
        groupName,
        item: { ...item, [field]: value }
      });
    };

    const handleSaveItem = () => {
      updateItem(groupName, item.id, item);
      setEditingItem(null);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white w-full max-w-md p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Editar Alimento</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Porción</label>
              <input
                type="text"
                value={item.portion}
                onChange={(e) => handleChange('portion', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Calorías</label>
                <input
                  type="number"
                  value={item.calories}
                  onChange={(e) => handleChange('calories', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Prot (g)</label>
                <input
                  type="number"
                  value={item.protein}
                  onChange={(e) => handleChange('protein', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Carb (g)</label>
                <input
                  type="number"
                  value={item.carbs}
                  onChange={(e) => handleChange('carbs', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Grasa (g)</label>
                <input
                  type="number"
                  value={item.fat}
                  onChange={(e) => handleChange('fat', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Notas</label>
              <input
                type="text"
                value={item.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Opcional"
                className="w-full px-2 py-1.5 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => setEditingItem(null)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveItem}
              className="px-3 py-1.5 text-sm bg-gray-800 text-white hover:bg-gray-900"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Editor de Alimentos</h2>
          <p className="text-gray-500 text-sm">Personaliza los alimentos disponibles</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 bg-white hover:bg-gray-50 text-sm border border-gray-200"
          >
            <RotateCcw className="w-4 h-4" /> Restaurar
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm ${
              hasChanges 
                ? 'bg-gray-800 text-white hover:bg-gray-900' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>
      </div>

      {/* Groups Accordion */}
      <div className="space-y-2">
        {groups.map(group => (
          <div key={group.name} className="bg-white border border-gray-200">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.name)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2">
                {expandedGroup === group.name ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <span className="font-medium text-gray-800">{group.name}</span>
                <span className="text-xs text-gray-500">
                  ({group.items.length} items • máx {group.maxDaily === 'Ilimitado' ? '∞' : group.maxDaily}/día)
                </span>
              </div>
            </button>

            {/* Group Content */}
            {expandedGroup === group.name && (
              <div className="border-t border-gray-100">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 text-xs text-gray-600 font-medium">
                  <div className="col-span-4">Nombre</div>
                  <div className="col-span-3">Porción</div>
                  <div className="col-span-1 text-center">Kcal</div>
                  <div className="col-span-1 text-center">P</div>
                  <div className="col-span-1 text-center">C</div>
                  <div className="col-span-1 text-center">G</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Items */}
                {group.items.map(item => (
                  <div 
                    key={item.id} 
                    className="grid grid-cols-12 gap-2 px-3 py-2 border-t border-gray-50 hover:bg-gray-50 items-center text-sm cursor-pointer"
                    onClick={() => setEditingItem({ groupName: group.name, item })}
                  >
                    <div className="col-span-4 text-gray-800 truncate">{item.name}</div>
                    <div className="col-span-3 text-gray-600 text-xs truncate">{item.portion}</div>
                    <div className="col-span-1 text-center text-gray-600 text-xs">{item.calories}</div>
                    <div className="col-span-1 text-center text-gray-500 text-xs">{item.protein}</div>
                    <div className="col-span-1 text-center text-gray-500 text-xs">{item.carbs}</div>
                    <div className="col-span-1 text-center text-gray-500 text-xs">{item.fat}</div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(group.name, item.id);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add button */}
                <div className="p-2 border-t border-gray-100">
                  <button
                    onClick={() => addItem(group.name)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" /> Agregar alimento
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {renderEditModal()}
    </div>
  );
};
