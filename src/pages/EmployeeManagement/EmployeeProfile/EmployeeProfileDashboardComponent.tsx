import { CssBaseline } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from '../../../theme';
import styles from "./EmployeeProfileStyles.module.scss"
import EmployeeProfileSetup from './EmployeeProfileComponent';
import SideBarEmployeeComponent from '../GlobalComponent/SideBar/SideBarEmployeeComponent';
import TopbarEmployeeComponent from '../GlobalComponent/TopBar/TopBarEmployeeComponent';
export default function DashboardEmployeeProfileScreens() {
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className={`${styles.dashboard}`}>
                <SideBarEmployeeComponent />
                <main className={`${styles.content}`}>
                    <TopbarEmployeeComponent />
                    <EmployeeProfileSetup />
                </main>
            </div>
        </CssVarsProvider>
    );
}
