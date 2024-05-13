import DataModel from "./DataModel";


interface Sucursal extends DataModel<Sucursal>{
    denominacion: string;
    horarioApertura: Date;
    horarioCierre: Date;
    sucursal: string;
    
}

export default Sucursal;