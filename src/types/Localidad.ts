import DataModel from "./DataModel";
import Provincia from "./Provincia";

interface Localidad extends DataModel<Localidad>{
  eliminado: boolean;
  nombre: string;
  provincia: Provincia
  }

  export default Localidad;
