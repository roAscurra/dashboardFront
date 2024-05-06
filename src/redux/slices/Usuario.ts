import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Usuario from '../../types/UsuarioTypes';

interface InitialState {
  usuarios: Usuario[]; // Cambia el tipo del estado a una matriz de Usuario
}

const initialState: InitialState = {
  usuarios: [],
}

export const usuariosSlice = createSlice({
  name: 'usuariosState',
  initialState,
  reducers: {
    setUsuarios: (state, action: PayloadAction<Usuario[]>) => {
      state.usuarios = action.payload;
    },
    resetUsuarios: (state) => {
      state.usuarios = [];
    }
  },
})

export const { setUsuarios, resetUsuarios } = usuariosSlice.actions;

export default usuariosSlice.reducer;
