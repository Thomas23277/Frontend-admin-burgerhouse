/**
 * Types del dominio — cada dominio tiene su propio archivo.
 *
 * Por compatibilidad, se re-exportan todos desde aquí.
 * Para imports nuevos, importar directamente desde el archivo de dominio:
 *   import type { Categoria } from '../types/categoria';
 */

export type { Categoria, CategoriaNested } from './categoria';
export type { Ingrediente, IngredienteNested } from './ingrediente';
export type { VarianteInput, Producto } from './producto';
export type { Usuario } from './usuario';
export type {
  PedidoDetalle, PedidoDetalleCreate,
  Pedido, PedidoCreateData,
} from './pedido';
export type { CloudinaryUploadResponse, CloudinaryDestroyResponse } from './cloudinary';
export type {
  EstadisticasTotales, PedidoPeriodoItem, PedidosPeriodoResponse,
  PlataformaMasVendida, TicketPromedio,
  RankingProductoItem, RankingProductosResponse,
  PedidoPorEstadoItem, PedidosPorEstadoResponse,
  IngresosResponse,
} from './estadistica';
