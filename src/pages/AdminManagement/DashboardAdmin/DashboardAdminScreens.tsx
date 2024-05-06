import * as React from 'react';
import TopbarComponent from '../GlobalComponent/TopBar/TopBarComponent';
import SideBarComponent from '../GlobalComponent/SideBar/SideBarComponent';
import { Box, CssBaseline, useMediaQuery, useTheme, IconButton } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { ArrowUpward } from '@mui/icons-material';
import theme from '../../../theme';
import styles from "./DashboardAdminStyle.module.scss"
import LineChartComponent from '../LineChart/LineChartComponent';
import BarChartComponent from '../BarChart/BarChartComponent';
import PieChartComponent from '../PieChart/PieChartComponent';
import CardInformationDetailComponent from '../CardInformationDetail/CardInformationDetailComponent';
import GeographyChartComponent from '../GeographyChart/GeographyChartComponent';
import { tokens } from "../../../theme";

export default function DashboardAdminScreens() {
    const theme1 = useTheme();
    const smScreen = useMediaQuery(theme1.breakpoints.up("sm"));
    const colors = tokens(theme.palette);
    const [showScrollButton, setShowScrollButton] = React.useState(false);

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

    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className={`${styles.dashboard}`}>
                <SideBarComponent />
                <main className={`${styles.content}`}>
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
                            onClick={scrollToTop}
                        >
                            <ArrowUpward />
                        </IconButton>
                    )}
                </main>
            </div>
        </CssVarsProvider>
    );
}