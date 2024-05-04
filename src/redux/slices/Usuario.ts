import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  // Agrega otras propiedades del usuario si las tienes
}

interface UsuariosState {
  usuarios: Usuario[];
  // Agrega otros estados relacionados con los usuarios si los tienes
}

const initialState: UsuariosState = {
  usuarios: [],
  // Inicializa otros estados relacionados con los usuarios si los tienes
};

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState,
  reducers: {
    setUsuarios(state, action: PayloadAction<Usuario[]>) {
      state.usuarios = action.payload;
    },
    // Agrega otras reducers si es necesario
  },
});

export const { setUsuarios } = usuariosSlice.actions;

export default usuariosSlice.reducer;
