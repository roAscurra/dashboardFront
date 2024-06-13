import DataModel from "../DataModel";


interface DomicilioShortDto extends DataModel<DomicilioShortDto>{
    calle: string;
    numero: number;
    cp: number;
    piso: number;
    nroDpto: number;
}

export default DomicilioShortDto;