import {BaseNavBar} from "../ui/common/BaseNavBar.tsx";
import {Col, Row, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Chart} from "react-google-charts";
import PedidoService from "../../services/PedidoService.ts";
import {useAuth0} from "@auth0/auth0-react";

export const Reporte = () => {

    const pedidoService = new PedidoService();

    const url = import.meta.env.VITE_API_URL;

    const [desde, setDesde] = useState<any>();
    const [hasta, setHasta] = useState<any>();
    const [dataRankingInsumos, setDataRankingInsumos] = useState<any>();
    const [dataPedidosPorCliente, setDataPedidosPorCliente] = useState<any>();
    const [dataIngresos, setDataIngresos] = useState<any>();
    const [dataGanancias, setDataGanancias] = useState<any>();

    const { getAccessTokenSilently } = useAuth0();

    const generarExcel = (desde: any, hasta: any, type: string) => {

        console.log(desde, hasta)

        if(!(desde && hasta)) {
            alert("Complete el desde y hasta para generar el informe")
            return;
        }

        desde = new Date(desde?.target?.value).toISOString();
        hasta = new Date(hasta?.target?.value).toISOString()

        window.open(`http://localhost:8080/pedido/${type}?desde=${desde}&hasta=${hasta}`, "_blank");
    }

    const getChartRankingInsumos =  async () => {
        setDataRankingInsumos([
            ["Articulo", "Cantidad"],
            ...(await pedidoService.getRankingInsumos(url, await getAccessTokenSilently({})))
        ]);
    }

    const getPedidosPorCliente =  async () => {
        setDataPedidosPorCliente([
            ["Cliente", "Cantidad"],
            ...(await pedidoService.getPedidosPorCliente(url, await getAccessTokenSilently({})))
        ]);
    }

    const getIngresos =  async () => {
        setDataIngresos([
            ["Dia", "Cantidad"],
            ...(await pedidoService.getIngresos(url, await getAccessTokenSilently({})))
        ]);
    }

    const getGanancias =  async () => {
        setDataGanancias([
            ["Dia", "Cantidad"],
            ...(await pedidoService.getGanancias(url, await getAccessTokenSilently({})))
        ]);
    }

    useEffect(() => {
        getChartRankingInsumos();
        getPedidosPorCliente();
        getIngresos();
        getGanancias();
    }, []);

    return <>
        <BaseNavBar title="Sucursales" />
        <Row>
            <Col>
                <div style={{padding: "1rem"}}>
                    <h2>Reportes basados en tiempo</h2>
                    <p>En formato XLSX</p>
                    <Row>
                        <Col>
                            <div>
                                <Form.Label htmlFor="inputPassword5">Desde</Form.Label>
                                <Form.Control
                                    type="date"
                                    id="desde"
                                    aria-describedby="desde"
                                    onChange={(e) => setDesde(e)}
                                />
                                <Form.Text id="desde" muted>
                                    Ingrese la fecha desde para generar el reporte
                                </Form.Text>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <Form.Label htmlFor="inputPassword5">Hasta</Form.Label>
                                <Form.Control
                                    type="date"
                                    id="hasta"
                                    aria-describedby="hasta"
                                    onChange={(e) => setHasta(e)}
                                />
                                <Form.Text id="hasta" muted>
                                    Ingrese la fecha hasta para generar el reporte
                                </Form.Text>
                            </div>
                        </Col>
                    </Row>
                    <Row className={"p-3"}>
                        <Col>
                            <a style={{width: "100%"}} className="btn btn-success"
                               onClick={() => generarExcel(desde, hasta, 'ranking/insumos/excel')}>Descargar ranking insumos</a>
                        </Col>
                        <Col>
                            <a style={{width: "100%"}} className="btn btn-success"
                               onClick={() => generarExcel(desde, hasta, 'ranking/pedidos/cliente/excel')}>Descargar pedidos por cliente</a>
                        </Col>
                    </Row>
                    <Row className={"p-3"}>
                        <Col>
                            <a style={{width: "100%"}} className="btn btn-success"
                               onClick={() => generarExcel(desde, hasta, 'ranking/ingresos/excel')}>Descargar ingresos</a>
                        </Col>
                        <Col>
                            <a style={{width: "100%"}} className="btn btn-success"
                               onClick={() => generarExcel(desde, hasta, 'ranking/ganancias/excel')}>Descargar ganancias</a>
                        </Col>
                    </Row>
                    <br></br>
                    <hr/>
                    <h2>Reportes historicos</h2>
                    <p>En formato de charts</p>
                    <Row className={"py-3"}>
                        <Col>
                            <h4>Insumos vendidos</h4>
                            <Chart
                                chartType="PieChart"
                                data={dataRankingInsumos}
                                height={"400px"}
                            />
                        </Col>
                        <Col>
                            <h4>Pedidos por cliente</h4>
                            <Chart
                                chartType="PieChart"
                                data={dataPedidosPorCliente}
                                height={"400px"}
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
                            />
                        </Col>
                        <Col>
                            <h4>Ganancias</h4>
                            <Chart
                                chartType="Bar"
                                data={dataGanancias}
                                height={"400px"}
                            />
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    </>
}