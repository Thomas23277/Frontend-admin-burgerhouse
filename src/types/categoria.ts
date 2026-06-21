export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  parent_id?: number | null;
  es_activa: boolean;
  es_principal?: boolean;
  subcategorias?: Categoria[];
}

export interface CategoriaNested {
  id: number;
  nombre: string;
  imagen_url?: string;
  es_principal: boolean;
}
