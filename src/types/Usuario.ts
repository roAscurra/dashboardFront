import DataModel from "./DataModel";

interface Usuario extends DataModel<Usuario> {
    id: number;
    username: string;
    email: string;
    rol: string;

    empleado: {
        tipoEmpleado: string;
        sucursal: {
            id: number;
        };
    };
}

export default Usuario;
