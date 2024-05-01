import React, { useState, useEffect } from "react";
import {
    Box,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import EmailIcon from "@mui/icons-material/Email";
import StatBox from "../GlobalComponent/Card/CardComponent";
import { tokens } from "../../../theme";

const CardInformationDetailComponent = () => {
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
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
                    <Box
                        width="100%"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title={emailData.emailsSent}
                            subtitle="Hà Nội User"
                            progress="0.25"
                            increase={emailData.increase}
                            icon={
                                <EmailIcon
                                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                                />
                            }
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CardInformationDetailComponent;
