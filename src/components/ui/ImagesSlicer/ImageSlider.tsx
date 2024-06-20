import { useState } from 'react';
import { Button, Carousel, Spinner } from 'react-bootstrap';
import ImagenArticuloService from '../../../services/ImagenArticuloService';
import { useAuth0 } from '@auth0/auth0-react';

interface Image {
  id: number;
  url: string;
}

interface ImageSliderProps {
  images: Image[];
  urlParteVariable: string; // Nueva prop para la parte variable de la URL
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, urlParteVariable }) => {
  const [sliderImages, setSliderImages] = useState<Image[]>(images);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar la carga
  const imagenService = new ImagenArticuloService();
  const { getAccessTokenSilently } = useAuth0();
  const url = import.meta.env.VITE_API_URL;

  const handleDeleteImage = async (publicId: string, imagenId: number) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar esta imagen?'
    );
    if (!confirmDelete) return;
  
    setIsLoading(true); // Establecer isLoading a true antes de comenzar la eliminación
  
    try {
      // Realizar eliminación de imagen
      await imagenService.deleteImage(
        `${url}${urlParteVariable}`, // Concatenar la parte variable a la URL
        publicId,
        imagenId.toString(),
        await getAccessTokenSilently()
      );
  
      // Verificar si queda una sola imagen antes de eliminarla
      if (sliderImages.length === 1) {
        // Si queda una sola imagen, no permitir eliminarla y mostrar un mensaje
        alert("No puedes eliminar la última imagen.");
        return;
      }
  
      // Actualizar el estado después de eliminar la imagen
      const updatedImages = sliderImages.filter((image) => image.id !== imagenId);
      setSliderImages(updatedImages);
      console.log('Imagen eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    } finally {
      setIsLoading(false); // Establecer isLoading a false después de completar la operación, ya sea exitosa o con error
    }
  };
  
  
  return (
    <>
      {isLoading && (
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '150px' }}>
          <Spinner animation="border" role="status" />
        </div>
      )}
      <Carousel 
      prevIcon={<span className="carousel-control-prev-icon" />}
      nextIcon={<span className="carousel-control-next-icon" />}>
        {sliderImages.map((image) => (
          <Carousel.Item key={image.url}>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
              <img
                className="img-fluid"
                src={image.url}
                alt="Imagen del artículo"
                style={{ maxWidth: '100%', maxHeight: '80%', objectFit: 'contain' }}
              />
            </div>
            <br />
            <Carousel.Caption>
              <Button
                variant="danger"
                className='text-light'
                size="sm"
                onClick={() => handleDeleteImage(image.url, image.id)}
              >
                Eliminar
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};


export default ImageSlider;
