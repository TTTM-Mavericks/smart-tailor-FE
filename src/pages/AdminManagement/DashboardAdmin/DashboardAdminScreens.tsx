import * as React from 'react';
import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { Box, CssBaseline, useMediaQuery, useTheme, IconButton } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { ArrowUpward } from '@mui/icons-material';
import theme from '../../../theme';
import styles from "./DashboardAdminStyle.module.scss";
import LineChartComponent from '../LineChart/LineChartComponent';
import BarChartComponent from '../BarChart/BarChartComponent';
import PieChartComponent from '../PieChart/PieChartComponent';
import CardInformationDetailComponent from '../CardInformationDetail/CardInformationDetailComponent';
import GeographyChartComponent from '../GeographyChart/GeographyChartComponent';
import { tokens } from "../../../theme";
import NotFound from '../GlobalComponent/Error404/Error404Component';

const DashboardAdminScreens: React.FC = () => {
    const themeColor = useTheme();
    const colors = tokens(themeColor.palette.mode);
    const [showScrollButton, setShowScrollButton] = React.useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const backgroundColorDashboardRef = React.useRef<HTMLDivElement | null>(null);

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

    React.useEffect(() => {
        const handleStorageChange = () => {
            console.log("localStorage changed");
            const mode = localStorage.getItem("mui-mode");
            if (backgroundColorDashboardRef.current) {
                backgroundColorDashboardRef.current.style.backgroundColor = mode === "dark" ? "#121212" : "#ffffff";
            }
        };

        window.addEventListener('storage', handleStorageChange);

        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const _handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isMobile) {
        return <NotFound />;
    }

    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className={`${styles.dashboard}`}>
                <SideBarComponent />
                <div className={`${styles.content}`}>
                    <TopbarComponent />
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
                        <Box gridColumn="span 12" gridRow="span 1">
                            <CardInformationDetailComponent />
                        </Box>
                        <Box gridColumn="span 12" gridRow="span 5">
                            <GeographyChartComponent />
                        </Box>
                        <Box gridColumn="span 12" gridRow="span 5">
                            <BarChartComponent />
                        </Box>
                        <Box gridColumn="span 12" gridRow="span 5">
                            <LineChartComponent />
                        </Box>
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
                            onClick={_handleScrollToTop}
                        >
                            <ArrowUpward />
                        </IconButton>
                    )}
                </div>
            </div>
        </CssVarsProvider>
    );
}

export default DashboardAdminScreens;
