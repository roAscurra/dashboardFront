import DataModel from "./DataModel";

interface Promocion extends DataModel<Promocion>{
  denominacion: "",
  fechaDesde: Date,
  fechaHasta: Date,
  descripcionDescuento: "",
  precioPromocional: ""
  }

  export default Promocion;
