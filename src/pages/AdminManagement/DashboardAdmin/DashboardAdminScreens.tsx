import * as React from 'react';
import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '../../../theme';
import "./DashboardAdminStyle.css"
import ManageUsers from '../ManageUsers/ManageUsersScreens';
import LineChartComponent from '../LineChart/LineChartComponent';
import BarChartComponent from '../BarChart/BarChartComponent';
import PieChartComponent from '../PieChart/PieChartComponent';
import GeographyChartComponent from '../GeographyChart/GeographyChartComponent';

export default function DashboardAdminScreens() {
    const theme1 = useTheme();
    const smScreen = useMediaQuery(theme1.breakpoints.up("sm"));
    return (

        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className="dashboard">
                <SideBarComponent />
                <main className="content">
                    <TopbarComponent />
                    <GeographyChartComponent />
                    <LineChartComponent />
                    <BarChartComponent />
                    <PieChartComponent />
                    <ManageUsers />
                </main>
            </div>
        </CssVarsProvider>
    );
}
