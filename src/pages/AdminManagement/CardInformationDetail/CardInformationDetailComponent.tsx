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
                    <Card sx={{ display: 'flex', backgroundColor: `${colors.primary[100]} !important` }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 100 }}
                            image={`../../../../../src/assets/img/avatar.jpg`}
                        />
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
                    </Card>
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Card sx={{ display: 'flex', backgroundColor: `${colors.primary[100]} !important` }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 100 }}
                            image={`../../../../../src/assets/img/avatar.jpg`}
                        />
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
                    </Card>
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Card sx={{ display: 'flex', backgroundColor: `${colors.primary[100]} !important` }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 100 }}
                            image={`../../../../../src/assets/img/avatar.jpg`}
                        />
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
                    </Card>
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Card sx={{ display: 'flex', backgroundColor: `${colors.primary[100]} !important` }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 100 }}
                            image={`../../../../../src/assets/img/avatar.jpg`}
                        />
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
                    </Card>
                </Grid>
            </Grid>
        </Box >
    );
};

export default CardInformationDetailComponent;
