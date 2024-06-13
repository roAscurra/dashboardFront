import { Box, Container } from "@mui/material";
import React from "react";
import { BaseNavBar } from "../../ui/common/BaseNavBar";
import Sidebar from "../../ui/Sider/SideBar";
import { CCol, CContainer, CRow } from "@coreui/react";
import {Graphs} from "../../ui/Graphs/Graphs.tsx";
const Inicio: React.FC = () => {
  return (
    <React.Fragment>
      <BaseNavBar title="" />
      <CContainer fluid>
        <CRow>
          {/* Sidebar */}
          <CCol xs="auto" className="sidebar">
            <Sidebar />
          </CCol>

          {/* Contenido principal */}
          <CCol>
            <Box component="main" sx={{ flexGrow: 1, pl: 9, pt: 4 }}>
              <Container>
                <Graphs></Graphs>
              </Container>
            </Box>
          </CCol>
        </CRow>
      </CContainer>
    </React.Fragment>
  );
};

export default Inicio;
