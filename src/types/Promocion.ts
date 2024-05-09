import ArticuloInsumo from "./ArticuloInsumoType";
import DataModel from "./DataModel";
import Imagen from "./Imagen";

interface Promociones extends DataModel<Promociones>{
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

  export default Promociones;