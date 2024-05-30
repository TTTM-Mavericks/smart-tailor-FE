import React, { useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Typography, Box, Button, Avatar, Fade, CardMedia, Card, CardContent, CardActionArea } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarouselComponent from './CarouselComponent';
import { motion, useInView } from 'framer-motion';
import brandImage from '../../assets/img/landing-img/slider-bird1.jpg';
import HeaderComponent from '../../components/Header/HeaderComponent';
import FooterComponent from '../../components/Footer/FooterComponent';
import { useTranslation } from 'react-i18next';

const StyledBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(6, 2),
    backgroundColor: "#E96208",
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

const StyledCardCarousel = styled(Slider)({
    marginTop: 32,
    marginBottom: 32,
    marginLeft: "6%"
});

const StyledCard = styled(Card)({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
});

const TestimonialCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
    marginBottom: theme.spacing(2),
}));

const StyledIconBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const StyledIcon = styled(Box)(({ theme }) => ({
    marginRight: theme.spacing(1),
    backgroundColor: "#E96208",
    color: "#E96208",
    padding: theme.spacing(1),
    borderRadius: '50%',
}));


const StyledContainer = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gridGap: theme.spacing(4),
    alignItems: 'center',
    marginTop: 140,
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
        gridGap: theme.spacing(2),
    },
    marginLeft: 42
}));

const StyledTextContent = styled(Box)({
    textAlign: 'left',
});

const StyledGallery = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 2fr',
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
    },
}));

const StyledImageBox = styled(Box)({
    position: 'relative',
    overflow: 'hidden',
    '&:hover img': {
        transform: 'scale(1.1)',
        transition: 'transform 0.3s',
    },
});

const StyledImageOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
    '&:hover': {
        opacity: 1,
    },
}));

const AboutUsPage: React.FC = () => {
    const cardSettings = {
        dots: true,
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

    const titleRef = useRef(null);
    const teamRef = useRef(null);
    const isTitleVisible = useInView(titleRef, { once: true });
    const isTeamVisible = useInView(teamRef, { once: true });

    const testimonialsRef = useRef(null);
    const isTestimonialsVisible = useInView(testimonialsRef, { once: true });

    const servicesRef = useRef(null);
    const isServicesVisible = useInView(servicesRef, { once: true });

    const containerRef = useRef(null);
    const isContainerVisible = useInView(containerRef, { once: true });

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    return (
        <div>
            <HeaderComponent />
            <StyledBox>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={5} style={{ marginTop: "10%" }}>
                        <Fade in timeout={1200}>
                            <Typography variant="body1" paragraph>
                                {t(codeLanguage + '000073')}
                            </Typography>
                        </Fade>
                        <Fade in timeout={1600}>
                            <Button variant="contained" style={{ color: "white", backgroundColor: "#088FE9" }}>
                                {t(codeLanguage + '000074')}
                            </Button>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} md={6} style={{ marginTop: "5%" }}>
                        {/* <Fade in timeout={800}>
                            <Typography variant="h3" gutterBottom style={{ marginLeft: "6%" }}>
                                {t(codeLanguage + '000077')}
                            </Typography>
                        </Fade> */}
                        <StyledCardCarousel {...cardSettings}>
                            {[1, 2, 3, 4, 5, 6].map((_, index) => (
                                <Fade in timeout={(index + 1) * 400} key={index} >
                                    <StyledCard >
                                        <CardActionArea >
                                            <CardMedia
                                                component="img"
                                                height="300"
                                                image={brandImage}
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


            <motion.div
                ref={titleRef}
                initial={{ opacity: 0, y: 50 }}
                animate={isTitleVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
            >
                <Typography variant="h3" gutterBottom align="center" sx={{ marginTop: 6 }} style={{ color: "black" }}>
                    {t(codeLanguage + '000075')}
                </Typography>
                <CarouselComponent />
            </motion.div>

            <motion.div
                ref={servicesRef}
                initial={{ opacity: 0, y: 50 }}
                animate={isServicesVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
            >
                <Typography variant="h3" gutterBottom align="center" sx={{ marginTop: 20 }} style={{ color: "black" }}>
                    {t(codeLanguage + '000080')}
                </Typography>
            </motion.div>

            <Grid container spacing={3} sx={{ marginTop: 4, paddingLeft: 4, paddingRight: 4 }}>
                {[1, 2, 3, 4].map((_, index) => (
                    <Grid item xs={12} md={3} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={isServicesVisible ? { opacity: 1, y: 0, transition: { delay: (index + 1) * 0.2, duration: 0.5 } } : {}}
                        >
                            <StyledIconBox>
                                <StyledIcon>
                                    <i className="fas fa-cut" />
                                </StyledIcon>
                                <Typography variant="h6" style={{ color: "black" }}>Custom Tailoring</Typography>
                            </StyledIconBox>
                            <Typography variant="body2" style={{ color: "black" }}>
                                We offer custom tailoring services to ensure a perfect fit and style for every client.
                            </Typography>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            <StyledContainer ref={containerRef}>
                <StyledTextContent
                    initial={{ opacity: 0, x: -50 }}
                    animate={isContainerVisible ? { opacity: 1, x: 0, transition: { duration: 0.5 } } : {}}
                >
                    <Typography variant="h2" gutterBottom style={{ color: "black" }}>
                        {t(codeLanguage + '000081')}
                    </Typography>
                    <Typography variant="body1" style={{ color: "black" }}>
                        {t(codeLanguage + '000082')}
                    </Typography>
                </StyledTextContent>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={isContainerVisible ? { opacity: 1, x: 0, transition: { duration: 0.5 } } : {}}
                >
                    <StyledGallery>
                        {[
                            'https://via.placeholder.com/300x400',
                            'https://via.placeholder.com/300x400',
                            'https://via.placeholder.com/300x400',
                            'https://via.placeholder.com/600x400',
                            'https://via.placeholder.com/300x400',
                            'https://via.placeholder.com/300x400',
                        ].map((image, index) => (
                            <StyledImageBox key={index}>
                                <img src={image} alt={`Image ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <StyledImageOverlay>
                                    <Typography variant="h6">Image {index + 1}</Typography>
                                </StyledImageOverlay>
                            </StyledImageBox>
                        ))}
                    </StyledGallery>
                </motion.div>
            </StyledContainer>

            <motion.div
                ref={testimonialsRef}
                initial={{ opacity: 0, y: 50 }}
                animate={isTestimonialsVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
            >
                <Typography variant="h3" gutterBottom align="center" sx={{ marginTop: 20 }} style={{ color: "black" }}>
                    {t(codeLanguage + '000083')}
                </Typography>
            </motion.div>

            <Grid container spacing={3} sx={{ marginTop: 4, paddingLeft: 4, paddingRight: 4 }}>
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={isTestimonialsVisible ? { opacity: 1, y: 0, transition: { delay: (index + 1) * 0.2, duration: 0.5 } } : {}}
                        >
                            <TestimonialCard>
                                <Typography variant="body1">
                                    "I had an amazing experience with this tailoring shop. They listened to my needs and created a perfect suit for me. The attention to detail and quality of work is truly exceptional."
                                </Typography>
                                <Typography variant="subtitle1" style={{ marginTop: 8 }}>
                                    - ITMEBEBE
                                </Typography>
                            </TestimonialCard>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>


            <motion.div
                ref={teamRef}
                initial={{ opacity: 0, y: 50 }}
                animate={isTeamVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
            >
                <Typography variant="h3" gutterBottom align="center" sx={{ marginTop: 20 }} style={{ color: "black" }}>
                    {t(codeLanguage + '000084')}
                </Typography>
            </motion.div>

            <Grid container spacing={3} sx={{ marginTop: 4, marginBottom: 10 }}>
                {[1, 2, 3, 4].map((_, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={isTeamVisible ? { opacity: 1, y: 0, transition: { delay: (index + 1) * 0.2, duration: 0.5 } } : {}}
                        >
                            <StyledTeamMember>
                                <StyledAvatar src={`../../../../src/assets/img/avatar.jpg`} />
                                <Typography variant="h6" style={{ color: "black" }}>Tam Thanh</Typography>
                                <Typography variant="body2" style={{ color: "black" }}>Member Tailor</Typography>
                            </StyledTeamMember>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
            <FooterComponent />
        </div>
    );
};

export default AboutUsPage;