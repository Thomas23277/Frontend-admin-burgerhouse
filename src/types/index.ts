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

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_adicional: number;
  imagen_url?: string;
  disponible: boolean;
  alergeno?: boolean;
}

export interface CategoriaNested {
  id: number;
  nombre: string;
  imagen_url?: string;
  es_principal: boolean;
}

export interface IngredienteNested {
  id: number;
  nombre: string;
  precio_adicional: number;
  imagen_url?: string;
  alergeno?: boolean;
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
}

export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  rol: string;
  created_at: string;
}

export interface PedidoDetalle {
  id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  nombre_producto?: string;
  notas?: string;
}

/** Datos mínimos para crear un detalle de pedido (sin id ni precio, se generan en backend) */
export interface PedidoDetalleCreate {
  producto_id: number;
  cantidad: number;
  notas?: string;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  estado: string;
  total: number;
  usuario_nombre?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
  detalles: PedidoDetalle[];
}

/** Datos para crear un pedido (lo que envía el frontend) */
export interface PedidoCreateData {
  usuario_id: number;
  detalles: PedidoDetalleCreate[];
  notas?: string;
}
