import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Typography, Box, Button, Avatar, Fade, CardMedia, Card, CardContent, CardActionArea } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarouselComponent from './CarouselComponent';
import CardComponent from './FilterComponent';

const StyledBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(6, 2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledTeamMember = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const StyledAvatar = styled(Avatar)({
    width: 120,
    height: 120,
    marginBottom: 16,
});

const StyledFooter = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    textAlign: 'center',
}));

const StyledCardCarousel = styled(Slider)({
    marginTop: 32,
    marginBottom: 32,
});

const StyledCard = styled(Card)({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
});

const AboutUsPage: React.FC = () => {
    const cardSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div>
            <StyledBox>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <Fade in timeout={800}>
                            <Typography variant="h3" gutterBottom>
                                About Our Tailoring
                            </Typography>
                        </Fade>
                        <Fade in timeout={1200}>
                            <Typography variant="body1" paragraph>
                                Our tailoring business has a rich history of providing high-quality clothing and
                                exceptional customer service. We take pride in our attention to detail and
                                commitment to making our clients look and feel their best.
                            </Typography>
                        </Fade>
                        <Fade in timeout={1600}>
                            <Button variant="contained" color="secondary">
                                Learn More
                            </Button>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Fade in timeout={800}>
                            <Typography variant="h3" gutterBottom>
                                Our Clothing Collection
                            </Typography>
                        </Fade>
                        <StyledCardCarousel {...cardSettings}>
                            {[1, 2, 3, 4, 5, 6].map((_, index) => (
                                <Fade in timeout={(index + 1) * 400} key={index}>
                                    <StyledCard>
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={`/product-${index + 1}.jpg`}
                                                alt={`Product ${index + 1}`}
                                            />
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Product {index + 1}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </StyledCard>
                                </Fade>
                            ))}
                        </StyledCardCarousel>
                    </Grid>
                </Grid>
            </StyledBox>

            <Fade in timeout={800}>
                <Typography variant="h3" gutterBottom align="center" sx={{ marginTop: 6 }} style={{ color: "black" }}>
                    About Our Services
                </Typography>
            </Fade>

            <CarouselComponent />
            <CardComponent />
            <Fade in timeout={800}>
                <Typography variant="h3" gutterBottom align="center" sx={{ marginTop: 6 }} style={{ color: "black" }}>
                    Our Talented Team
                </Typography>
            </Fade>
            <Grid container spacing={3} sx={{ marginTop: 4 }}>
                {[1, 2, 3, 4].map((_, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                        <Fade in timeout={(index + 1) * 400}>
                            <StyledTeamMember>
                                <StyledAvatar src={`../../../../src/assets/img/avatar.jpg`} />
                                <Typography variant="h6" style={{ color: "black" }}>Tam Thanh</Typography>
                                <Typography variant="body2" style={{ color: "black" }}>Member Tailor</Typography>
                            </StyledTeamMember>
                        </Fade>
                    </Grid>
                ))}
            </Grid>

            <StyledFooter>
                <Fade in timeout={800}>
                    <Typography variant="body1">
                        &copy; 2023 Tailor Shop. All rights reserved.
                    </Typography>
                </Fade>
            </StyledFooter>
        </div>
    );
};

export default AboutUsPage;