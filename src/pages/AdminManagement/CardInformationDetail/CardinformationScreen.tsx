import { Box, Card, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import CardInformationDetailComponent from "./CardInformationDetailComponent";

const CardInformationScreen = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <CardInformationDetailComponent />
    );
};

export default CardInformationScreen;
