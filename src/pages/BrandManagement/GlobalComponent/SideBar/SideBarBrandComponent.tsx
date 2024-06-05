import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../../theme";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

interface ItemProps {
    title: string;
    to: string;
    icon: React.ReactNode;
    selected: string;
    setSelected: (selected: string) => void;
}

const Item: React.FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const _handleItemClick = () => {
        setSelected(title);
        localStorage.setItem('selectedMenuItem', title);
    };

    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.primary[200],
            }}
            onClick={_handleItemClick}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const SideBarBrandComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [isCollapsed, setIsCollapsed] = useState(() => {
        // Retrieve the state from local storage or set the default state
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState ? JSON.parse(savedState) : false;
    });

    // Update local storage when isCollapsed state changes
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    const [selected, setSelected] = useState(() => {
        const savedSelected = localStorage.getItem('selectedMenuItem');
        return savedSelected || t(codeLanguage + '000019');
    })


    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[600]} !important`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: `${colors.primary[600]} !important`,
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#E96208 !important",
                },
                "& .pro-menu-item.active": {
                    color: "#E96208 !important",
                },
            }}
        >
            <ProSidebar collapsed={isCollapsed} breakPoint="md">
                <Menu>
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.primary[300],
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h6" color={colors.primary[200]}>
                                    {/* {t(codeLanguage + '000034')} */}
                                    Employee
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img
                                    alt="profile-user"
                                    width="100px"
                                    height="100px"
                                    src={`../../../../../src/assets/img/avatar.jpg`}
                                    style={{ cursor: "pointer", borderRadius: "50%" }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="h5" color={colors.primary[200]} sx={{ m: "10px 0 0 0" }}>
                                    {/* {t(codeLanguage + '000035')} */}
                                    Employee ST
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title={t(codeLanguage + '000019')}
                            to="/brand"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h6"
                            color={colors.primary[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                            style={{ fontSize: "15px" }}
                        >
                            {t(codeLanguage + '000033')}
                        </Typography>
                        <Item
                            // title={t(codeLanguage + '000020')}
                            title='Manage Notification'
                            to="/brand_manage_notification"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            // title={t(codeLanguage + '000020')}
                            title='Manage Customer'
                            to="/manager_customer"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            // title={t(codeLanguage + '000022')}
                            title="Manage Brand"
                            to="/manage_brand"
                            icon={<ReceiptOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            // title={t(codeLanguage + '000020')}
                            title='Manage Order'
                            to="/manager_order"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            // title={t(codeLanguage + '000023')}
                            title="Manage Report"
                            to="/manage_report"
                            icon={<PersonOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            // title={t(codeLanguage + '000023')}
                            title="Manage Transaction"
                            to="/manage_transaction"
                            icon={<PersonOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            // title={t(codeLanguage + '000023')}
                            title="Manage Material"
                            to="/manage_material"
                            icon={<PersonOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            // title={t(codeLanguage + '000021')}
                            title="Profile"
                            to="/brand_profile"
                            icon={<ContactsOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default SideBarBrandComponent;
