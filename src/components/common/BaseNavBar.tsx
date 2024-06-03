import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import Divider from '@mui/material/Divider';
<<<<<<< refs/remotes/origin/coni:src/components/common/BaseNavBar.tsx
=======
import SucursalService from '../../../services/SucursalService';
import { useParams } from 'react-router-dom';
import { ShoppingCart } from '@mui/icons-material';
import ModalCarrito from '../Modal/Carrito/ModalCarrito';
import { toggleModal } from '../../../redux/slices/Modal';
import { useAppDispatch } from '../../../hooks/redux';
>>>>>>> local:src/components/ui/common/BaseNavBar.tsx

export default function PrimarySearchAppBar() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [carritoOpen, setCarritoOpen] = useState(false);

  const dispatch = useAppDispatch();

  const handleProfileMenuOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
<<<<<<< refs/remotes/origin/coni:src/components/common/BaseNavBar.tsx
=======

  const handleOpenCarrito = () => {
    dispatch(toggleModal({ modalName: "carrito" }));
  };

  const url = import.meta.env.VITE_API_URL;
  const { sucursalId } = useParams(); // Obtén el ID de la URL
  const sucursalService = new SucursalService();
  const [sucursalName, setSucursalName] = useState(""); // Variable de estado para almacenar el nombre de la sucursal
>>>>>>> local:src/components/ui/common/BaseNavBar.tsx

  return (
    <Box sx={{ marginBottom: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#b23e1f", height: 80, marginBottom: 1 }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, justifyContent: 'center' ,fontSize: '1.7rem' }}
          >
            <LunchDiningOutlinedIcon sx={{mr: 2}}/>
            Buen Sabor
          </Typography>
            <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            onClick={handleOpenCarrito}
            color="inherit"
          >
            <ShoppingCart />
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ModalCarrito modalName='carrito'></ModalCarrito>
      <Dialog onClose={handleDialogClose} open={dialogOpen}>
        <DialogTitle>Opciones de Usuario</DialogTitle>
        <List>
          <ListItem button>
            <ListItemIcon>
              <Person2OutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SettingsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Ajustes" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <LoginOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItem>
        </List>
      </Dialog>
    </Box>
  );
}
