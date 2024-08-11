import React, { useState } from 'react';
import { Box, Button, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Container, Paper } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { ExpertTailoring } from "../../../../../models/ManagerExpertTailoringModel";
import Navbar from "../../../GlobalComponent/NavBarComponent/NavbarComponent";
import Sidebar from "../../../GlobalComponent/SideBarComponent/SideBarComponent";

interface FeedbackComponentProps {
    selectedRow: ExpertTailoring | null;
}

const FeedbackComponent: React.FC<FeedbackComponentProps> = ({ selectedRow }) => {
    const location = useLocation();
    const rowData = location.state;

    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('expert_tailoring');

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        rating: '',
        suggestions: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <Box display="flex">
            <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} activeMenu={activeMenu} handleMenuClick={handleMenuClick} />
            <Box flex={1} display="flex" flexDirection="column">
                <Navbar toggleMenu={toggleMenu} />
                <Container component="main" maxWidth="md" sx={{ mt: 4, mr: 20 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Report for: {rowData.expertTailoringName}
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                            <TextField
                                name="firstName"
                                label="First Name"
                                fullWidth
                                value={formData.firstName}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                name="lastName"
                                label="Last Name"
                                fullWidth
                                value={formData.lastName}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                            />
                            <FormControl component="fieldset" margin="normal">
                                <FormLabel component="legend">Please provide your feedback on the quality of our service</FormLabel>
                                <RadioGroup row name="rating" value={formData.rating} onChange={handleChange}>
                                    {['Excellent', 'Very Good', 'Good', 'Average', 'Poor', 'Other'].map((rating) => (
                                        <FormControlLabel key={rating} value={rating} control={<Radio />} label={rating} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <TextField
                                name="suggestions"
                                label="Do you have suggestions on what we can do to provide you with a better service?"
                                fullWidth
                                multiline
                                rows={4}
                                value={formData.suggestions}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default FeedbackComponent;
