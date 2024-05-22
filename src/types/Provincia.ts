import DataModel from "./DataModel";
import Pais from "./Pais";

interface Provincia extends DataModel<Provincia>{
  eliminado: boolean;
  nombre: "";
  pais: Pais;
  }

  export default Provincia;
