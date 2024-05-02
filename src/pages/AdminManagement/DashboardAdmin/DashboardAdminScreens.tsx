import * as React from 'react';
import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '../../../theme';
import styles from "./DashboardAdminStyle.module.scss"
import LineChartComponent from '../LineChart/LineChartComponent';
import BarChartComponent from '../BarChart/BarChartComponent';
import PieChartComponent from '../PieChart/PieChartComponent';
import CardInformationDetailComponent from '../CardInformationDetail/CardInformationDetailComponent';
import GeographyChart from '../GeographyChart/GeographyChartScreens';
import RecentTransactionsComponent from '../RecentTransaction/RecentTransactionComponent';
import Grid from "@mui/material/Unstable_Grid2";

export default function DashboardAdminScreens() {
    const theme1 = useTheme();
    const smScreen = useMediaQuery(theme1.breakpoints.up("sm"));
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className={`${styles.dashboard}`}>
                <SideBarComponent />
                <main className={`${styles.content}`}>
                    <TopbarComponent />
                    <Box>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid sx={12}>
                                <CardInformationDetailComponent />
                            </Grid>
                            <Grid
                                xs={12}
                                sm={12}
                                md={8}
                                lg={8}
                                container
                                rowSpacing={1}
                                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            >
                                <Grid xs={12}>
                                    <LineChartComponent />
                                </Grid>
                                <Grid xs={12} sm={12} md={5}>
                                    <PieChartComponent />
                                </Grid>
                                <Grid xs={12} sm={12} md={7}>
                                    <BarChartComponent />
                                </Grid>
                            </Grid>
                            <Grid xs={12} sm={12} md={4} lg={4} xl={4}>
                                <GeographyChart />
                            </Grid>
                            <Grid xs={12}>
                                <RecentTransactionsComponent />
                            </Grid>
                        </Grid>
                    </Box>
                </main>
            </div>
        </CssVarsProvider>
    );
}
