// import IArticuloManufacturado from "./ArticuloManufacturado";
import DataModel from "./DataModel";
import ArticuloDto from "./dto/ArticuloDto";

interface PromocionDetalle extends DataModel<PromocionDetalle>{
  cantidad: number,
  articulo: ArticuloDto
}

export default PromocionDetalle;
