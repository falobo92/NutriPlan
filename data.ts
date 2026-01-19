import { FoodGroup } from './types';

export const FOOD_DATABASE: FoodGroup[] = [
  {
    name: 'Lácteos',
    maxDaily: 2,
    items: [
      { id: '1-1', group: 'Lácteos', name: 'Leche descremada', portion: '1 taza / 200 cc', notes: '', calories: 90, protein: 8, carbs: 12, fat: 0.5 },
      { id: '1-2', group: 'Lácteos', name: 'Quesillo o queso fresco light', portion: '60 grs', notes: '', calories: 70, protein: 12, carbs: 2, fat: 2 },
      { id: '1-3', group: 'Lácteos', name: 'Yogurt descremado', portion: '1 unidad', notes: '', calories: 80, protein: 6, carbs: 12, fat: 0.5 },
      { id: '1-4', group: 'Lácteos', name: 'Leche cultivada', portion: '200 ml', notes: '', calories: 85, protein: 7, carbs: 11, fat: 1 },
      { id: '1-5', group: 'Lácteos', name: 'Flan diet', portion: '1 unidad', notes: '', calories: 60, protein: 4, carbs: 8, fat: 1 },
      { id: '1-6', group: 'Lácteos', name: 'Queso gauda o chanco', portion: '1 lámina', notes: 'Máximo 2 veces por semana', calories: 80, protein: 6, carbs: 0.5, fat: 6 },
      { id: '1-7', group: 'Lácteos', name: 'Queso ricotta', portion: '2 cucharadas', notes: '', calories: 55, protein: 4, carbs: 1, fat: 4 },
    ]
  },
  {
    name: 'Proteínas',
    maxDaily: 3,
    items: [
      { id: '2-1', group: 'Proteínas', name: 'Legumbres', portion: '3/4 taza', notes: 'Cocida', calories: 170, protein: 12, carbs: 30, fat: 1 },
      { id: '2-2', group: 'Proteínas', name: 'Carne de vacuno', portion: '100 grs', notes: '', calories: 150, protein: 26, carbs: 0, fat: 5 },
      { id: '2-3', group: 'Proteínas', name: 'Pollo pechuga', portion: '100 grs', notes: '', calories: 120, protein: 25, carbs: 0, fat: 2 },
      { id: '2-4', group: 'Proteínas', name: 'Salmón', portion: '100 grs', notes: '', calories: 180, protein: 22, carbs: 0, fat: 10 },
      { id: '2-5', group: 'Proteínas', name: 'Pescado', portion: '150 grs', notes: '', calories: 140, protein: 28, carbs: 0, fat: 3 },
      { id: '2-6', group: 'Proteínas', name: 'Hamburguesa de soya', portion: '1 unidad', notes: '', calories: 110, protein: 14, carbs: 8, fat: 3 },
      { id: '2-7', group: 'Proteínas', name: 'Atún o mariscos', portion: '1 tarro (125 grs)', notes: '', calories: 130, protein: 28, carbs: 0, fat: 1 },
      { id: '2-8', group: 'Proteínas', name: 'Carne vegetal', portion: '1/2 taza', notes: 'Cruda', calories: 90, protein: 18, carbs: 4, fat: 1 },
      { id: '2-9', group: 'Proteínas', name: 'Huevo', portion: '1 unidad', notes: 'No fritos (Total 2-3 al día)', calories: 75, protein: 6, carbs: 0.5, fat: 5 },
    ]
  },
  {
    name: 'Verduras',
    maxDaily: 4,
    items: [
      { id: '3-1', group: 'Verduras', name: 'Tomate', portion: '1 unidad (120 grs)', notes: '', calories: 22, protein: 1, carbs: 5, fat: 0 },
      { id: '3-2', group: 'Verduras', name: 'Zanahoria', portion: '1/2 taza', notes: 'Cruda', calories: 25, protein: 0.5, carbs: 6, fat: 0 },
      { id: '3-3', group: 'Verduras', name: 'Cebolla', portion: '1/2 taza', notes: 'Cruda', calories: 20, protein: 0.5, carbs: 5, fat: 0 },
      { id: '3-4', group: 'Verduras', name: 'Brócoli / Coliflor', portion: '3/4 taza', notes: 'Cocida', calories: 25, protein: 2, carbs: 4, fat: 0 },
      { id: '3-5', group: 'Verduras', name: 'Espárragos', portion: '4 unidades', notes: '', calories: 15, protein: 2, carbs: 2, fat: 0 },
      { id: '3-6', group: 'Verduras', name: 'Porotos verdes', portion: '1 taza', notes: 'Cocidos', calories: 35, protein: 2, carbs: 7, fat: 0 },
      { id: '3-7', group: 'Verduras', name: 'Zapallito italiano', portion: '1 taza', notes: 'Cocido', calories: 20, protein: 1.5, carbs: 4, fat: 0 },
      { id: '3-8', group: 'Verduras', name: 'Palmitos', portion: '4 unidades', notes: '', calories: 15, protein: 1.5, carbs: 2, fat: 0 },
      { id: '3-9', group: 'Verduras', name: 'Zapallo camote', portion: '1/2 taza', notes: '', calories: 40, protein: 1, carbs: 9, fat: 0 },
      { id: '3-10', group: 'Verduras', name: 'Betarraga y zanahoria', portion: '1/2 taza', notes: 'Cocida', calories: 35, protein: 1, carbs: 8, fat: 0 },
      { id: '3-11', group: 'Verduras', name: 'Repollitos de Bruselas', portion: '4 unidades', notes: '', calories: 30, protein: 2, carbs: 6, fat: 0 },
    ]
  },
  {
    name: 'Verduras (Libre)',
    maxDaily: 'Ilimitado',
    items: [
      { id: '4-1', group: 'Verduras (Libre)', name: 'Apio', portion: 'A gusto', notes: '', calories: 5, protein: 0.3, carbs: 1, fat: 0 },
      { id: '4-2', group: 'Verduras (Libre)', name: 'Espinaca', portion: 'A gusto', notes: 'Cruda', calories: 7, protein: 1, carbs: 1, fat: 0 },
      { id: '4-3', group: 'Verduras (Libre)', name: 'Berros', portion: 'A gusto', notes: '', calories: 4, protein: 0.8, carbs: 0.5, fat: 0 },
      { id: '4-4', group: 'Verduras (Libre)', name: 'Lechuga', portion: 'A gusto', notes: '', calories: 5, protein: 0.5, carbs: 1, fat: 0 },
      { id: '4-5', group: 'Verduras (Libre)', name: 'Rúcula', portion: 'A gusto', notes: '', calories: 5, protein: 0.5, carbs: 0.7, fat: 0 },
      { id: '4-6', group: 'Verduras (Libre)', name: 'Repollo', portion: 'A gusto', notes: '', calories: 8, protein: 0.5, carbs: 2, fat: 0 },
      { id: '4-7', group: 'Verduras (Libre)', name: 'Champiñones', portion: 'A gusto', notes: '', calories: 15, protein: 2, carbs: 2, fat: 0 },
      { id: '4-8', group: 'Verduras (Libre)', name: 'Pimentón', portion: 'A gusto', notes: '', calories: 10, protein: 0.5, carbs: 2, fat: 0 },
      { id: '4-9', group: 'Verduras (Libre)', name: 'Zapallito italiano', portion: 'A gusto', notes: '(Versión cruda o ensalada)', calories: 10, protein: 0.8, carbs: 2, fat: 0 },
    ]
  },
  {
    name: 'Frutas',
    maxDaily: 2,
    items: [
      { id: '5-1', group: 'Frutas', name: 'Manzana', portion: '1/2 unidad', notes: '', calories: 40, protein: 0, carbs: 10, fat: 0 },
      { id: '5-2', group: 'Frutas', name: 'Plátano', portion: '1/2 unidad', notes: '', calories: 50, protein: 0.6, carbs: 13, fat: 0 },
      { id: '5-3', group: 'Frutas', name: 'Frutillas', portion: '1 taza', notes: '', calories: 50, protein: 1, carbs: 12, fat: 0 },
      { id: '5-4', group: 'Frutas', name: 'Ciruelas', portion: '2 unidades', notes: '', calories: 45, protein: 0.5, carbs: 11, fat: 0 },
      { id: '5-5', group: 'Frutas', name: 'Kiwis', portion: '2 unidades', notes: '', calories: 85, protein: 1.5, carbs: 20, fat: 0.5 },
      { id: '5-6', group: 'Frutas', name: 'Naranja', portion: '1 unidad', notes: '', calories: 60, protein: 1, carbs: 15, fat: 0 },
      { id: '5-7', group: 'Frutas', name: 'Sandía o melón', portion: '1 taza', notes: '', calories: 45, protein: 0.6, carbs: 11, fat: 0 },
      { id: '5-8', group: 'Frutas', name: 'Durazno', portion: '1 unidad', notes: '', calories: 40, protein: 1, carbs: 10, fat: 0 },
    ]
  },
  {
    name: 'Cereales/Farináceos',
    maxDaily: 2,
    items: [
      { id: '6-1', group: 'Cereales/Farináceos', name: 'Arroz', portion: '1/2 taza', notes: 'Cocido', calories: 110, protein: 2, carbs: 24, fat: 0.2 },
      { id: '6-2', group: 'Cereales/Farináceos', name: 'Fideos', portion: '1/2 taza', notes: '', calories: 100, protein: 3.5, carbs: 20, fat: 0.5 },
      { id: '6-3', group: 'Cereales/Farináceos', name: 'Quínoa', portion: '1/2 taza', notes: '', calories: 110, protein: 4, carbs: 20, fat: 2 },
      { id: '6-4', group: 'Cereales/Farináceos', name: 'Choclo, arvejas, habas', portion: '1/2 taza', notes: '', calories: 80, protein: 3, carbs: 17, fat: 0.5 },
      { id: '6-5', group: 'Cereales/Farináceos', name: 'Papas chicas', portion: '2 unidades', notes: '', calories: 130, protein: 3, carbs: 30, fat: 0 },
    ]
  },
  {
    name: 'Pan y Galletas',
    maxDaily: 2,
    items: [
      { id: '7-1', group: 'Pan y Galletas', name: 'Pan de molde', portion: '2 rebanadas', notes: '', calories: 140, protein: 5, carbs: 26, fat: 2 },
      { id: '7-2', group: 'Pan y Galletas', name: 'Pan integral a granel', portion: '50 grs', notes: '', calories: 120, protein: 4, carbs: 22, fat: 1.5 },
      { id: '7-3', group: 'Pan y Galletas', name: 'Pan pita', portion: '1 unidad', notes: '', calories: 130, protein: 4.5, carbs: 25, fat: 1 },
      { id: '7-4', group: 'Pan y Galletas', name: 'Galletas de salvado', portion: '6 unidades', notes: '', calories: 110, protein: 3, carbs: 20, fat: 2.5 },
      { id: '7-5', group: 'Pan y Galletas', name: 'Avena', portion: '1/2 taza / 50 grs', notes: '', calories: 150, protein: 5, carbs: 27, fat: 3 },
      { id: '7-6', group: 'Pan y Galletas', name: 'Cereal sin azúcar', portion: '3/4 taza / 30 grs', notes: 'Marcas: Fitness, Vivo, Enlínea', calories: 110, protein: 3, carbs: 23, fat: 1 },
      { id: '7-7', group: 'Pan y Galletas', name: 'Fajita', portion: '1 unidad', notes: 'Tamaño L', calories: 100, protein: 3, carbs: 18, fat: 2 },
    ]
  },
  {
    name: 'Aceites y Grasas',
    maxDaily: 4,
    items: [
      { id: '8-1', group: 'Aceites y Grasas', name: 'Aceite de oliva', portion: '2 cucharaditas', notes: '', calories: 80, protein: 0, carbs: 0, fat: 9 },
      { id: '8-2', group: 'Aceites y Grasas', name: 'Palta', portion: '1/2 unidad', notes: '', calories: 120, protein: 1.5, carbs: 6, fat: 11 },
      { id: '8-3', group: 'Aceites y Grasas', name: 'Almendras', portion: '25 unidades', notes: '', calories: 170, protein: 6, carbs: 6, fat: 15 },
      { id: '8-4', group: 'Aceites y Grasas', name: 'Nueces', portion: '10 unidades', notes: '', calories: 180, protein: 4, carbs: 4, fat: 18 },
      { id: '8-5', group: 'Aceites y Grasas', name: 'Aceitunas', portion: '11 unidades', notes: '', calories: 60, protein: 0.5, carbs: 2, fat: 6 },
    ]
  }
];

// Helper to look up food by ID (uses custom foods if available)
export const getFoodById = (id: string, customGroups?: FoodGroup[]) => {
  const groups = customGroups || FOOD_DATABASE;
  for (const group of groups) {
    const item = group.items.find(i => i.id === id);
    if (item) return item;
  }
  return null;
};

// Load custom foods from localStorage
export const loadCustomFoods = (): FoodGroup[] | null => {
  try {
    const saved = localStorage.getItem('nutriplan_foods');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading custom foods:', e);
  }
  return null;
};

// Save custom foods to localStorage
export const saveCustomFoods = (groups: FoodGroup[]) => {
  localStorage.setItem('nutriplan_foods', JSON.stringify(groups));
};

// Clear custom foods
export const clearCustomFoods = () => {
  localStorage.removeItem('nutriplan_foods');
};
