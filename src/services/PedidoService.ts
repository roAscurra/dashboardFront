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

    async getRankingInsumos(url: string, token: string): Promise<any[][]> {
        const path = `${url}pedido/ranking/insumos/data`;
        console.log(path)
        const options: RequestInit = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        };
        return (this.request(path, options) as unknown) as any[][];
    }

    async getPedidosPorCliente(url: string, token: string): Promise<any[][]> {
        const path = `${url}pedido/ranking/pedidos/cliente/data`;
        console.log(path)
        const options: RequestInit = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        };
        return (this.request(path, options) as unknown) as any[][];
    }

    async getIngresos(url: string, token: string): Promise<any[][]> {
        const path = `${url}pedido/ranking/ingresos/data`;
        console.log(path)
        const options: RequestInit = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        };
        return (this.request(path, options) as unknown) as any[][];
    }

    async getGanancias(url: string, token: string): Promise<any[][]> {
        const path = `${url}pedido/ranking/ganancias/data`;
        console.log(path)
        const options: RequestInit = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        };
        return (this.request(path, options) as unknown) as any[][];
    }
}