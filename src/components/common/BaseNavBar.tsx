import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';

interface LinkItem {
  title: string;
  to: string;
}

interface BaseNavBarProps {
  links: LinkItem[];
}

const BaseNavBar: React.FC<BaseNavBarProps> = ({ links }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {links.map((link, index) => (
        <MenuItem key={index} onClick={handleMenuClose}>
          <Link to={link.to}>{link.title}</Link>
        </MenuItem>
      ))}
      <Divider />
      <MenuItem onClick={handleMenuClose}>
        <Link to="/logout">Cerrar Sesión</Link>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ marginBottom: 2 }}> {/* Ajusta el margen inferior */}
      <AppBar position="static" sx={{ bgcolor: '#B19CD9', height: 80, marginBottom: 1 }}> {/* Ajusta la altura y el margen inferior */}
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontSize: '2rem' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Buen Sabor</Link>
          </Typography>
          <IconButton
            size="small"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};

export default BaseNavBar;
