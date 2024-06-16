import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, Typography, SelectChangeEvent, Grid } from '@mui/material';
import { Estado } from '../../../../types/enums/Estado';
import Pedido from '../../../../types/Pedido';
import { useAuth0 } from '@auth0/auth0-react';
import UsuarioService from '../../../../services/UsuarioService';
import Usuario from '../../../../types/Usuario';

interface ModalPedidoProps {
    open: boolean;
    onClose: () => void;
    pedido: Pedido | null;
    onSave: (pedido: Pedido) => void;
}

const ModalPedido: React.FC<ModalPedidoProps> = ({ open, onClose, pedido, onSave }) => {
    const [estado, setEstado] = useState<Estado>(Estado.PENDIENTE);
    const { getAccessTokenSilently } = useAuth0();
    const [availableStates, setAvailableStates] = useState<Estado[]>([]);
    const { user, isLoading, isAuthenticated } = useAuth0();
    const [usuario, setUsuario] = useState<Usuario>();
    const usuarioService = new UsuarioService();
    const [usuarioIsLoading, setUsuarioIsLoading] = useState<boolean>(true);
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (user) {
            fetchUsuario();
        }
    }, [user]);

    const fetchUsuario = async () => {
        try {
            const usuario = await usuarioService.getByEmail(url + "usuarioCliente/role/" + user?.email, {
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently({})}`
                }
            });
            setUsuario(usuario);
            setAvailableStates(getAvailableStates(usuario?.rol, pedido?.estado)); // Pasar el rol del usuario y el estado del pedido
            console.log(usuario?.rol);
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
        } finally {
            setUsuarioIsLoading(false);
        }
    };

    const getAvailableStates = (role?: string, currentState?: Estado): Estado[] => {
        let availableStates: Estado[] = [];
        if (role === "CAJERO") {
            availableStates = [Estado.PREPARACION, Estado.EN_DELIVERY, Estado.FACTURADO, Estado.RECHAZADO];
        } else if (role === "COCINERO") {
            availableStates = [Estado.TERMINADO];
        } else {
            availableStates = Object.values(Estado);
        }

        if (currentState && !availableStates.includes(currentState)) {
            availableStates.push(currentState);
        }

        return availableStates;
    };

    useEffect(() => {
        if (pedido) {
            setEstado(pedido.estado);
        }
    }, [pedido]);

    const handleEstadoChange = (event: SelectChangeEvent<Estado>) => {
        setEstado(event.target.value as Estado);
    };

    const handleSave = () => {
        if (pedido) {
            onSave({ ...pedido, estado });
        }
        console.log(usuario)
    };

    if (!pedido) return null;

    if (isAuthenticated) {
        if (isLoading || usuarioIsLoading) {
            return (
                <div
                    style={{ height: "calc(100vh - 88px)" }}
                    className="d-flex flex-column justify-content-center align-items-center"
                >
                    <div className="spinner-border" role="status"></div>
                </div>
            );
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle style={{ fontSize: '24px', marginBottom: '20px' }}>Detalles del Pedido</DialogTitle>
            <DialogContent dividers style={{ fontSize: '20px', marginBottom: '20px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Hora Estimada Finalización:</strong> {pedido.horaEstimadaFinalizacion.toString()}</Typography>
                        <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Total:</strong> {pedido.total}</Typography>
                        <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Total Costo:</strong> {pedido.totalCosto}</Typography>
                        <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Tipo Envio:</strong> {pedido.tipoEnvio}</Typography>
                        <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '10px' }}><strong>Estado:</strong></Typography>
                        <Select value={estado} onChange={handleEstadoChange} fullWidth style={{ fontSize: '18px' }}>
                            {availableStates.map((state) => (
                                <MenuItem key={state} value={state} style={{ fontSize: '18px' }}>
                                    {state}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Forma Pago:</strong> {pedido.formaPago}</Typography>
                        <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Fecha Pedido:</strong> {pedido.fechaPedido.toString()}</Typography>
                        <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Detalle del Pedido:</strong></Typography>
                        {pedido.detallePedidos.map((detalle, index) => (
                            <div key={index} style={{ marginTop: '10px' }}>
                                <Typography variant="body2" style={{ fontSize: '16px', lineHeight: '1.6' }}><strong>Cantidad:</strong> {detalle.cantidad}</Typography>
                                <Typography variant="body2" style={{ fontSize: '16px', lineHeight: '1.6' }}><strong>Artículo:</strong> {detalle.articulo.denominacion}</Typography>
                            </div>
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions style={{ marginTop: '20px' }}>
                <Button onClick={onClose} color="primary" style={{ fontSize: '20px' }}>Cancelar</Button>
                <Button onClick={handleSave} color="primary" style={{ fontSize: '20px' }}>Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalPedido;
