import * as React from "react";
import {
    MenuItem,
    InputBase,
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItemIcon,
    SwipeableDrawer,
    Menu,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    useColorScheme,
    useTheme,
    Card,
} from "@mui/material";
import { tokens } from "../../../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Logout, Settings } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LanguageEmployeeSetting from "../LanguageEmployee/LanguageEmployeeSettingComponent";
import NotificationEmployeeComponent from "../Notification/NotificationEmployeeComponent";

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const TopbarEmployeeComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { mode, setMode } = useColorScheme();
    // open setting
    const [state, setState] = React.useState({ right: false });

    // button group for dark mode/ light mode
    const [alignment, setAlignment] = React.useState('dark');

    // open menu account
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (e: any) => {
        setMode(e.target.value)
    }

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const list = (anchor: Anchor) => (
        <Box
            sx={{
                width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
                padding: '16px', // Add padding for better spacing
            }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                >
                    <ToggleButton value="light" sx={{ color: 'black' }}>
                        Light
                    </ToggleButton>
                    <ToggleButton value="system" sx={{ color: 'black' }}>
                        System
                    </ToggleButton>
                    <ToggleButton value="dark" sx={{ color: 'black' }}>
                        Dark
                    </ToggleButton>
                </ToggleButtonGroup>
            </List>
        </Box>
    );

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

    // Logout 
    const handleLogout = () => {
        //Logout Function
        localStorage.clear()
        window.location.href = 'https://smart-tailor-fe.pages.dev/auth/signin'
    }

    return (
        <Card sx={{ backgroundColor: `${colors.primary[100]} !important` }} >
            <Box display="flex" justifyContent="space-between" p={2} >


                {/* SEARCH BAR */}
                <Box
                    display="flex"
                    borderRadius="3px"
                    sx={{ backgroundColor: colors.primary[400] }}
                >
                    <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                    <IconButton type="button" sx={{ p: 1 }}>
                        <SearchIcon />
                    </IconButton>
                </Box>

                {/* ICONS */}
                <Box display="flex">
                    {/* EN VI Mode */}
                    <LanguageEmployeeSetting />

                    {/* Dark Light Mode */}
                    <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                        {theme.palette.mode === "dark" ? (
                            <DarkModeOutlinedIcon />
                        ) : (
                            <LightModeOutlinedIcon />
                        )}
                    </IconButton>

                    {/* Notification */}
                    <NotificationEmployeeComponent />

                    {/* Setting */}
                    <IconButton onClick={toggleDrawer('right', true)}>
                        <SettingsOutlinedIcon />
                    </IconButton>

                    <SwipeableDrawer
                        anchor="right"
                        open={state.right}
                        onClose={toggleDrawer('right', false)}
                        onOpen={toggleDrawer('right', true)}
                    >
                        {list('right')}
                    </SwipeableDrawer>

                    {/* Account Setting Dropdown Menu */}
                    <React.Fragment>
                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <Tooltip title={t(codeLanguage + '000044')}>
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem>
                                <Link to={"/employee_profile"} style={{ display: "flex", textDecoration: "none", color: colors.primary[200] }}>
                                    <Avatar /> {t(codeLanguage + '000045')}
                                </Link>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                {t(codeLanguage + '000046')}
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                {t(codeLanguage + '000047')}
                            </MenuItem>
                        </Menu>
                    </React.Fragment>
                </Box>
            </Box >
        </Card >

    );
};

export default TopbarEmployeeComponent;
