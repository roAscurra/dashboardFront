import Cliente from "./Cliente";
import DataModel from "./DataModel";
import DetallePedido from "./DetallePedido";
import Factura from "./Factura";
import SucursalShorDto from "./dto/SucursalShortDto";
import { Estado } from "./enums/Estado";
import { FormaPago } from "./enums/FormaPago";
import { TipoEnvio } from "./enums/TipoEnvio";

export default interface Pedido extends DataModel<Pedido> {
  id: number;
  eliminado: boolean;
  horaEstimadaFinalizacion: string;
  total: number;
  totalCosto: number;
  estado: Estado;
  tipoEnvio: TipoEnvio;
  formaPago: FormaPago;
  fechaPedido: Date;
  detallePedidos: DetallePedido[];
  sucursal: SucursalShorDto;
  factura: Factura;
  cliente: Cliente;
}
