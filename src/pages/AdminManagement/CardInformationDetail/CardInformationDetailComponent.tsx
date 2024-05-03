import React, { useState, useEffect } from "react";
import {
    Box,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Typography,
    IconButton,
    CardMedia,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../../theme";

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

    return (
        <Box m="20px">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Card sx={{ display: 'flex', backgroundColor: `${colors.primary[100]} !important` }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 80 }}
                            image={`../../../../../src/assets/img/avatar.jpg`}
                        />
                        <Box>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">
                                    Total Product
                                </Typography>
                            </CardContent>

                            <Box>
                                <CardContent>
                                    <p style={{ fontWeight: "bold" }}>
                                        100
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
                            sx={{ width: 80 }}
                            image={`../../../../../src/assets/img/avatar.jpg`}
                        />
                        <Box>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">
                                    Total Earning
                                </Typography>
                            </CardContent>

                            <Box>
                                <CardContent>
                                    <p style={{ fontWeight: "bold" }}>
                                        1,123,456
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
                            sx={{ width: 80 }}
                            image={`../../../../../src/assets/img/avatar.jpg`}
                        />
                        <Box>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">
                                    Report
                                </Typography>
                            </CardContent>

                            <Box>
                                <CardContent>
                                    <p style={{ fontWeight: "bold" }}>
                                        10
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
                            sx={{ width: 80 }}
                            image={`../../../../../src/assets/img/avatar.jpg`}
                        />
                        <Box>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">
                                    Total Income
                                </Typography>
                            </CardContent>

                            <Box>
                                <CardContent>
                                    <p style={{ fontWeight: "bold" }}>
                                        1,456,123
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
