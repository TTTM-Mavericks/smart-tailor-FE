import * as React from 'react';
import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { Box, CssBaseline, useMediaQuery, useTheme, IconButton, Card, Typography } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { ArrowUpward } from '@mui/icons-material';
import theme from '../../../theme';
import styles from "./DashboardPieChartStyles.module.scss"
import PieChartComponent from '../PieChart/PieChartComponent';
import { tokens, themeSettings } from "../../../theme";
import NotFound from '../GlobalComponent/Error404/Error404Component';

const DashboardPieChartScreens = () => {
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
                <SideBarComponent />
                <div className={`${styles.content}`}>
                    <TopbarComponent />
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
                        <Box gridColumn="span 12" gridRow="span 5">
                            <PieChartComponent />
                        </Box>
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

export default DashboardPieChartScreens;