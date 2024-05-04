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
    setSucursal: (state, action: PayloadAction<Cupones[]>) => {
      state.cupones = action.payload;
    },
    resetCupones: (state) => {
      state.cupones = [];
    }
  },
})

export const { setSucursal, resetCupones } = cuponesSlice.actions;

export default cuponesSlice.reducer;