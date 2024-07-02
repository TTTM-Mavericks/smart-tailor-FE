import { CssBaseline } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '../../../theme';
import styles from "./BrandProfileStyles.module.scss"
import TopbarBrandComponent from '../GlobalComponent/TopBar/TopBarBrandComponent';
import SideBarBrandComponent from '../GlobalComponent/SideBar/SideBarBrandComponent';
import BrandProfileSetup from "./BrandProfileComponent";
export default function DashboardBrandProfileScreens() {
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className={`${styles.dashboard}`}>
                <SideBarBrandComponent />
                <main className={`${styles.content}`}>
                    <TopbarBrandComponent />
                    <BrandProfileSetup />
                </main>
            </div>
        </CssVarsProvider>
    );
}
