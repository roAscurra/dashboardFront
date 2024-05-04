import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Modal, Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface Content {
  url: string;
  title: string;
  content: string;
  verMasUrl: string; // Nueva propiedad para la URL del botón "Ver más"
}

const InicioCard: React.FC<{ content: Content }> = ({ content }) => {
  const { url, title, content: cardContent, verMasUrl } = content;
  const [showModal, setShowModal] = React.useState(false);
  const [image, setImage] = React.useState<File | null>(null);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const handleCancel = () => {
    handleCloseModal();
    setImage(null);
  };

  const handleCreate = () => {
    // Lógica para crear el elemento con el título, contenido e imagen seleccionada
    handleCloseModal();
    setImage(null);
  };

  return (
    <Card sx={{ maxWidth: 345, my: 2 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={url}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {cardContent}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={verMasUrl} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Utiliza la propiedad verMasUrl para construir el enlace */}
          <Button sx={{ color: '#FB6376' }} size="small">Ver más</Button>
        </Link>
        <Button sx={{ color: '#FB6376' }} size="small" onClick={handleOpenModal}>Crear</Button>
      </CardActions>

      {/* Modal para la creación */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Crear Nuevo Elemento
          </Typography>
          <TextField label="Título" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <TextField
            label="Descripcion"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton color="primary" component="label">
                    <PhotoCamera  sx={{ color: '#B19CD9' }} />
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" sx={{ bgcolor: '#B19CD9' }} onClick={handleCancel}>Cancelar</Button>
            <Button variant="contained" sx={{ bgcolor: '#B19CD9' }} onClick={handleCreate}>Crear</Button>
          </Box>
        </Box>
      </Modal>
    </Card>
  );
}

export default InicioCard;
