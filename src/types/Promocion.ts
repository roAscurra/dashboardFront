// import ArticuloInsumo from "./ArticuloInsumoType";
import DataModel from "./DataModel";
// import Imagen from "./Imagen";

interface Promociones extends DataModel<Promociones>{
  id: 0,
  denominacion: "",
  fechaDesde: Date,
  fechaHasta: Date,
  descripcionDescuento: "",
  precioPromocional: ""
  }

  export default Promociones;
