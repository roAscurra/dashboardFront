import DataModel from "./DataModel";

interface IUnidadMedida extends DataModel<IUnidadMedida> {
    id: number;
    denominacion: string;
}

export default IUnidadMedida;