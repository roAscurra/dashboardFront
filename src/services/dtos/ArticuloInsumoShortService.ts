import ArticuloInsumoShortDto from "../../types/dto/ArticuloInsumoShortDto";
import BackendClient from "../BackendClient";


export default class ArticuloInsumoShortService extends BackendClient<ArticuloInsumoShortDto> {
    public async insumosParaElaborar(url: string, idSucursal: number, token: string): Promise<ArticuloInsumoShortDto[]> {
        try {
          const path = `${url}articuloInsumo/elaborar/${idSucursal}`;
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
          return data as ArticuloInsumoShortDto[];
        } catch (error) {
          console.error("Error al obtener los pedidos del cliente:", error);
          throw error;
        }
    }
    public async insumos(url: string, idSucursal: number, token: string): Promise<ArticuloInsumoShortDto[]> {
        try {
          const path = `${url}articuloInsumo/sucursal/${idSucursal}`;
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
          return data as ArticuloInsumoShortDto[];
        } catch (error) {
          console.error("Error al obtener los pedidos del cliente:", error);
          throw error;
        }
    }
}