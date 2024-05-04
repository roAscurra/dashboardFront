import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Cupones from '../../types/Cupones';

interface IInitialState {
  cupones: Cupones[];
}

const initialState: IInitialState = {
    cupones: [],
}

export const cuponesSlice = createSlice({
  name: 'sucursalesState',
  initialState,
  reducers: {
    setCupones: (state, action: PayloadAction<Cupones[]>) => {
      state.cupones = action.payload;
    },
    resetCupones: (state) => {
      state.cupones = [];
    }
  },
})

export const { setCupones, resetCupones } = cuponesSlice.actions;

export default cuponesSlice.reducer;