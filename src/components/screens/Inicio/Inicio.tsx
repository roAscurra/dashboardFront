import { Box, Container } from "@mui/material";
import React from "react";
import {Graphs} from "../../ui/Graphs/Graphs.tsx";
const Inicio: React.FC = () => {
  return (
    <React.Fragment>
      <Box component="main" sx={{ flexGrow: 1, pl: 9, pt: 4 }}>
        <Container>
          <Graphs></Graphs>
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default Inicio;
