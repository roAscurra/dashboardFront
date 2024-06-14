import {BaseNavBar} from "../../ui/common/BaseNavBar.tsx";
import {Col, Row, Form} from "react-bootstrap";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {Graphs} from "../../ui/Graphs/Graphs.tsx";
import Sidebar from "../../ui/Sider/SideBar.tsx";
import { CCol } from "@coreui/react";

export const Reporte = () => {

    const { sucursalId } = useParams();

    const [desde, setDesde] = useState<any>();
    const [hasta, setHasta] = useState<any>();


    const generarExcel = (sucursalId: string | undefined, desde: any, hasta: any, type: string) => {

        console.log(desde, hasta)

        if(!(desde && hasta)) {
            alert("Complete el desde y hasta para generar el informe")
            return;
        }

        desde = new Date(desde?.target?.value).toISOString();
        hasta = new Date(hasta?.target?.value).toISOString()

        window.open(`http://localhost:8080/pedido/${type}/${sucursalId}?desde=${desde}&hasta=${hasta}`, "_blank");
    }



    return <>
        <BaseNavBar title="Sucursales" />
        <Row>
        <CCol xs="auto" className="sidebar">
          <Sidebar />
        </CCol>
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
                            <a style={{width: "100%", backgroundColor: "#9c27b0"}} className="btn text-light"
                               onClick={() => generarExcel(sucursalId, desde, hasta, 'ranking/insumos/excel')}>Descargar ranking insumos</a>
                        </Col>
                        <Col>
                            <a style={{width: "100%", backgroundColor: "#9c27b0"}} className="btn text-light"
                               onClick={() => generarExcel(sucursalId, desde, hasta, 'ranking/pedidos/cliente/excel')}>Descargar pedidos por cliente</a>
                        </Col>
                    </Row>
                    <Row className={"p-3"}>
                        <Col>
                            <a style={{width: "100%", backgroundColor: "#9c27b0"}} className="btn text-light"
                               onClick={() => generarExcel(sucursalId, desde, hasta, 'ranking/ingresos/excel')}>Descargar ingresos</a>
                        </Col>
                        <Col>
                            <a style={{width: "100%", backgroundColor: "#9c27b0"}} className="btn text-light"
                               onClick={() => generarExcel(sucursalId, desde, hasta, 'ranking/ganancias/excel')}>Descargar ganancias</a>
                        </Col>
                    </Row>
                    <br></br>
                    <hr/>
                    <Graphs/>
                </div>
            </Col>
        </Row>
    </>
}