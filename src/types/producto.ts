import type { CategoriaNested } from './categoria';
import type { IngredienteNested } from './ingrediente';

export interface VarianteInput {
  tipo: string;   // "talle" | "color"
  valor: string;  // "S" | "M" | "L"
  precio_adicional: number;
  stock: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  imagenes_url?: string;
  stock_cantidad: number;
  disponible: boolean;
  created_at: string;
  updated_at: string;
  categorias: CategoriaNested[];
  ingredientes: IngredienteNested[];
  variantes?: VarianteInput[];
}
