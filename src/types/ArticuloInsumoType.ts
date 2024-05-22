import DataModel from "./DataModel";
import ImagenArticulo from "./ImagenArticulo";
import UnidadMedida from "./UnidadMedida";

interface IArticuloInsumo extends DataModel<IArticuloInsumo>{
    id: number;
    denominacion: string;
    precioVenta: number;
    imagenes: ImagenArticulo [];
    unidadMedida: UnidadMedida;
    precioCompra: number;
    stockActual: number;
    stockMaximo: number;
    esParaElaborar: boolean;
}

export default IArticuloInsumo;