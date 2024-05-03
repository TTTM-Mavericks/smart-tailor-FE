import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';

// Create a custom styled Card component
const StyledCard = styled(Card)({
    transition: 'transform 0.3s', // Adding transition for hover effect
    '&:hover': {
        transform: 'scale(1.05)', // Scale up the card on hover
    },
});

// Define the CardComponent
const CardComponent: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_CHART'); // Replace with your API endpoint
                const jsonData = await response.json();
                setData(jsonData.slice(0, 9));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Grid container spacing={2} style={{ marginTop: "5%" }}>
            {loading ? (
                // Show loading indicator if data is being fetched
                <Grid item xs={12}>
                    <CircularProgress />
                </Grid>
            ) : (
                // Map through data and render styled cards
                data.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <StyledCard>
                            <CardContent>
                                <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', height: 'auto' }} />
                                <Typography variant="h5">{item.name}</Typography>
                                <Typography variant="body1">{item.description}</Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default CardComponent;
