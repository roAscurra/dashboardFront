import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import ArticuloInsumo from '../../types/ArticuloInsumoType';

interface InitialState {
  ArticuloInsumo: ArticuloInsumo[]; 
}

const initialState: InitialState = {
    ArticuloInsumo: [],
}

export const ArticulosInsumoSlice = createSlice({
  name: 'ArticuloInsumoState',
  initialState,
  reducers: {
    setArticuloInsumo: (state, action: PayloadAction<ArticuloInsumo[]>) => {
       state.ArticuloInsumo = action.payload;
    },
    resetUsuario: (state) => {
      state.ArticuloInsumo = [];
    }
  },
})

export const { setArticuloInsumo, resetUsuario } = ArticulosInsumoSlice.actions;

export default ArticulosInsumoSlice.reducer;
