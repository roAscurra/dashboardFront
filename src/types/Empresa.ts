import DataModel from "./DataModel";


interface Empresa extends DataModel<Empresa>{
    nombre: string;
    razonSocial: string;
    cuil: number;
    sucursal: string;
}

export default Empresa;