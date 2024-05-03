import * as React from 'react';
import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { CssBaseline } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '../../../theme';
import styles from "./AdminProfileStyles.module.scss"
import AdminProfileScreens from './AdminProfileScreens';
import ProfileSetup from './AdminProfileSettingComponent';
export default function DashboardAdminProfileScreens() {
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className={`${styles.dashboard}`}>
                <SideBarComponent />
                <main className={`${styles.content}`}>
                    <TopbarComponent />
                    {/* <AdminProfileScreens />
                     */}
                    <ProfileSetup />
                </main>
            </div>
        </CssVarsProvider>
    );
}
