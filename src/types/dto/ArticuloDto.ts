import DataModel from "../DataModel";
import Imagen from "../Imagen";
import IUnidadMedida from "../UnidadMedida";
import CategoriaShorDto from "./CategoriaShorDto";

export default interface ArticuloDto extends DataModel<ArticuloDto> {
  id: number;
  eliminado: boolean;
  denominacion: string;
  precioVenta: number;
  imagen: Imagen;
  unidadMedida: IUnidadMedida;
  precioCompra: number;
  stockActual: number;
  stockMaximo: number;
  categoria: CategoriaShorDto;
  tiempoEstimadoMinutos: number;
}
