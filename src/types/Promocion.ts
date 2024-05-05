import ArticuloInsumo from "./ArticuloInsumo";
import DataModel from "./DataModel";
import Imagen from "./Imagen";

interface Promocion extends DataModel<Promocion>{
    denominacion: string;
    fechaDesde: string;
    fechaHasta: string;
    horaDesde: string;
    horaHasta: string;
    descripcionDescuento: string;
    precioPromocional: number;
    tipoPromocion: string;
    articulos: ArticuloInsumo[];
    imagen: Imagen[];
  }

  export default Promocion;