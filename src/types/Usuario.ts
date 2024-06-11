import DataModel from "./DataModel";

interface Usuario  extends DataModel<Usuario>{
    id: number;
    username: string;
    email: string;
    rol: string;
  }
  
  export default Usuario