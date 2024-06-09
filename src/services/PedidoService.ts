import Pedido from "../types/Pedido";
import { Estado } from "../types/enums/Estado";
import BackendClient from "./BackendClient";

export default class PedidoService extends BackendClient<Pedido> {

    async cambiarEstado(url: string, pedidoId: string, nuevoEstado: Estado): Promise<Pedido> {
        const path = `${url}/${pedidoId}/estado?nuevoEstado=${nuevoEstado}`;
        console.log(path)
        const options: RequestInit = {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        return this.request(path, options);
      }
}