import { Dispatch, SetStateAction } from "react";

export const handleSearch = (
    query: string,
    data: any[],
    nombre: string, // Cambiado a string en lugar de any
    setData: Dispatch<SetStateAction<any[]>>
  ) => {
    const filter = data.filter((item) =>
      item[nombre].toLowerCase().includes(query.toLowerCase())
    );
    setData(filter);
  };