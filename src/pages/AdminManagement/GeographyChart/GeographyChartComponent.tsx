import { Card, useTheme } from "@mui/material";
import GeographyChart from "./GeographyChartScreens";
import { tokens } from "../../../theme";

const GeographyChartComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Card style={{ height: "100vh", backgroundColor: colors.primary[100], margin: "2%" }}>
            <GeographyChart />
        </Card>
    );
};

export default GeographyChartComponent;
