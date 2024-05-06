import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Usuario from '../../types/UsuarioTypes';

interface InitialState {
  usuario: Usuario[]; // Cambia el tipo del estado a una matriz de Usuario
}

const initialState: InitialState = {
  usuario: [],
}

export const usuariosSlice = createSlice({
  name: 'usuarioState',
  initialState,
  reducers: {
    setUsuario: (state, action: PayloadAction<Usuario[]>) => {
      state.usuario = action.payload;
    },
    resetUsuario: (state) => {
      state.usuario = [];
    }
  },
})

export const { setUsuario, resetUsuario } = usuariosSlice.actions;

export default usuariosSlice.reducer;
