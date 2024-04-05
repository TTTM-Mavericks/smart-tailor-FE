import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, useMediaQuery, useTheme, Box } from '@mui/material';

export default function VerticalGridSlide() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [gridsToShow, setGridsToShow] = useState(2); // Always start with 2 items on small screens
    const [data, setData] = useState<any>([]);
    const [showLoadMoreButton, setShowLoadMoreButton] = useState(true); // Always show Load More button on small screens

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_CHART');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setData(jsonData.slice(0, 6)); // Limit to the first 5 items
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleLoadMore = () => {
        // Toggle between showing 2 and 5 items
        setGridsToShow(gridsToShow === 2 ? 6 : 2);
        setShowLoadMoreButton(false);
    };

    return (
        <Box style={{ marginBottom: "10%", display: "flex", flexDirection: "row", backgroundColor: "black" }}>
            <Box style={{ flex: "1" }}>
                <Typography style={{ color: "white" }}>Helloo bae</Typography>
            </Box>
            <Box style={{ flex: "2" }}>
                <Grid container spacing={isSmallScreen ? 2 : 6} justifyContent="center" alignItems="center">
                    {data.slice(0, gridsToShow).map((item: any, index: any) => (
                        <Grid key={index} item xs={12} md={6}>
                            <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: 'auto' }} />
                            <Typography variant={isSmallScreen ? "subtitle1" : "h6"} color="textPrimary" align="center" gutterBottom>{item.name}</Typography>
                            <Typography variant={isSmallScreen ? "body2" : "body1"} color="textSecondary" align="center">
                                {item.description}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                {showLoadMoreButton && isSmallScreen && (
                    <Button variant="outlined" onClick={handleLoadMore} sx={{ mt: 2, mx: 'auto', display: 'block' }}>
                        {gridsToShow === 2 ? "Load More" : "Show Less"}
                    </Button>
                )}
            </Box>
        </Box>
    );
}
