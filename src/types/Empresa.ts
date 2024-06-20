import DataModel from "./DataModel";
import Imagen from "./Imagen";


interface Empresa extends DataModel<Empresa>{
    nombre: string;
    razonSocial: string;
    cuil: number;
    imagenes: Imagen [];
}

export default Empresa;