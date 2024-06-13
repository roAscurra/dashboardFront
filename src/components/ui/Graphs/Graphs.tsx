import {Col, Row} from "react-bootstrap";
import {Chart} from "react-google-charts";
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import PedidoService from "../../../services/PedidoService.ts";
import {useParams} from "react-router-dom";

export const Graphs = () => {

    const { sucursalId } = useParams();
    const url = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService();

    const [dataRankingInsumos, setDataRankingInsumos] = useState<any>();
    const [dataPedidosPorCliente, setDataPedidosPorCliente] = useState<any>();
    const [dataIngresos, setDataIngresos] = useState<any>();
    const [dataGanancias, setDataGanancias] = useState<any>();

    const { getAccessTokenSilently } = useAuth0();

    const getChartRankingInsumos =  async () => {
        setDataRankingInsumos([
            ["Articulo", "Cantidad"],
            ...(await pedidoService.getRankingInsumos(url, sucursalId, await getAccessTokenSilently({})))
        ]);
    }

    const getPedidosPorCliente =  async () => {
        setDataPedidosPorCliente([
            ["Cliente", "Cantidad"],
            ...(await pedidoService.getPedidosPorCliente(url, sucursalId, await getAccessTokenSilently({})))
        ]);
    }

    const getIngresos =  async () => {
        setDataIngresos([
            ["Dia", "Cantidad"],
            ...(await pedidoService.getIngresos(url, sucursalId, await getAccessTokenSilently({})))
        ]);
    }

    const getGanancias =  async () => {
        setDataGanancias([
            ["Dia", "Cantidad"],
            ...(await pedidoService.getGanancias(url, sucursalId, await getAccessTokenSilently({})))
        ]);
    }

    const options = {
        colors: ['#B19CD9', '#D9A6B1', '#B1D9D1']
    }

    useEffect(() => {
        getChartRankingInsumos();
        getPedidosPorCliente();
        getIngresos();
        getGanancias();
    }, []);

    return <>
        <h2>Reportes historicos</h2>
        <Row className={"py-3"}>
            <Col>
                <h4>Insumos vendidos</h4>
                <Chart
                    chartType="PieChart"
                    data={dataRankingInsumos}
                    height={"400px"}
                    options={options}
                />
            </Col>
            <Col>
                <h4>Pedidos por cliente</h4>
                <Chart
                     chartType="PieChart"
                    data={dataPedidosPorCliente}
                    height={"400px"}
                     options={options}
            />
            </Col>
        </Row>
        <Row className={"py-3"}>
            <Col>
                <h4>Ingresos</h4>
                <Chart
                    chartType="Bar"
                    data={dataIngresos}
                    height={"400px"}
                    options={options}
                />
            </Col>
            <Col>
                <h4>Ganancias</h4>
                <Chart
                    chartType="Bar"
                    data={dataGanancias}
                    height={"400px"}
                    options={options}
                />
            </Col>
        </Row>
    </>
}