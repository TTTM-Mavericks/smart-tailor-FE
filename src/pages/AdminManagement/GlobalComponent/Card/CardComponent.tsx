import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ProgressCircle from "../ProgressCircle/ProgressCircleComponent";
import { tokens } from "../../../../theme";

interface StatBoxProps {
    title: string;
    subtitle: string;
    progress: number;
    increase: number;
    icon: React.ReactNode;
}

const StatBox = ({ title, subtitle, progress, increase, icon }: StatBoxProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const increaseColor = increase >= 0 ? colors.greenAccent[400] : colors.redAccent[400];

    return (
        <Box width="100%" m="0 30px" p="12px 0">
            <Box display="flex" justifyContent="space-between">
                <Box>
                    {icon}
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: colors.primary[100] }}
                    >
                        {title}
                    </Typography>
                </Box>
                <Box>
                    <ProgressCircle progress={progress} />
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography variant="h5" sx={{ color: colors.greenAccent[400] }}>
                    {subtitle}
                </Typography>
                <Typography
                    variant="h5"
                    fontStyle="italic"
                    sx={{ color: increaseColor }} // Use calculated color
                >
                    {increase > 0 ? `+${increase}` : increase} {/* Add '+' sign for positive increases */}
                </Typography>
            </Box>
        </Box>
    );
};

export default StatBox;
