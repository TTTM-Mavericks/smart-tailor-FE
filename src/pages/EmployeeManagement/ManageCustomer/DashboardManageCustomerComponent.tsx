import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme, { tokens } from '../../../theme';
import styles from "./DashBoardUserStyle.module.scss"
import NotFound from '../GlobalComponent/Error404/Error404Component';
import SideBarEmployeeComponent from '../GlobalComponent/SideBar/SideBarEmployeeComponent';
import TopbarEmployeeComponent from '../GlobalComponent/TopBar/TopBarEmployeeComponent';
import EmployeeManageCustomer from './ManageCustomerScreen';

export default function DashboardManageUserScreen() {
    const theme1 = useTheme();
    const smScreen = useMediaQuery(theme1.breakpoints.up("sm"));
    const colors = tokens(theme1.palette.mode)
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
                <SideBarEmployeeComponent />
                <main className={`${styles.content}`}>
                    <TopbarEmployeeComponent />
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
                            <EmployeeManageCustomer />
                        </Box>
                    </Box>
                </main>
            </div>
        </CssVarsProvider>
    );
}
