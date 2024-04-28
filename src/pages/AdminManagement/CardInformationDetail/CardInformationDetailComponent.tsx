import {
    Box,
    Button,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import StatBox from "../GlobalComponent/Card/CardComponent";

const CardInformationDetailComponent = () => {
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
    const colors = tokens(theme.palette.mode);
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
                            title="12,361"
                            subtitle="Emails Sent"
                            progress="0.75"
                            increase="+14%"
                            icon={
                                <EmailIcon
                                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                                />
                            }
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Box
                        width="100%"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title="431,225"
                            subtitle="Sales Obtained"
                            progress="0.50"
                            increase="+21%"
                            icon={
                                <PointOfSaleIcon
                                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                                />
                            }
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Box
                        width="100%"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title="32,441"
                            subtitle="New Clients"
                            progress="0.30"
                            increase="+5%"
                            icon={
                                <PersonAddIcon
                                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                                />
                            }
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Box
                        width="100%"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title="1,325,134"
                            subtitle="Traffic Received"
                            progress="0.80"
                            increase="+43%"
                            icon={
                                <TrafficIcon
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
