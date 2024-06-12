import Pedido from "../types/Pedido";
import { Estado } from "../types/enums/Estado";
import BackendClient from "./BackendClient";

export default class PedidoService extends BackendClient<Pedido> {

  async cambiarEstado(url: string, pedidoId: string, nuevoEstado: Estado, token: string): Promise<Pedido> {
    const path = `${url}/${pedidoId}/estado?nuevoEstado=${nuevoEstado}`;
    console.log(path)
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
    };
    return this.request(path, options);
  }

  async getPedidosFiltrados(url: string, rol: string, token: string): Promise<Pedido[]> {
    const path = `${url}/filtrado?rol=${rol}`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
    };
    console.log(`GET Request to: ${path}`);
    return this.requestAll(path, options);
  }

  
}
