import { useState, useEffect } from 'react';
import ArticuloManufacturadoService from '../../../services/ArticuloManufacturadoService.ts';
import CuponesService from '../../../services/CuponesService';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import * as icon from "@coreui/icons";
import CIcon from '@coreui/icons-react';


const productoService = new ArticuloManufacturadoService();
const cuponesService = new CuponesService();

const Estadisticas = () => {
  const heig = { height: '24px', paddingRight: '10px' };
  const url = import.meta.env.VITE_API_URL;
  const [totalProductos, setTotalProductos] = useState<number>(0);
  const [denominacionesProductos, setDenominacionesProductos] = useState<string[]>([]);
  const [totalCupones, setTotalCupones] = useState<number>(0);
  const [denominacionesCupones, setDenominacionesCupones] = useState<string[]>([]);
  const [totalArticulosInsumos, setTotalArticulosInsumos] = useState<number>(0);
  const [denominacionesArticulosInsumos, setDenominacionesArticulosInsumos] = useState<string[]>([]);
  const [totalCategorias, setTotalCategorias] = useState<number>(0);
  const [denominacionesCategorias, setDenominacionCategoria] = useState<string[]>([]);

  useEffect(() => {
    const obtenerDatosProductos = async () => {
      try {
        const productos = await productoService.getAll(url + 'articulosManufacturados');
        const totalProductos = productos.length;
        const nombresProductos = productos.map(producto => producto.denominacion);
        setTotalProductos(totalProductos);
        setDenominacionesProductos(nombresProductos);
      } catch (error) {
        console.error("Error al obtener los artículos manufacturados:", error);
      }
    };

     const obtenerDatosCupones = async () => {
      try {
        const cupones = await cuponesService.getAll(url + 'cupones');
        const totalCupones = cupones.length;
        const nombresCupones = cupones.map(cupon => cupon.denominacion);
        setTotalCupones(totalCupones);
        setDenominacionesCupones(nombresCupones);
      } catch (error) {
        console.error("Error al obtener los cupones:", error);
      }
    };

     const obtenerArticulosInsumos = async () => {
      try {
        const articulosInsumos = await cuponesService.getAll(url + 'articulosInsumos');
        const totalArticulosInsumos = articulosInsumos.length;
        const nombresArticulosInsumos = articulosInsumos.map(articuloInsumo => articuloInsumo.denominacion);
        setTotalArticulosInsumos(totalArticulosInsumos);
        setDenominacionesArticulosInsumos(nombresArticulosInsumos);
      } catch (error) {
        console.error("Error al obtener los artículos insumos:", error);
      }
    };

     const obtenerCategorias = async () => {
      try {
        const categorias = await cuponesService.getAll(url + 'categorias');
        const totalCategorias = categorias.length;
        const nombresCategorias = categorias.map(categoria => categoria.denominacion);
        setTotalCategorias(totalCategorias);
        setDenominacionCategoria(nombresCategorias);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
      
    };
    

    obtenerCategorias();
    obtenerArticulosInsumos();
    obtenerDatosProductos();
    obtenerDatosCupones();
  }, []);
  

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Card style={{ backgroundColor: '#9c27b0', color: "#ffff" }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              <CIcon customClassName="nav-icon" icon={icon.cilPizza} style={heig} />
              Total de Productos: {totalProductos}
            </Typography>
            <Typography color="textLight">
              {denominacionesProductos.map((denominacion, index) => (
                <li key={index}>{denominacion}</li>
              ))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card style={{ backgroundColor: '#9c27b0', color: "#ffff" }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              <CIcon customClassName="nav-icon" icon={icon.cilTag} style={heig} />
              Cupones Disponibles: { totalCupones }
            </Typography>
            <Typography color="textLight">
              {denominacionesCupones.map((denominacion, index) => (
                <li key={index}>{denominacion}</li>
              ))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card style={{ backgroundColor: '#9c27b0', color: "#ffff" }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              <CIcon customClassName="nav-icon" icon={icon.cilLineStyle} style={heig} />
              Insumos Disponibles: { totalArticulosInsumos }
            </Typography>
            <Typography color="textLight">
              {denominacionesArticulosInsumos.map((denominacion, index) => (
                <li key={index}>{denominacion}</li>
              ))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card style={{ backgroundColor: '#9c27b0', color: "#ffff" }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              <CIcon customClassName="nav-icon" icon={icon.cilLibrary} style={heig} />
              Categorias: { totalCategorias }
            </Typography>
            <Typography color="textLight">
              {denominacionesCategorias.map((denominacion, index) => (
                <li key={index}>{denominacion}</li>
              ))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
export default Estadisticas;