import { configureStore } from "@reduxjs/toolkit";
import TablaReducer from "./slices/TablaReducer";
import articuloManufacturadoSlice from "./slices/ArticuloManufacturado";
import usuariosSlice from "./slices/Usuario"; // Importamos el nuevo slice de usuarios
import modal from "./slices/Modal";
import { PromocionSlice } from './slices/Promocion';


export const store = configureStore({
  reducer: {
    tablaReducer: TablaReducer,
    articuloManufacturado: articuloManufacturadoSlice,
    usuarios: usuariosSlice, // Agregamos el nuevo slice de usuarios al estado global con la clave usuarios
    modal: modal,
    promocion: PromocionSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
