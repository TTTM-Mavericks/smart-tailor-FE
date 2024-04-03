import * as React from 'react';
import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { CssBaseline } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '../../../theme';
import "./DashboardAdminStyle.css"
import ManageUsers from '../ManageUsers/ManageUsersScreens';
import LineChartComponent from '../LineChart/LineChartComponent';
import BarChartComponent from '../BarChart/BarChartComponent';
import PieChartComponent from '../PieChart/PieChartComponent';
export default function DashboardAdminScreens() {
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className="dashboard">
                <SideBarComponent />
                <main className="content">
                    <TopbarComponent />
                    <LineChartComponent />
                    <BarChartComponent />
                    <PieChartComponent />
                    <ManageUsers />
                </main>
            </div>
        </CssVarsProvider>
    );
}
