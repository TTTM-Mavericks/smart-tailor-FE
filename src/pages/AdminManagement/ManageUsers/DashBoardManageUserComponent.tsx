import * as React from 'react';
import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme, { tokens } from '../../../theme';
import styles from "./DashBoardUserStyle.module.scss"
import ManageUsers from '../ManageUsers/ManageUsersScreens';
import Grid from "@mui/material/Unstable_Grid2";

export default function DashboardManageUserScreen() {
    const theme1 = useTheme();
    const smScreen = useMediaQuery(theme1.breakpoints.up("sm"));
    const colors = tokens(theme1.palette.mode)
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
                            <ManageUsers />
                        </Box>
                    </Box>
                </main>
            </div>
        </CssVarsProvider>
    );
}