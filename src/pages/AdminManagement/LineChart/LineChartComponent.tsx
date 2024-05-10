import { Box, Card, useTheme } from "@mui/material";
import LineChart from "./LineChartScreens";
import { tokens } from "../../../theme";
const LineChartComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Card style={{ height: "100vh", backgroundColor: colors.primary[100], margin: "2%" }}>
            <Box height="70vh">
                <LineChart />
            </Box>
        </Card>
    );
};

export default LineChartComponent;
