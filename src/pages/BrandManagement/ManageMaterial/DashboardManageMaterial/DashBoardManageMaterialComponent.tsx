import TopbarBrandComponent from '../../GlobalComponent/TopBar/TopBarBrandComponent';
import SideBarBrandComponent from '../../GlobalComponent/SideBar/SideBarBrandComponent';
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme, { tokens } from '../../../../theme';
import styles from "./DashBoardMaterialStyle.module.scss"
import NotFound from '../../GlobalComponent/Error404/Error404Component';
import ManageMaterialComponent from '../MaterialManage/MaterialManageScreens';

export default function DashboardManageMaterialScreen() {
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
                <SideBarBrandComponent />
                <main className={`${styles.content}`}>
                    <TopbarBrandComponent />
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
                            <ManageMaterialComponent />
                        </Box>
                    </Box>
                </main>
            </div>
        </CssVarsProvider>
    );
}
