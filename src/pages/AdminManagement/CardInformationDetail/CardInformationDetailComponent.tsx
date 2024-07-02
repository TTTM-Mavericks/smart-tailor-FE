import { useState, useEffect } from "react";
import {
    Box,
    useTheme,
    Card,
    CardContent,
    Typography,
    CardMedia,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../../theme";
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';
import { color } from "@mui/system";

const CardInformationDetailComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [emailData, setEmailData] = useState({
        emailsSent: "",
        increase: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const data = {
                    emailsSent: "123456789",
                    increase: "-25%"
                };

                setEmailData(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);


    return (
        <Box m="20px" >
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Box sx={{ display: 'flex', backgroundColor: `${colors.primary[600]} !important` }}>
                        <CardMedia
                            component="svg"
                            sx={{ width: 90, height: 100 }} // Adjust the width and height as needed
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M12 2a1 1 0 00-.707.293l-7 7A1 1 0 004.707 10H6v10a1 1 0 001 1h4v-7h2v7h4a1 1 0 001-1V10h1.293a1 1 0 00.707-1.707l-7-7A1 1 0 0012 2zM12 4.414L17.586 10H14v9h-4v-9H6.414L12 4.414z"></path>
                        </CardMedia>
                        <Box>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">
                                    {t(codeLanguage + '000036')}
                                </Typography>
                            </CardContent>

                            <Box>
                                <CardContent>
                                    <p style={{ fontWeight: "bold" }}>
                                        <CountUp end={100} />
                                    </p>
                                </CardContent>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Box sx={{ display: 'flex', backgroundColor: `${colors.primary[600]} !important` }}>
                        <CardMedia
                            component="svg"
                            sx={{ width: 90, height: 100 }} // Adjust the width and height as needed
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M12 2a1 1 0 00-1 1v1.584A4.998 4.998 0 007 10h2a3 3 0 113 3v4a3 3 0 11-3-3H7a5 5 0 0010 0h-2a3 3 0 11-3-3v-4a3 3 0 113-3h2a5 5 0 00-5-5V3a1 1 0 00-1-1z"></path>
                        </CardMedia>
                        <Box>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">
                                    {t(codeLanguage + '000037')}
                                </Typography>
                            </CardContent>
                            <Box>
                                <CardContent>
                                    <p style={{ fontWeight: "bold" }}>
                                        <CountUp end={1123456} />
                                    </p>
                                </CardContent>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Box sx={{ display: 'flex', backgroundColor: `${colors.primary[600]} !important` }}>
                        <CardMedia
                            component="svg"
                            sx={{ width: 90, height: 100 }} // Adjust the width and height as needed
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M3 4a2 2 0 012-2h10l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm4 3a1 1 0 00-2 0v2a1 1 0 002 0V7zm0 5a1 1 0 00-2 0v5a1 1 0 002 0v-5zm5-5a1 1 0 00-2 0v7a1 1 0 002 0V7zm0 10a1 1 0 00-2 0v1a1 1 0 002 0v-1zm5-13a1 1 0 00-2 0v12a1 1 0 002 0V4z"></path>
                        </CardMedia>
                        <Box>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">
                                    {t(codeLanguage + '000038')}
                                </Typography>
                            </CardContent>

                            <Box>
                                <CardContent>
                                    <p style={{ fontWeight: "bold" }}>
                                        <CountUp end={10} style={{ width: "2%" }} />
                                    </p>
                                </CardContent>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Box sx={{ display: 'flex', backgroundColor: `${colors.primary[600]} !important` }}>
                        <CardMedia
                            component="svg"
                            sx={{ width: 90, height: 100 }} // Adjust the width and height as needed
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H7zm2 2h6v4H9V4zm0 6h6v2H9v-2zm0 4h6v2H9v-2z"></path>
                        </CardMedia>
                        <Box>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">
                                    {t(codeLanguage + '000039')}
                                </Typography>
                            </CardContent>

                            <Box>
                                <CardContent>
                                    <p style={{ fontWeight: "bold" }}>
                                        <CountUp end={100} />
                                    </p>
                                </CardContent>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
};

export default CardInformationDetailComponent;
