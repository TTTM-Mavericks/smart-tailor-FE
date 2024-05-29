import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '../../../theme';
import styles from "./DashboardRecentTransactionStyle.module.scss"
import Grid from "@mui/material/Unstable_Grid2";
import RecentTransactionComponent from './RecentTransactionComponent';
import NotFound from '../GlobalComponent/Error404/Error404Component';

export default function DashboardRecentTransactionScreen() {
    const theme1 = useTheme();
    const smScreen = useMediaQuery(theme1.breakpoints.up("sm"));
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <NotFound />
        );
    }
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className={`${styles.dashboard}`}>
                <SideBarComponent />
                <main className={`${styles.content}`}>
                    <TopbarComponent />
                    <Box>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid xs={12}>
                                <RecentTransactionComponent />
                            </Grid>
                        </Grid>
                    </Box>
                </main>
            </div>
        </CssVarsProvider>
    );
}
