import * as React from 'react';
import { Box, CssBaseline, useMediaQuery, useTheme, IconButton } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { ArrowUpward } from '@mui/icons-material';
import theme from '../../../theme';
import styles from "./DashboardEmployeeComponent.module.scss"
import { tokens } from "../../../theme";
import NotFound from '../GlobalComponent/Error404/Error404Component';
import SideBarEmployeeComponent from '../GlobalComponent/SideBar/SideBarEmployeeComponent';
import TopbarEmployeeComponent from '../GlobalComponent/TopBar/TopBarEmployeeComponent';
import EmployeeManageBrand from './ManageBrandScreen';

const DashboardEmployeeManageBrandScreens = () => {
    const themeColor = useTheme();
    const colors = tokens(themeColor.palette.mode);
    const [showScrollButton, setShowScrollButton] = React.useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const checkDarkOrLightMode = localStorage.getItem("mui-mode")

    console.log("checkDarkOrLightMode" + checkDarkOrLightMode);

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
                <div className={`${styles.content}`}>
                    <TopbarEmployeeComponent />
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
                        <Box gridColumn="span 12" gridRow="span 5">
                            <EmployeeManageBrand />
                        </Box>
                        {/* <Box gridColumn="span 12" gridRow="span 5">
                            <GeographyChartComponent />
                        </Box> */}

                    </Box>
                    {showScrollButton && (
                        <IconButton
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 100,
                                backgroundColor: "#E96208",
                                color: "white"
                            }}
                            onClick={scrollToTop}
                        >
                            <ArrowUpward />
                        </IconButton>
                    )}
                </div>
            </div>
        </CssVarsProvider >
    );
}

export default DashboardEmployeeManageBrandScreens;