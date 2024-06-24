import BaseNavBar from "./BaseNavBar"
import Sidebar from "../Sider/SideBar"
import { Outlet } from "react-router-dom"
import { Col, Row } from "react-bootstrap"

export const Layout = () => {
    return <>
        <BaseNavBar title=""></BaseNavBar>
        <Row noGutters style={{ overflowX: "hidden", width: "100%" }}>
            <Col xs="auto" className="sidebar">
                <Sidebar />
            </Col>
            <Col>
                <Outlet></Outlet>
            </Col>
        </Row>
    </>
}