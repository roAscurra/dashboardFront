import Cupones from "./Cupones";
import DataModel from "./DataModel";


interface Sucursal extends DataModel<Sucursal>{
    id: number;
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    // domicilio: Domicilio;
    // categorias: Categoria[];
    cupones: Cupones[];
    // promociones: Promocion[];
}

export default Sucursal;