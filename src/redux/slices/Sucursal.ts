import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Sucursal from '../../types/Sucursal';

interface IInitialState {
  sucursal: Sucursal[];
}

const initialState: IInitialState = {
    sucursal: [],
}

export const SucursalSlice = createSlice({
  name: 'sucursalState',
  initialState,
  reducers: {
    setSucursal: (state, action: PayloadAction<Sucursal[]>) => {
      state.sucursal = action.payload;
    },
    resetSucursal: (state) => {
      state.sucursal = [];
    }
  },
})

export const { setSucursal, resetSucursal } = SucursalSlice.actions;

export default SucursalSlice.reducer;