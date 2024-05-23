import DataModel from "./DataModel";
import Sucursal from "./Sucursal";

interface Categoria extends DataModel<Categoria>{
    eliminado: false,
    denominacion: string,
    esInsumo: false,
    subCategorias: Categoria[],
    sucursales: Sucursal[]
}

export default Categoria;