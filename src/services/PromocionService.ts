import Promocion from "../types/Promocion";
import BackendClient from "./BackendClient";

export default class PromocionService extends BackendClient<Promocion> {
    public async promocionesSucursal(url: string, idSucursal: number, token: string): Promise<Promocion[]> {
        try {
          const path = `${url}promocion/sucursal/${idSucursal}`;
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
          return data as Promocion[];
        } catch (error) {
          console.error("Error al obtener los pedidos del cliente:", error);
          throw error;
        }
      }
}