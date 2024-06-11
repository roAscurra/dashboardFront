import React, { useState, ChangeEvent, FormEvent } from 'react';
import Button from '@mui/material/Button';
import ArticuloManufacturadoService from '../../../services/ArticuloManufacturadoService';
import {useAuth0} from "@auth0/auth0-react";

const SubirImagen: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [file, setFile] = useState<File | null>(null);
  const productoService = new ArticuloManufacturadoService();
  const url = import.meta.env.VITE_API_URL;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        console.error('No file selected');
        return;
      }

      const response = await productoService.uploadFile(url + 'articuloManufacturado/uploads', file, "1", await getAccessTokenSilently({}));

      console.log('Upload successful:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita que se recargue la página al enviar el formulario
    handleUpload(); // Llama a la función para manejar la subida de archivos
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2vh",
        padding: ".4rem",
      }}
    >
      <h5>Subir imagen</h5>
      <form onSubmit={handleSubmit}>
        {/* Campo de entrada de archivos */}
        <input
          type="file"
          onChange={handleFileChange}
          multiple
        />
        {/* Botón para subir imágenes */}
        <Button type="submit" variant="contained">
          Subir Imágenes
        </Button>
      </form>
    </div>
  );
};

export default SubirImagen;
