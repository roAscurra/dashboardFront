import { useState, useEffect } from 'react';
import ProductoService from '../../services/ProductoService';
import CuponesService from '../../services/CuponesService';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import * as icon from "@coreui/icons";
import CIcon from '@coreui/icons-react';

const productoService = new ProductoService();
const cuponesService = new CuponesService();

const Estadisticas = () => {
  const heig = { height: '24px', paddingRight: '10px' }; // Define el estilo de altura con el padding-right ajustado
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
        // Obtener la lista de productos
        const productos = await productoService.getAll(url + 'articulosManufacturados');
        // Calcular el total de productos
        const totalProductos = productos.length;
        // Obtener las denominaciones de los productos
        const nombresProductos = productos.map(producto => producto.denominacion);
        // Establecer el estado del total de productos y las denominaciones de productos
        setTotalProductos(totalProductos);
        setDenominacionesProductos(nombresProductos);
      } catch (error) {
        console.error("Error al obtener los artículos manufacturados:", error);
      }
    };

    const obtenerDatosCupones = async () => {
      try {
        // Obtener la lista de cupones
        const cupones = await cuponesService.getAll(url + 'cupones');
        // Calcular el total de cupones
        const totalCupones = cupones.length;
        // Obtener las denominaciones de los cupones
        const nombresCupones = cupones.map(cupon => cupon.denominacion);
        // Establecer el estado de las denominaciones de cupones
        setTotalCupones(totalCupones);
        setDenominacionesCupones(nombresCupones);
      } catch (error) {
        console.error("Error al obtener los cupones:", error);
      }
    };
    const obtenerArticulosInsumos = async () => {
      try {
        // Obtener la lista de cupones
        const articulosInsumos = await cuponesService.getAll(url + 'articulosInsumos');
        // Calcular el total de cupones
        const totalArticulosInsumos = articulosInsumos.length;
        // Obtener las denominaciones de los cupones
        const nombresArticulosInsumos = articulosInsumos.map(articuloInsumo => articuloInsumo.denominacion);
        // Establecer el estado de las denominaciones de cupones
        setTotalArticulosInsumos(totalArticulosInsumos);
        setDenominacionesArticulosInsumos(nombresArticulosInsumos);
      } catch (error) {
        console.error("Error al obtener los articulos insumos:", error);
      }
    };
  
    const obtenerCategorias = async () => {
      try {
        // Obtener la lista de cupones
        const categorias = await cuponesService.getAll(url + 'categorias');
        // Calcular el total de cupones
        const totalCategorias = categorias.length;
        // Obtener las denominaciones de los cupones
        const nombresCategorias = categorias.map(categoria => categoria.denominacion);
        // Establecer el estado de las denominaciones de cupones
        setTotalCategorias(totalCategorias);
        setDenominacionCategoria(nombresCategorias);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
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
        <Card style={{ backgroundColor: '#cc5533', color: "#ffff" }}>
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
        <Card style={{ backgroundColor: '#cc5533', color: "#ffff" }}>
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
        <Card style={{ backgroundColor: '#cc5533', color: "#ffff" }}>
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
        <Card style={{ backgroundColor: '#cc5533', color: "#ffff" }}>
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
