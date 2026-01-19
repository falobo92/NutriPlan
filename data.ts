import { FoodGroup } from './types';

export const FOOD_DATABASE: FoodGroup[] = [
  {
    name: 'Lácteos',
    maxDaily: 2,
    items: [
      { id: '1-1', group: 'Lácteos', name: 'Leche descremada', portion: '1 taza / 200 cc', notes: '' },
      { id: '1-2', group: 'Lácteos', name: 'Quesillo o queso fresco light', portion: '60 grs', notes: '' },
      { id: '1-3', group: 'Lácteos', name: 'Yogurt descremado', portion: '1 unidad', notes: '' },
      { id: '1-4', group: 'Lácteos', name: 'Leche cultivada', portion: '200 ml', notes: '' },
      { id: '1-5', group: 'Lácteos', name: 'Flan diet', portion: '1 unidad', notes: '' },
      { id: '1-6', group: 'Lácteos', name: 'Queso gauda o chanco', portion: '1 lámina', notes: 'Máximo 2 veces por semana' },
      { id: '1-7', group: 'Lácteos', name: 'Queso ricotta', portion: '2 cucharadas', notes: '' },
    ]
  },
  {
    name: 'Proteínas',
    maxDaily: 3,
    items: [
      { id: '2-1', group: 'Proteínas', name: 'Legumbres', portion: '3/4 taza', notes: 'Cocida' },
      { id: '2-2', group: 'Proteínas', name: 'Carne de vacuno', portion: '100 grs', notes: '' },
      { id: '2-3', group: 'Proteínas', name: 'Pollo pechuga', portion: '100 grs', notes: '' },
      { id: '2-4', group: 'Proteínas', name: 'Salmón', portion: '100 grs', notes: '' },
      { id: '2-5', group: 'Proteínas', name: 'Pescado', portion: '150 grs', notes: '' },
      { id: '2-6', group: 'Proteínas', name: 'Hamburguesa de soya', portion: '1 unidad', notes: '' },
      { id: '2-7', group: 'Proteínas', name: 'Atún o mariscos', portion: '1 tarro (125 grs)', notes: '' },
      { id: '2-8', group: 'Proteínas', name: 'Carne vegetal', portion: '1/2 taza', notes: 'Cruda' },
      { id: '2-9', group: 'Proteínas', name: 'Huevo', portion: '1 unidad', notes: 'No fritos (Total 2-3 al día)' },
    ]
  },
  {
    name: 'Verduras',
    maxDaily: 4,
    items: [
      { id: '3-1', group: 'Verduras', name: 'Tomate', portion: '1 unidad (120 grs)', notes: '' },
      { id: '3-2', group: 'Verduras', name: 'Zanahoria', portion: '1/2 taza', notes: 'Cruda' },
      { id: '3-3', group: 'Verduras', name: 'Cebolla', portion: '1/2 taza', notes: 'Cruda' },
      { id: '3-4', group: 'Verduras', name: 'Brócoli / Coliflor', portion: '3/4 taza', notes: 'Cocida' },
      { id: '3-5', group: 'Verduras', name: 'Espárragos', portion: '4 unidades', notes: '' },
      { id: '3-6', group: 'Verduras', name: 'Porotos verdes', portion: '1 taza', notes: 'Cocidos' },
      { id: '3-7', group: 'Verduras', name: 'Zapallito italiano', portion: '1 taza', notes: 'Cocido' },
      { id: '3-8', group: 'Verduras', name: 'Palmitos', portion: '4 unidades', notes: '' },
      { id: '3-9', group: 'Verduras', name: 'Zapallo camote', portion: '1/2 taza', notes: '' },
      { id: '3-10', group: 'Verduras', name: 'Betarraga y zanahoria', portion: '1/2 taza', notes: 'Cocida' },
      { id: '3-11', group: 'Verduras', name: 'Repollitos de Bruselas', portion: '4 unidades', notes: '' },
    ]
  },
  {
    name: 'Verduras (Libre)',
    maxDaily: 'Ilimitado',
    items: [
      { id: '4-1', group: 'Verduras (Libre)', name: 'Apio', portion: 'A gusto', notes: '' },
      { id: '4-2', group: 'Verduras (Libre)', name: 'Espinaca', portion: 'A gusto', notes: 'Cruda' },
      { id: '4-3', group: 'Verduras (Libre)', name: 'Berros', portion: 'A gusto', notes: '' },
      { id: '4-4', group: 'Verduras (Libre)', name: 'Lechuga', portion: 'A gusto', notes: '' },
      { id: '4-5', group: 'Verduras (Libre)', name: 'Rúcula', portion: 'A gusto', notes: '' },
      { id: '4-6', group: 'Verduras (Libre)', name: 'Repollo', portion: 'A gusto', notes: '' },
      { id: '4-7', group: 'Verduras (Libre)', name: 'Champiñones', portion: 'A gusto', notes: '' },
      { id: '4-8', group: 'Verduras (Libre)', name: 'Pimentón', portion: 'A gusto', notes: '' },
      { id: '4-9', group: 'Verduras (Libre)', name: 'Zapallito italiano', portion: 'A gusto', notes: '(Versión cruda o ensalada)' },
    ]
  },
  {
    name: 'Frutas',
    maxDaily: 2,
    items: [
      { id: '5-1', group: 'Frutas', name: 'Manzana', portion: '1/2 unidad', notes: '' },
      { id: '5-2', group: 'Frutas', name: 'Plátano', portion: '1/2 unidad', notes: '' },
      { id: '5-3', group: 'Frutas', name: 'Frutillas', portion: '1 taza', notes: '' },
      { id: '5-4', group: 'Frutas', name: 'Ciruelas', portion: '2 unidades', notes: '' },
      { id: '5-5', group: 'Frutas', name: 'Kiwis', portion: '2 unidades', notes: '' },
      { id: '5-6', group: 'Frutas', name: 'Naranja', portion: '1 unidad', notes: '' },
      { id: '5-7', group: 'Frutas', name: 'Sandía o melón', portion: '1 taza', notes: '' },
      { id: '5-8', group: 'Frutas', name: 'Durazno', portion: '1 unidad', notes: '' },
    ]
  },
  {
    name: 'Cereales/Farináceos',
    maxDaily: 2,
    items: [
      { id: '6-1', group: 'Cereales/Farináceos', name: 'Arroz', portion: '1/2 taza', notes: 'Cocido' },
      { id: '6-2', group: 'Cereales/Farináceos', name: 'Fideos', portion: '1/2 taza', notes: '' },
      { id: '6-3', group: 'Cereales/Farináceos', name: 'Quínoa', portion: '1/2 taza', notes: '' },
      { id: '6-4', group: 'Cereales/Farináceos', name: 'Choclo, arvejas, habas', portion: '1/2 taza', notes: '' },
      { id: '6-5', group: 'Cereales/Farináceos', name: 'Papas chicas', portion: '2 unidades', notes: '' },
    ]
  },
  {
    name: 'Pan y Galletas',
    maxDaily: 2,
    items: [
      { id: '7-1', group: 'Pan y Galletas', name: 'Pan de molde', portion: '2 rebanadas', notes: '' },
      { id: '7-2', group: 'Pan y Galletas', name: 'Pan integral a granel', portion: '50 grs', notes: '' },
      { id: '7-3', group: 'Pan y Galletas', name: 'Pan pita', portion: '1 unidad', notes: '' },
      { id: '7-4', group: 'Pan y Galletas', name: 'Galletas de salvado', portion: '6 unidades', notes: '' },
      { id: '7-5', group: 'Pan y Galletas', name: 'Avena', portion: '1/2 taza / 50 grs', notes: '' },
      { id: '7-6', group: 'Pan y Galletas', name: 'Cereal sin azúcar', portion: '3/4 taza / 30 grs', notes: 'Marcas: Fitness, Vivo, Enlínea' },
      { id: '7-7', group: 'Pan y Galletas', name: 'Fajita', portion: '1 unidad', notes: 'Tamaño L' },
    ]
  },
  {
    name: 'Aceites y Grasas',
    maxDaily: 4,
    items: [
      { id: '8-1', group: 'Aceites y Grasas', name: 'Aceite de oliva', portion: '2 cucharaditas', notes: '' },
      { id: '8-2', group: 'Aceites y Grasas', name: 'Palta', portion: '1/2 unidad', notes: '' },
      { id: '8-3', group: 'Aceites y Grasas', name: 'Almendras', portion: '25 unidades', notes: '' },
      { id: '8-4', group: 'Aceites y Grasas', name: 'Nueces', portion: '10 unidades', notes: '' },
      { id: '8-5', group: 'Aceites y Grasas', name: 'Aceitunas', portion: '11 unidades', notes: '' },
    ]
  }
];

// Helper to look up food by ID
export const getFoodById = (id: string) => {
  for (const group of FOOD_DATABASE) {
    const item = group.items.find(i => i.id === id);
    if (item) return item;
  }
  return null;
};
