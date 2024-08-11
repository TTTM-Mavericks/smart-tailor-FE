import { Box, Card, useTheme } from "@mui/material";
import BarChart from "./BarChartScreens";
import { tokens } from "../../../theme";

const BarChartComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Card style={{ height: "100vh", margin: "2%", width: "50%" }}>
            <Box height="80vh">
                <BarChart />
            </Box>
        </Card>
    );
};

export default BarChartComponent;
