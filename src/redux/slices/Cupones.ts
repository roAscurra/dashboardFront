import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Cupones from '../../types/Cupones';

interface IInitialState {
  cupones: { [key: number]: Cupones[] }; // Cambia el tipo del estado a un objeto de Cupones[]
}

const initialState: IInitialState = {
    cupones: {},
}

export const cuponesSlice = createSlice({
  name: 'cuponesState',
  initialState,
  reducers: {
    setCupones: (state, action: PayloadAction<{ [key: number]: Cupones[] }>) => {
      state.cupones = action.payload;
    },
    resetCupones: (state) => {
      state.cupones = {};
    }
  },
})

export const { setCupones, resetCupones } = cuponesSlice.actions;

export default cuponesSlice.reducer;
