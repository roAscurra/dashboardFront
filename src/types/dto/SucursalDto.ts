import DataModel from "../DataModel";
import DomicilioShortDto from "./DomicilioShortDto";


interface SucursalDto extends DataModel<SucursalDto>{
    nombre: string;
    domicilio: DomicilioShortDto;
}

export default SucursalDto;