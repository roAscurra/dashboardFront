import { configureStore } from "@reduxjs/toolkit";
import TablaReducer from "./slices/TablaReducer";
import articuloManufacturadoSlice from "./slices/ArticuloManufacturado";
import usuariosSlice from "./slices/Usuario"; // Importamos el nuevo slice de usuarios

export const store = configureStore({
  reducer: {
    tablaReducer: TablaReducer,
    articuloManufacturado: articuloManufacturadoSlice,
    usuarios: usuariosSlice, // Agregamos el nuevo slice de usuarios al estado global con la clave usuarios
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
