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
                            component="img"
                            sx={{ width: 100 }}
                            image={`https://s3.amazonaws.com/www-inside-design/uploads/2018/12/The-product-of-you-810x810.png`}
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
                    </Box>
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Box sx={{ display: 'flex', backgroundColor: `${colors.primary[600]} !important` }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 100 }}
                            image={`https://www.pngall.com/wp-content/uploads/12/Earning.png`}
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
                    </Box>
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Box sx={{ display: 'flex', backgroundColor: `${colors.primary[600]} !important` }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 100 }}
                            image={`https://media.licdn.com/dms/image/C4E12AQH4bcBzdD605Q/article-cover_image-shrink_600_2000/0/1629361158472?e=2147483647&v=beta&t=a7pXC6DGc7gjKGGsTuoThABat30Gi9pe0Tn3pEZHW3U`}
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
                    </Box>
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Box sx={{ display: 'flex', backgroundColor: `${colors.primary[600]} !important` }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 100 }}
                            image={`https://thumbs.dreamstime.com/z/order-processing-vector-icon-purchase-illustration-sign-checkout-symbol-invoice-logo-order-processing-vector-icon-purchase-192433033.jpg?w=768`}
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
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
};

export default CardInformationDetailComponent;
