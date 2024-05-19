import { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Add } from '@mui/icons-material';
import SearchBar from '../../ui/SearchBar/SearchBar';
import CategoriaService from '../../../services/CategoriaService';
import CategoriaLista from "./CategoriaLista";
import ModalCategoria from '../../ui/Modal/Categoria/ModalCategoria.tsx';
import ModalEliminarCategoria from '../../ui/Modal/Categoria/ModalEliminarCategoria.tsx';
import ICategoria from "../../../types/Categoria";
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setCategoria } from '../../../redux/slices/Categoria';
import {handleSearch} from "../../../utils.ts/utils.ts";

const Categoria = () => {
    const url = import.meta.env.VITE_API_URL;
    const categoriaService = new CategoriaService();

    const dispatch = useAppDispatch();
    const [filteredData, setFilterData] = useState<ICategoria[]>([]);
    const globalCategorias = useAppSelector(
        (state) => state.categoria.data
    );
    const [selectedCategoria, setSelectedCategoria] = useState<ICategoria | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [eliminarModalOpen, setEliminarModalOpen] = useState(false);


    const fetchCategorias = useCallback(async () => {
        try {
            const categorias = await categoriaService.getAll(url + 'categorias');
            dispatch(setCategoria(categorias));
            setFilterData(categorias);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    }, [dispatch, categoriaService, url])


    useEffect(() => {
        fetchCategorias();
        onSearch(''); // Llamada a onSearch para filtrar los datos iniciales
    }, []);



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

    const onSearch = (query: string) => {
        handleSearch(query, globalCategorias, setFilterData);
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
                            bgcolor: "#cc5533",
                            '&:hover': {
                                bgcolor: "#b23e1f",
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
                    <SearchBar onSearch={onSearch} />
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
