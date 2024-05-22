import DataModel from "./DataModel";


interface Empresa extends DataModel<Empresa>{
    id: number;
    eliminado: boolean;
    nombre: string;
    razonSocial: string;
    cuil: number;
}

export default Empresa;