import DataModel from "../DataModel";


interface CategoriaShorDto extends DataModel<CategoriaShorDto>{
    denominacion: string,
    esInsumo: false,
}

export default CategoriaShorDto;