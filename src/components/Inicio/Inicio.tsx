import { Box, Grid, Container, Typography } from "@mui/material";
import InicioCard from "../common/InicioCard";
import ChartCard from "./ChartCard";
import BaseBar from "./BaseBar";
import BasePie from "./BasePie";

// Contenido para las tarjetas de inicio

const EstadisticaContent = {
    url: 'https://img.freepik.com/foto-gratis/grafico-barras-crecimiento-marketing-flecha-icono-compras-linea-signo-o-simbolo-concepto-comercio-electronico-sobre-fondo-azul-ilustracion-3d_56104-1787.jpg?t=st=1714963640~exp=1714967240~hmac=8552b84f75da0abe3845183fa21489047a486ef00e1df37dc51d6223cc008841&w=740',
    title: 'Estadistica',
    content: 'En esta sección encontraras la información general de tu empresa',
    verMasUrl: '/estadisticas',
};
const productosContent = {
    url: 'https://img.freepik.com/foto-gratis/vista-superior-arreglo-comida-sobre-fondo-madera_23-2148308806.jpg?t=st=1714776756~exp=1714780356~hmac=6821528b900e5639c07b467f61d32dc6bcc068450f060df2e988f5914990cbe6&w=740',
    title: 'Productos',
    content: 'Muestra los productos disponibles en tu tienda. Agrega nuevos productos o actualiza los existentes para mejorar la experiencia de compra de tus clientes.',
    verMasUrl: '/productos/lista',
};
const categoriaContent = {
    url: 'https://img.freepik.com/foto-gratis/concepto-icono-tecnologia-aplicacion-gadget_53876-120053.jpg?t=st=1715115510~exp=1715119110~hmac=cc41b90c7fb9a39adee577b1e9b724f88dd37766aa85494ae06bff537d9d7cf6&w=740                                                                                              ',
    title: 'Categoria',
    content: '                                 Descubre nuestra selección de productos por categoría.',
    verMasUrl: '/categorias',
};

const promocionesContent = {
    url: 'https://img.freepik.com/foto-gratis/venta-caliente-al-menor-moneda-megafono_23-2149656621.jpg?t=st=1714776543~exp=1714780143~hmac=54a4194d80d89624e947db99cc430118ddc6fc3d874ade9a13db5551051106c7&w=740',
    title: 'Promociones',
    content: 'Aquí puedes mostrar las promociones y ofertas especiales disponibles. Personaliza tus ofertas para atraer a tus clientes y hacer que vuelvan por más.',
    verMasUrl: '/promociones/lista',
};

const sucursalesContent = {
    url: 'https://img.freepik.com/foto-gratis/vista-3d-mapa_23-2150471709.jpg?t=st=1714849042~exp=1714852642~hmac=216f13961f62fdd99a602c405c84ee1a48441c83fa2133179c9b1ec9f5760ed6&w=740',
    title: 'Sucursales',
    content: 'Muestra información sobre las diferentes sucursales de tu negocio. Puedes incluir direcciones, horarios de atención y cualquier otra información relevante.',
    verMasUrl: '/sucursales/lista',
};

const CuponesContent = {
    url: 'https://img.freepik.com/foto-gratis/cono-cupon-venta-o-compra-descuento-especial-promocion-marketing-compra-pago-comercio-electronico-compras-linea-ilustracion-3d_56104-2104.jpg?t=st=1714846472~exp=1714850072~hmac=23cc0754f9b08c9cb3d053e731ec73b7e25c376edf9141b0838e43dc9f9aae00&w=740',
    title: 'Cupones',
    content: 'Aqui puedes ver los cupones a los que pueden acceder tus clientes',
    verMasUrl: '/cupones/lista',
};




// Estilo para las tarjetas
const cardStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "#b23e1f", 
};

//Renderización del componente
const Inicio: React.FC = () => {
    return (
        <Box component="main" sx={{ flexGrow: 1, pl: 9, pt: 4}}>
            <Container>
                <Typography component="h1" variant="h5" color="initial" >Welcome</Typography>
                        
                <Grid container spacing={3} sx={{ py: 2, alignContent: 'center' , justifyContent: 'center' }}>
                    <Grid item xs={12} md={6}>
                        <ChartCard title="Gráfico de Pastel">
                            <BasePie />
                        </ChartCard>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ChartCard title="Gráfico de Barras">
                            <BaseBar />
                        </ChartCard>
                    </Grid>
                </Grid>
                <Grid container spacing={3} sx={{ alignContent: 'center' , justifyContent: 'center'}}>
                <Grid item xs={12} md={4}>
                        <Box sx={cardStyle}>
                            <InicioCard content={EstadisticaContent} />

                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={cardStyle}>
                            <InicioCard content={productosContent} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={cardStyle}>
                            <InicioCard content={categoriaContent} />

                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={cardStyle}>
                            <InicioCard content={CuponesContent} />

                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={cardStyle}>
                            <InicioCard content={promocionesContent} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={cardStyle}>
                            <InicioCard content={sucursalesContent} />
                        </Box>
                    </Grid>

                    

                    
                </Grid>
            </Container>
        </Box>
    );
};

export default Inicio;
