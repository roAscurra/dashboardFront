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

    setIsLoading(true); // Activar indicador de carga

    try {
      await imagenService.deleteImage(
        `${url}${urlParteVariable}`, // Concatenar la parte variable a la URL
        publicId,
        imagenId.toString(),
        await getAccessTokenSilently()
      );
      const updatedImages = sliderImages.filter((image) => image.id !== imagenId);
      setSliderImages(updatedImages);
      console.log('Imagen eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    } finally {
      setIsLoading(false); // Desactivar indicador de carga
    }
  };
  return (
    <>
      {isLoading && <Spinner className='text-center' animation="border" role="status" />}
      <Carousel style={{ visibility: isLoading ? 'hidden' : 'visible' }}> {/* Ocultar el Carousel mientras se carga */}
        {sliderImages.map((image) => (
          <Carousel.Item key={image.id}>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <img
                className="img-fluid"
                src={image.url}
                alt="Imagen del artículo"
                style={{ maxWidth: '100%', maxHeight: '80%', objectFit: 'contain' }} // Estilos para ajustar el tamaño de la imagen
              />
            </div>
            <Carousel.Caption>
              <Button
                variant="danger"
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
