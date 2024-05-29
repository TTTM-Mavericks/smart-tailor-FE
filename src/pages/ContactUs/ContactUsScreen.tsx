import React, { useRef } from 'react';
import { Container, Typography, Box, Button, Grid, TextField } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import styles from './ContactUsStyles.module.scss';
import brandImage from '../../../src/assets/img/avatar.jpg';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import HeaderComponent from '../../components/Header/HeaderComponent';
import FooterComponent from '../../components/Footer/FooterComponent';
import { useTranslation } from 'react-i18next';

const ContactUsPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    const storyRef = useRef(null);
    const isStoryVisible = useInView(storyRef, { once: true });

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
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={styles['contact-us']}
            >
                <Container maxWidth="md">
                    <Box textAlign="center" mb={4}>
                        <motion.div variants={itemVariants}>
                            <Typography variant="h4" component="h1" gutterBottom color="black">
                                Contact Us
                            </Typography>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Typography variant="body1" color="textSecondary">
                                {t(codeLanguage + '000085')}
                            </Typography>
                        </motion.div>
                    </Box>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <motion.div variants={itemVariants}>
                                <Box bgcolor="background.paper" p={4} borderRadius={4}>
                                    <img src={brandImage} alt="Brand" className={styles['brand-image']} />
                                    <Typography variant="h6" gutterBottom color="black">
                                        {t(codeLanguage + '000095')}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" gutterBottom>
                                        {t(codeLanguage + '000086')}
                                    </Typography>
                                    <Button variant="contained" style={{ backgroundColor: "#E96208" }} className={styles['animated-button']}>
                                        {t(codeLanguage + '000087')}
                                    </Button>
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div variants={itemVariants}>
                                <Box bgcolor="background.paper" p={4} borderRadius={4}>
                                    <Typography variant="h6" gutterBottom color="black">
                                        {t(codeLanguage + '000088')}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" gutterBottom>
                                        {t(codeLanguage + '000089')}
                                    </Typography>
                                    <TextField
                                        label={t(codeLanguage + '000097')}
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label={t(codeLanguage + '000098')}
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label={t(codeLanguage + '000099')}
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label={t(codeLanguage + '000100')}
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label={t(codeLanguage + '000101')}
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={6}
                                        margin="normal"
                                    />
                                    <Button variant="contained" style={{ backgroundColor: "#E96208" }} className={styles['animated-button']}>
                                        {t(codeLanguage + '000096')}
                                    </Button>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                    <Box mt={4} ref={storyRef}>
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate={isStoryVisible ? "visible" : "hidden"}
                        >
                            <Typography variant="h6" gutterBottom color="black">
                                {t(codeLanguage + '000094')}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {t(codeLanguage + '000090')}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {t(codeLanguage + '000091')}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {t(codeLanguage + '000092')}
                            </Typography>
                        </motion.div>
                    </Box>
                    <Box mt={4} textAlign="center">
                        <motion.div variants={itemVariants}>
                            <Typography variant="h6" gutterBottom color="black">
                                {t(codeLanguage + '000093')}
                            </Typography>
                            <div className={styles['social-icons']}>
                                <motion.a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaFacebook color='#E96208' />
                                </motion.a>
                                <motion.a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaTwitter color='#E96208' />
                                </motion.a>
                                <motion.a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaInstagram color='#E96208' />
                                </motion.a>
                            </div>
                        </motion.div>
                    </Box>
                </Container>
            </motion.div>
            <FooterComponent />
        </div>
    );
};

export default ContactUsPage;