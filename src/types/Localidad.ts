import DataModel from "./DataModel";

interface Localidad extends DataModel<Localidad>{
  denominacion: "",
  fechaDesde: Date,
  fechaHasta: Date,
  descripcionDescuento: "",
  precioPromocional: ""
  }

  export default Localidad;
