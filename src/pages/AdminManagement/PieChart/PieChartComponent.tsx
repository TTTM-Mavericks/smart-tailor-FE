import { Box, Card, useTheme } from "@mui/material";
import PieChart from "./PieChartScreens";
import { tokens } from "../../../theme";

const PieChartComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Card style={{ height: "100vh", backgroundColor: colors.primary[600], margin: "2%", marginTop: "-12%" }}>
            <Box height="80vh">
                <PieChart />
            </Box>
        </Card>
    );
};

export default PieChartComponent;
