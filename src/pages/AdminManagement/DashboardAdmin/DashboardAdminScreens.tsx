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
import CardInformationDetailComponent from '../CardInformationDetail/CardInformationDetailComponent';
import GeographyChart from '../GeographyChart/GeographyChartScreens';

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
                    <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gridAutoRows="140px"
                        gap="20px"
                    >
                        <Box
                            gridColumn="span 12"
                            gridRow="span 2"
                        >
                            <CardInformationDetailComponent />

                        </Box>

                        <Box
                            gridColumn="span 12"
                            gridRow="span 5"
                        >
                            <GeographyChart />
                        </Box>
                        <Box
                            gridColumn="span 12"
                            gridRow="span 5"
                        >
                            <LineChartComponent />
                        </Box>
                        <Box
                            gridColumn="span 12"
                            gridRow="span 5"
                        >
                            <BarChartComponent />
                        </Box>
                        <Box
                            gridColumn="span 12"
                            gridRow="span 5"
                        >

                            <PieChartComponent />
                        </Box>
                        <Box
                            gridColumn="span 12"
                            gridRow="span 5"
                        >
                            <ManageUsers />

                        </Box>
                    </Box>
                </main>
            </div>
        </CssVarsProvider>
    );
}
