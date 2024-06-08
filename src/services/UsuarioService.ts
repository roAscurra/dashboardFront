
import Usuario from "../types/Usuario.ts";
import BackendClient from "./BackendClient";

export default class UsuarioService extends BackendClient<Usuario> {

    public async getByEmail(path: string, options: RequestInit): Promise<Usuario | undefined> {
        try {
            const response = await fetch(path, options);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        } catch (error) {
            return undefined
        }
    }

}