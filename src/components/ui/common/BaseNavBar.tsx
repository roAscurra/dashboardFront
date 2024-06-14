import { useEffect, useState } from 'react';
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
import Divider from '@mui/material/Divider';
import SucursalService from '../../../services/SucursalService';
import { useParams } from 'react-router-dom';
import {useAuth0} from "@auth0/auth0-react";

interface BaseNavBarProps {
  title: string;
}
export const BaseNavBar = ({ title }: BaseNavBarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleProfileMenuOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const url = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();
  const { sucursalId } = useParams(); // Obtén el ID de la URL
  const sucursalService = new SucursalService();
  const [sucursalName, setSucursalName] = useState(""); // Variable de estado para almacenar el nombre de la sucursal

  const handleLogin = () => {
    loginWithRedirect();
  }

  const handleLogout = () => {
    logout({
      logoutParams: {
        // returnTo: "https://dashboard-front-five.vercel.app/"
        returnTo: "https://localhost:5173/"
      }
    })
  }

  const fetchSucursalData = async () => {
      try {
          if (sucursalId) {
              const sucursal = await sucursalService.get(url + 'sucursal', sucursalId, await getAccessTokenSilently({}));
              setSucursalName(sucursal.nombre)
          }
      } catch (error) {
          console.error("Error al obtener los datos de la sucursal:", error);
      }
  };
  
  useEffect(() => {
      fetchSucursalData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sucursalId]); // Dependencia actualizada
    if(title === ''){
      title = `Sucursal ${sucursalName}`;
    }
  return (
    <Box sx={{ marginBottom: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#9c27b0", height: 80, marginBottom: 1, display: 'flex', justifyContent: 'center' }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, justifyContent: 'center' ,fontSize: '1.7rem' }}
          >
            {title}
          </Typography>
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
      <Dialog onClose={handleDialogClose} open={dialogOpen}>
        <DialogTitle>Opciones de Usuario</DialogTitle>
        <List>
          <ListItem hidden={!isAuthenticated} button>
            <ListItemIcon>
              <Person2OutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItem>
          <ListItem hidden={!isAuthenticated} button>
            <ListItemIcon>
              <SettingsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Ajustes" />
          </ListItem>
          <Divider />
          <ListItem onClick={handleLogin} hidden={isAuthenticated} button>
            <ListItemIcon>
              <LoginOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem onClick={handleLogout}  hidden={!isAuthenticated} button>
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
