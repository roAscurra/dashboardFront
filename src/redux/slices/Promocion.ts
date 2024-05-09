import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Promocion from '../../types/Promocion';

interface IInitialState {
  promocion: Promocion[]; // Cambia el tipo del estado a una matriz de Promocion
}

const initialState: IInitialState = {
    promocion: [],
}

export const promocionSlice = createSlice({
  name: 'promocionState',
  initialState,
  reducers: {
    setPromocion: (state, action: PayloadAction<Promocion[]>) => {
      state.promocion = action.payload;
    },
    resetPromocion: (state) => {
      state.promocion = [];
    }
  },
})

export const { setPromocion, resetPromocion } = promocionSlice.actions;

export default promocionSlice.reducer;
