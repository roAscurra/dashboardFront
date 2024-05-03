import { Box, Grid, Container, Typography } from "@mui/material";
import InicioCard from "../common/InicioCard";
import ChartCard from "./ChartCard";
import BaseBar from "./BaseBar";
import BasePie from "./BasePie";

// Contenido para las tarjetas de inicio
const productosContent = {
    url: 'https://img.freepik.com/foto-gratis/vista-superior-arreglo-comida-sobre-fondo-madera_23-2148308806.jpg?t=st=1714776756~exp=1714780356~hmac=6821528b900e5639c07b467f61d32dc6bcc068450f060df2e988f5914990cbe6&w=740',
    title: 'Productos',
    content: 'Muestra los productos disponibles en tu tienda. Agrega nuevos productos o actualiza los existentes para mejorar la experiencia de compra de tus clientes.',
};

const promocionesContent = {
    url: 'https://img.freepik.com/foto-gratis/venta-caliente-al-menor-moneda-megafono_23-2149656621.jpg?t=st=1714776543~exp=1714780143~hmac=54a4194d80d89624e947db99cc430118ddc6fc3d874ade9a13db5551051106c7&w=740',
    title: 'Promociones',
    content: 'Aquí puedes mostrar las promociones y ofertas especiales disponibles. Personaliza tus ofertas para atraer a tus clientes y hacer que vuelvan por más.',
};

const sucursalesContent = {
    url: 'https://img.freepik.com/foto-gratis/ilustracion-3d-senal-localizador-rojo-mapa_107791-16576.jpg?t=st=1714776670~exp=1714780270~hmac=d69467433bd04b587140e6689404091467b065f2cda0a22350b8134c5fb4ede3&w=740',
    title: 'Sucursales',
    content: 'Muestra información sobre las diferentes sucursales de tu negocio. Puedes incluir direcciones, horarios de atención y cualquier otra información relevante.',
};

// Estilo para las tarjetas
const cardStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "#D6A8FF", 
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
                            <InicioCard content={productosContent} />
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
