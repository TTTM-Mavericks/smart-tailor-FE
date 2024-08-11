import { Box } from "@mui/material";
import { useTheme } from '@mui/material';
import { tokens } from '../../../../theme';

const ProgressCircle = ({ progress = "0.70", size = "40" }) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const isAngle = parseFloat(progress) * 360;
    return (
        <Box
            sx={{
                background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
                conic-gradient(transparent 0deg ${isAngle}deg, ${colors.primary[500]} ${angle}deg 360deg),
                ${colors.primary[500]}`,
                borderRadius: "50%",
                width: `${size}px`,
                height: `${size}px`,
            }}
        />
    );
};

export default ProgressCircle;