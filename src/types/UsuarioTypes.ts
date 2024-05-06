import DataModel from "./DataModel";

interface Usuario  extends DataModel<Usuario>{
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
  }
  
  export default Usuario