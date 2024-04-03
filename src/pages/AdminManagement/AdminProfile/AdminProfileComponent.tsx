import * as React from 'react';
import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { CssBaseline } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '../../../theme';
import "./AdminProfileStyles.css"
import AdminProfileScreens from './AdminProfileScreens';
export default function DashboardAdminProfileScreens() {
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className="dashboard">
                <SideBarComponent />
                <main className="content">
                    <TopbarComponent />
                    <AdminProfileScreens />
                </main>
            </div>
        </CssVarsProvider>
    );
}
