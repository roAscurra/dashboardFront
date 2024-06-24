import BaseNavBar from "./BaseNavBar"
import { Outlet } from "react-router-dom"
import { Col, Row } from "react-bootstrap"

export const Layout = () => {
    return <>
        <BaseNavBar title=""></BaseNavBar>
        <Row noGutters style={{ overflowX: "hidden", width: "100%" }}>
            <Col>
                <Outlet></Outlet>
            </Col>
        </Row>
    </>
}