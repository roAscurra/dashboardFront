// import ArticuloInsumo from "./ArticuloInsumoType";
import DataModel from "./DataModel";
// import Imagen from "./Imagen";

interface Promocion extends DataModel<Promocion>{
  denominacion: "",
  fechaDesde: Date,
  fechaHasta: Date,
  descripcionDescuento: "",
  precioPromocional: ""
  }

  export default Promocion;
