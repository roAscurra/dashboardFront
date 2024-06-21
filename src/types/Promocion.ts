import DataModel from "./DataModel";
import Imagen from "./Imagen";
import PromocionDetalle from "./PromocionDetalle";
import SucursalShorDto from "./dto/SucursalShortDto";
import { TipoPromocion } from "./enums/TipoPromocion";

interface Promocion extends DataModel<Promocion>{
  denominacion: string,
  fechaDesde: string,
  fechaHasta: string,
  horaDesde: string,
  horaHasta: string,
  descripcionDescuento: string,
  precioPromocional: number,
  tipoPromocion: TipoPromocion,
  imagenes: Imagen[],
  sucursales: SucursalShorDto[],
  promocionDetalle: PromocionDetalle[]
}
export default Promocion;
