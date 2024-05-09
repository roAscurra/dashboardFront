import DataModel from "./DataModel";
import Imagen from "./Imagen";
import UnidadMedida from "./UnidadMedida";

interface IArticuloInsumo extends DataModel<IArticuloInsumo>{
    id: number;
    denominacion: string;
    precioVenta: number;
    imagenes: Imagen [];
    unidadMedida: UnidadMedida;
    precioCompra: number;
    stockActual: number;
    stockMaximo: number;
    esParaElaborar: boolean;
}

export default IArticuloInsumo;