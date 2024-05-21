import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

const SubirImagen: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

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

      const formData = new FormData();
      formData.append('uploads', file);
      formData.append('id', "1"); // Reemplaza '1' con el ID de la empresa correspondiente

      const response = await axios.post('http://localhost:8080/empresa/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload successful:', response.data);
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
