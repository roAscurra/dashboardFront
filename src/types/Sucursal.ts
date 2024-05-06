import DataModel from "./DataModel";


interface Sucursal extends DataModel<Sucursal>{
    id: number;
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    
}

export default Sucursal;