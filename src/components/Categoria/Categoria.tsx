import { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Add } from '@mui/icons-material';
import SearchBar from '../SearchBar/SearchBar';
import CategoriaService from '../../services/CategoriaService';
import CategoriaLista from "./CategoriaLista";
import ModalCategoria from '../Modal/ModalCategoria';
import ModalEliminarCategoria from '../Modal/ModalEliminarCategoria';
import ICategoria from "../../types/Categoria";
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setCategoria } from '../../redux/slices/Categoria';

const Categoria = () => {
    const url = import.meta.env.VITE_API_URL;
    const categoriaService = new CategoriaService();

    const dispatch = useAppDispatch();
    const [filteredData, setFilteredData] = useState<ICategoria[]>([]);
    const globalCategorias = useAppSelector(
        (state) => state.categoria.categoria
    );
    const [selectedCategoria, setSelectedCategoria] = useState<ICategoria | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [eliminarModalOpen, setEliminarModalOpen] = useState(false);


    const fetchCategorias = useCallback(async () => {
        try {
            const categorias = await categoriaService.getAll(url + 'categorias');
            dispatch(setCategoria(categorias));
            setFilteredData(categorias);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    }, [dispatch, categoriaService, url])


    useEffect(() => {
        fetchCategorias();
    }), [fetchCategorias];

    const handleSearch = (query: string) => {
        const filtered = globalCategorias.filter((categoria: ICategoria) =>
            categoria.denominacion.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleEditarCategoria = (categoria: ICategoria) => {
        setSelectedCategoria(categoria);
        setModalOpen(true);
    };

    const handleAgregarCategoria = () => {
        setSelectedCategoria(null);
        setModalOpen(true);

    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleEliminarCategoria = (categoria: ICategoria) => {
        setSelectedCategoria(categoria);
        setModalOpen(false);
        setEliminarModalOpen(true);
    };

    const handleEliminar = async () => {
        try {
            if (selectedCategoria && selectedCategoria.id) {
                await categoriaService.delete(url + 'categorias', selectedCategoria.id.toString());
                console.log('Se ha eliminado correctamente.');
                handleCloseModal(); // Cerramos el modal después de eliminar
            } else {
                console.error('No se puede eliminar la categoría porque no se proporcionó un ID válido.');
            }
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, my: 2 }}>
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        Categorías
                    </Typography>
                    <Button
                        sx={{
                            bgcolor: '#fb6376',
                            '&:hover': {
                                bgcolor: '#d73754',
                            },
                        }}
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAgregarCategoria}
                    >
                        Categoría
                    </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <SearchBar onSearch={handleSearch} />
                </Box>
                <CategoriaLista categorias={filteredData} onEditar={handleEditarCategoria} onDelete={handleEliminarCategoria} />
                <ModalCategoria open={modalOpen} onClose={handleCloseModal} getCategories={() => fetchCategorias()} categoryToEdit={selectedCategoria} />
                <ModalEliminarCategoria
                    show={eliminarModalOpen}
                    categoria={selectedCategoria}
                    onDelete={() => {
                        setEliminarModalOpen(false);
                        handleEliminar();
                    }
                    }
                    onClose={() => setEliminarModalOpen(false)}
                />
            </Container>
        </Box>
    );
};


export default Categoria;
