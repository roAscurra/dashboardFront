import DataModel from "../DataModel";


interface CategoriaShorDto extends DataModel<CategoriaShorDto>{
    eliminado: false,
    denominacion: string,
    esInsumo: false,
}

export default CategoriaShorDto;