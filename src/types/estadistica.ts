export interface EstadisticasTotales {
  total_pedidos: number;
  total_productos: number;
  total_clientes: number;
  total_ingredientes: number;
  total_categorias: number;
}

export interface PedidoPeriodoItem {
  fecha: string;
  cantidad: number;
  total: number;
}

export interface PedidosPeriodoResponse {
  pedidos: PedidoPeriodoItem[];
}

export interface PlataformaMasVendida {
  producto_id: number;
  nombre: string;
  total_vendido: number;
}

export interface TicketPromedio {
  promedio: number;
  total_pedidos: number;
  ingresos_totales: number;
}

export interface RankingProductoItem {
  producto_id: number;
  nombre: string;
  total_vendido: number;
  ingresos: number;
}

export interface RankingProductosResponse {
  ranking: RankingProductoItem[];
}

export interface PedidoPorEstadoItem {
  estado: string;
  cantidad: number;
}

export interface PedidosPorEstadoResponse {
  pedidos: PedidoPorEstadoItem[];
}

export interface IngresosResponse {
  total_ingresos: number;
  cantidad_pedidos: number;
  promedio: number;
}
