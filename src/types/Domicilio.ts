import DataModel from "./DataModel";
import Localidad from "./Localidad";


interface Domicilio extends DataModel<Domicilio>{
    eliminado: boolean;
    calle: string;
    numero: number;
    cp: number;
    piso: number;
    nroDpto: number;
    localidad: Localidad;
}

export default Domicilio;