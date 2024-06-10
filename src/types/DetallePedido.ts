// import Pedido from "./Pedido";
import DataModel from "./DataModel";
import ArticuloDto from "./dto/ArticuloDto";

export default interface DetallePedido extends DataModel<DetallePedido> {
  id: number;
  eliminado: boolean;
  cantidad: number;
  subTotal: number;
  articulo: ArticuloDto;
}
