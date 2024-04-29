// ContactUs.tsx
import React from 'react';
import { Container, Typography, Box, Button, Grid, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import styles from './ContactUsStyles.module.scss';
import brandImage from '../../assets/img/landing-img/slider-bird1.jpg';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const ContactUsPage: React.FC = () => {
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
        },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={styles['contact-us']}
        >
            <Container maxWidth="md">
                <Box textAlign="center" mb={4}>
                    <motion.div variants={itemVariants}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Contact Us
                        </Typography>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Typography variant="body1" color="textSecondary">
                            Have a question or inquiry about our brand and clothing? Get in touch with us!
                        </Typography>
                    </motion.div>
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <motion.div variants={itemVariants}>
                            <Box bgcolor="background.paper" p={4} borderRadius={4}>
                                <img src={brandImage} alt="Brand" className={styles['brand-image']} />
                                <Typography variant="h6" gutterBottom>
                                    Our Brand
                                </Typography>
                                <Typography variant="body1" color="textSecondary" gutterBottom>
                                    Learn more about our brand's history, values, and commitment to quality.
                                </Typography>
                                <Button variant="contained" color="primary" className={styles['animated-button']}>
                                    Read More
                                </Button>
                            </Box>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <motion.div variants={itemVariants}>
                            <Box bgcolor="background.paper" p={4} borderRadius={4}>
                                <Typography variant="h6" gutterBottom>
                                    Leave a Message
                                </Typography>
                                <Typography variant="body1" color="textSecondary" gutterBottom>
                                    Let us know if you have any questions or feedback.
                                </Typography>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Message"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    margin="normal"
                                />
                                <Button variant="contained" color="primary" className={styles['animated-button']}>
                                    Submit
                                </Button>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
                <Box mt={4} textAlign="center">
                    <motion.div variants={itemVariants}>
                        <Typography variant="h6" gutterBottom color="black">
                            Follow Us
                        </Typography>
                        <div className={styles['social-icons']}>
                            <motion.a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaFacebook />
                            </motion.a>
                            <motion.a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaTwitter />
                            </motion.a>
                            <motion.a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaInstagram />
                            </motion.a>
                        </div>
                    </motion.div>
                </Box>
            </Container>
        </motion.div>
    );
};

export default ContactUsPage;