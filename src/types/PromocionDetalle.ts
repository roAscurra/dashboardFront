import IArticuloManufacturado from "./ArticuloManufacturado";
import DataModel from "./DataModel";

interface PromocionDetalle extends DataModel<PromocionDetalle>{
  cantidad: number,
  articulosManufacturados: IArticuloManufacturado[]
}

export default PromocionDetalle;
