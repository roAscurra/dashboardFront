import React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import Categoria from '../../../types/Categoria';

interface CategoriaListaProps {
    categorias: Categoria[];
    onEditar: (categoria: Categoria) => void;
    onDelete: (categoria: Categoria) => void;
}

const CategoriaLista: React.FC<CategoriaListaProps> = ({ categorias, onEditar, onDelete }) => {
    const [openMap, setOpenMap] = React.useState<{ [key: number]: boolean }>({});
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [selectedCategoria, setSelectedCategoria] = React.useState<Categoria | null>(null);
  
    const handleClick = (id: number) => {
      setOpenMap((prevOpenMap) => ({
        ...prevOpenMap,
        [id]: !prevOpenMap[id],
      }));
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      setSelectedCategoria(null);
    };
  
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, categoria: Categoria) => {
      setAnchorEl(event.currentTarget);
      setSelectedCategoria(categoria);
    };
  
    const handleEditar = () => {
      onEditar(selectedCategoria as Categoria); // Asegurar que selectedCategoria no sea null
      handleMenuClose();
    };
  
    const handleEliminar = () => {
      onDelete(selectedCategoria as Categoria);
      handleMenuClose();
    };
  
    const renderCategoria = (categoria: Categoria) => {
      const isOpen = openMap[categoria.id] || false;
      const tieneSubcategorias = categoria.subCategorias && categoria.subCategorias.length > 0;
  
      return (
        <React.Fragment key={categoria.id}>
          <ListItemButton onClick={() => handleClick(categoria.id)}>
            <ListItemText primary={categoria.denominacion} />
            <IconButton
              aria-label="more"
              aria-controls="categoria-menu"
              aria-haspopup="true"
              onClick={(event) => handleMenuOpen(event, categoria)}
            >
              <MoreVertIcon />
            </IconButton>
            {tieneSubcategorias && (isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
          </ListItemButton>
          {tieneSubcategorias && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categoria.subCategorias.map((subcategoria) => (
                  <ListItemButton key={subcategoria.id} sx={{ pl: 4 }}>
                    <ListItemText primary={subcategoria.denominacion} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    };
  
    return (
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Categorías
          </ListSubheader>
        }
      >
        {categorias.map((categoria) => renderCategoria(categoria))}
        <Menu
          id="categoria-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditar}>Editar</MenuItem>
          <MenuItem onClick={handleEliminar}>Eliminar</MenuItem>
        </Menu>
      </List>
    );
  };
  
  export default CategoriaLista;
  
