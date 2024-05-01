import React, { useRef } from 'react';
import { Container, Typography, Box, Button, Grid, TextField } from '@mui/material';
import { motion, useScroll, useInView } from 'framer-motion';
import styles from './ContactUsStyles.module.scss';
import brandImage from '../../../src/assets/img/avatar.jpg';
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
            transition: {
                duration: 0.5,
            },
        },
    };

    const storyRef = useRef(null);
    const isStoryVisible = useInView(storyRef, { once: true });

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
                        <Typography variant="h4" component="h1" gutterBottom color="black">
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
                                <Button variant="contained" style={{ backgroundColor: "#E96208" }} className={styles['animated-button']}>
                                    Read More
                                </Button>
                            </Box>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <motion.div variants={itemVariants}>
                            <Box bgcolor="background.paper" p={4} borderRadius={4}>
                                <Typography variant="h6" gutterBottom color="black">
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
                                    label="Phone Number"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Subject"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Message"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={6}
                                    margin="normal"
                                />
                                <Button variant="contained" style={{ backgroundColor: "#E96208" }} className={styles['animated-button']}>
                                    Submit
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
                        <Typography variant="h6" gutterBottom>
                            Our Story
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            Learn more about our brand's history, values, and commitment to quality. We have been dedicated to providing high-quality clothing and excellent customer service since our founding in 2024. Our mission is to create stylish and comfortable apparel that empowers individuals to express their unique personalities.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            At TTTM - Smart Tailor, we believe that fashion should be accessible to everyone. That's why we strive to offer a wide range of sizes, styles, and price points to cater to diverse needs and preferences. Our team of talented designers works tirelessly to create trendy and timeless pieces that you'll love to wear season after season.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            We are committed to sustainable and ethical practices throughout our entire supply chain. From sourcing high-quality materials to ensuring fair labor practices, we prioritize responsible and eco-friendly production methods. By choosing TTTM - Smart Tailor, you can feel good about your purchase, knowing that you're contributing to a more sustainable future.
                        </Typography>
                    </motion.div>
                </Box>
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
    );
};

export default ContactUsPage;