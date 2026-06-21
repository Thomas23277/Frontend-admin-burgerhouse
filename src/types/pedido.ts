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
