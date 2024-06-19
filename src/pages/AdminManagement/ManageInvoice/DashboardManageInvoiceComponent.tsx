import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '../../../theme';
import styles from "./DashboardManageInvoiceStyle.module.scss"
import Grid from "@mui/material/Unstable_Grid2";
import ManageInvoiceScreen from './ManageInvoiceScreens';

export default function DashboardManageInvoiceScreen() {
    const theme1 = useTheme();
    const smScreen = useMediaQuery(theme1.breakpoints.up("sm"));
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // if (isMobile) {
    //     return (
    //         <NotFound />
    //     );
    // }
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
                                <ManageInvoiceScreen />
                            </Grid>
                        </Grid>
                    </Box>
                </main>
            </div>
        </CssVarsProvider>
    );
}
