import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Menu, useScrollTrigger } from '@mui/material';
import { styled } from '@mui/system';

// Styled Components
const StyledAppBar = styled(AppBar)({
    backgroundColor: '#fff',
    color: '#2a2a2a',
});

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
});

const NavLink = styled(Button)`
  position: relative;
  margin-left: 1rem;
  color: inherit;
  text-transform: none;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #2a2a2a;
    transform: scaleX(0);
    transition: transform 0.7s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const DropdownMenu = styled(Menu)({
    backgroundColor: '#000',
    color: '#fff',
});

// HeaderAboutUsComponent Component
const HeaderAboutUsComponent: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [lastScrollPos, setLastScrollPos] = useState(0);
    const [hideOnScroll, setHideOnScroll] = useState(false);

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            if (currentScrollPos > lastScrollPos) {
                // Scrolling down
                setHideOnScroll(true);
            } else {
                // Scrolling up
                setHideOnScroll(false);
            }
            setLastScrollPos(currentScrollPos <= 0 ? 0 : currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPos]);

    return (
        <StyledAppBar position="fixed" style={{ transform: hideOnScroll ? 'translateY(-100%)' : 'translateY(0)', transition: 'transform 0.3s ease' }}>
            <StyledToolbar>
                <Typography variant="h6">ION</Typography>
                <Box>
                    <NavLink>WHAT'S ON</NavLink>
                    <NavLink
                        aria-controls="shop-menu"
                        aria-haspopup="true"
                        onClick={handleButtonClick}
                    >
                        SHOP
                    </NavLink>
                    <NavLink>DINE</NavLink>
                    <NavLink>DEALS</NavLink>
                    <NavLink>ION+ REWARDS</NavLink>
                    <NavLink>TOURISTS</NavLink>
                    <NavLink>THE ION EDIT</NavLink>
                </Box>
            </StyledToolbar>
            <DropdownMenu
                id="shop-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'shop-button',
                }}
                onClick={(event) => event.stopPropagation()} // Prevent menu from closing on click inside
            >
                {/* Dropdown Card Content */}
                <Box p={2}>
                    <Typography variant="h6">CATEGORIES</Typography>
                    <Box mt={2}>
                        <Typography>Luxury Fashion &amp; Accessories</Typography>
                        <Typography>Handbags, Shoes &amp; Accessories</Typography>
                        <Typography>Jewellery &amp; Watches</Typography>
                        <Typography>Fine Jewellery &amp; Watches</Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography>Wellness Services</Typography>
                        <Typography>Fashion</Typography>
                        <Typography>Lifestyle</Typography>
                        <Typography>Beauty</Typography>
                    </Box>
                </Box>
            </DropdownMenu>
        </StyledAppBar>
    );
};

export default HeaderAboutUsComponent;
