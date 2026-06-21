export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_adicional: number;
  imagen_url?: string;
  disponible: boolean;
  alergeno?: boolean;
}

export interface IngredienteNested {
  id: number;
  nombre: string;
  precio_adicional: number;
  imagen_url?: string;
  alergeno?: boolean;
}
