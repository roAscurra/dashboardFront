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

    return (
        <>
          <h2>Reportes históricos</h2>
          <Row className={"p-3"}>
            <Col md={6}>
              <h4>Insumos vendidos</h4>
              <Chart
                chartType="PieChart"
                data={dataRankingInsumos}
                width={"100%"}
                options={options}
              />
            </Col>
            <Col md={6}>
              <h4>Pedidos por cliente</h4>
              <Chart
                chartType="PieChart"
                data={dataPedidosPorCliente}
                width={"100%"}
                options={options}
              />
            </Col>
          </Row>
          <Row className={"p-2"}>
            <Col md={6}>
              <h4>Ingresos</h4>
              <Chart
                chartType="Bar"
                data={dataIngresos}
                width={"100%"}
                options={options}
              />
            </Col>
            <Col md={6}>
              <h4>Ganancias</h4>
              <Chart
                chartType="Bar"
                data={dataGanancias}
                width={"100%"}
                options={options}
              />
            </Col>
          </Row>
        </>
      );
    };