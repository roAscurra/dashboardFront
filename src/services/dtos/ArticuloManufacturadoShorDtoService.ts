import ArticuloManufacturadoShorDto from "../../types/dto/ArticuloManufacturadoShorDto";
import BackendClient from "../BackendClient";


export default class ArticuloManufacturadoShorDtoService extends BackendClient<ArticuloManufacturadoShorDto> {
    public async manufacturados(url: string, idSucursal: number, token: string): Promise<ArticuloManufacturadoShorDto[]> {
        try {
          const path = `${url}articuloManufacturado/sucursal/${idSucursal}`;
          const response = await fetch(path, { method: "GET" ,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },});      
          if (!response.ok) {
            throw new Error(response.statusText);
          }
      
          const data = await response.json();
          return data as ArticuloManufacturadoShorDto[];
        } catch (error) {
          console.error("Error al obtener los pedidos del cliente:", error);
          throw error;
        }
    }
}