import * as React from 'react';
import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '../../../theme';
import styles from "./DashboardAdminStyle.module.scss"
import ManageUsers from '../ManageUsers/ManageUsersScreens';
import LineChartComponent from '../LineChart/LineChartComponent';
import BarChartComponent from '../BarChart/BarChartComponent';
import PieChartComponent from '../PieChart/PieChartComponent';
import GeographyChartComponent from '../GeographyChart/GeographyChartComponent';
import Grid from "@mui/material/Unstable_Grid2";

export default function DashboardAdminScreens() {
    const theme1 = useTheme();
    const smScreen = useMediaQuery(theme1.breakpoints.up("sm"));
    return (
        <Box m="20px">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid xs={12}>
                    <CssVarsProvider theme={theme}>
                        <CssBaseline />
                        <div className={`${styles.dashboard}`}>
                            <SideBarComponent />
                            <main className={`${styles.content}`}>
                                <TopbarComponent />
                                <GeographyChartComponent />
                                <LineChartComponent />
                                <BarChartComponent />
                                <PieChartComponent />
                                <ManageUsers />
                            </main>
                        </div>
                    </CssVarsProvider>
                </Grid>
            </Grid>
        </Box>
    );
}
