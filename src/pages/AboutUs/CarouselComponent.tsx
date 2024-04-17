import React, { useEffect, useState } from 'react';
import { Scrollbar, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import 'swiper/css';
import 'swiper/css/scrollbar';

const CarouselComponent = () => {
    const [data, setData] = useState<any>([]);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_CHART');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData.slice(0, 8));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection={isSmallScreen ? "column" : "row"}>
            <Box width={isSmallScreen ? "90%" : "100%"} padding={isSmallScreen ? "1rem" : "2rem"} >
                <Typography variant="h4" color="textPrimary" gutterBottom>
                    Spotlight
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                    More than 300 of the most covetable luxury brands at ST-TTTM ready for you to discover.
                </Typography>
            </Box>
            <Swiper
                modules={[Scrollbar, Autoplay]}
                slidesPerView={isSmallScreen ? 1 : 3}
                autoplay={{ delay: 2000 }}
                scrollbar={{ draggable: true }}
                style={{ height: isSmallScreen ? "auto" : "500px", width: isSmallScreen ? "100%" : "300%" }}
            >
                {data.map((item: any, index: any) => (
                    <SwiperSlide key={index}>
                        <Box display="flex" flexDirection="column" alignItems="center" padding="1rem">
                            <img src={item.imageUrl} alt={item.name} style={{ width: isSmallScreen ? "100%" : "286px", height: isSmallScreen ? "auto" : "350px" }} />
                            <Typography variant="h5" color="textPrimary" gutterBottom>
                                {item.name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                {item.description}
                            </Typography>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
}

export default CarouselComponent;
