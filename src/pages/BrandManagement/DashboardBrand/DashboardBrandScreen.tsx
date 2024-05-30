import * as React from 'react';
import { Box, CssBaseline, useMediaQuery, useTheme, IconButton } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { ArrowUpward } from '@mui/icons-material';
import theme from '../../../theme';
import styles from "./DashboardBrandStyles.module.scss"
import { tokens } from "../../../theme";
import NotFound from '../GlobalComponent/Error404/Error404Component';
import TopbarBrandComponent from '../GlobalComponent/TopBar/TopBarBrandComponent';
import SideBarBrandComponent from '../GlobalComponent/SideBar/SideBarBrandComponent';
const DashboardBrandScreens = () => {
    const themeColor = useTheme();
    const colors = tokens(themeColor.palette.mode);
    const [showScrollButton, setShowScrollButton] = React.useState<boolean>(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    React.useEffect(() => {
        const _handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', _handleScroll);

        return () => {
            window.removeEventListener('scroll', _handleScroll);
        };
    }, []);

    const _handleScrollToTop = () => {
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
                <SideBarBrandComponent />
                <div className={`${styles.content}`}>
                    <TopbarBrandComponent />
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
                        <Box gridColumn="span 12" gridRow="span 5">
                            <></>
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
        </CssVarsProvider >
    );
}

export default DashboardBrandScreens;