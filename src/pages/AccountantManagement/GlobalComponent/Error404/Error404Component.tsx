import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

// Styled component for the container
const Container = styled(Box)({
    // backgroundImage: `url(${spaceBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
});

// Styled component for the "Oops!" text
const OopsText = styled(Typography)({
    fontWeight: 'bold',
    fontSize: '6rem',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
    backgroundImage: `url(../../../../assets/system/smart-tailor_logo.png)`,
    backgroundClip: 'text',
    color: 'transparent',
    animation: '$textShine 5s infinite alternate',
    '@keyframes textShine': {
        '0%': { textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' },
        '50%': { textShadow: '0 0 20px rgba(255, 255, 255, 1)' },
        '100%': { textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' },
    },
});


const NotFound: React.FC = () => {
    return (
        <Container>
            <OopsText>Oops!</OopsText>
            <Typography variant="body1" gutterBottom color="black">
                404 - PAGE NOT FOUND
            </Typography>
            <Typography variant="body2" gutterBottom color="black">
                This Function is not support for this device!!!!
            </Typography>
        </Container>
    );
};

export default NotFound;