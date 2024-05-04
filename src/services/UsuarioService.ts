import axios from 'axios';

// Define la interfaz del servicio de usuario
interface UsuarioService {
  getAll: (url: string) => Promise<any[]>;
  // Otras operaciones de servicio si las tienes
}

// Implementa la clase del servicio de usuario que implementa la interfaz UsuarioService
class UsuarioServiceImpl implements UsuarioService {
  async getAll(url: string): Promise<any[]> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error}`);
    }
  }
  // Implementa otras operaciones de servicio aquí si las tienes
}

// Exporta una instancia de la clase del servicio de usuario
const usuarioService = new UsuarioServiceImpl();
export default usuarioService;
