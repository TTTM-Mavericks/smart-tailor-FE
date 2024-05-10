import { Box, Card, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import CardInformationDetailComponent from "./CardInformationDetailComponent";

const CardInformationScreen = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Card style={{ height: "100vh", backgroundColor: colors.primary[100], margin: "2%" }}>
            <Box height="80vh">
                <CardInformationDetailComponent />
            </Box>
        </Card>
    );
};

export default CardInformationScreen;
