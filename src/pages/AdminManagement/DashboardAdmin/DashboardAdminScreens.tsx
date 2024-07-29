import React, { useState, useEffect } from 'react';
import Sidebar from '../GlobalComponent/SidebarComponent/SidebarComponent';
import Navbar from '../GlobalComponent/NavbarComponent/NavbarComponent';
import { IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import CardInformationDetailComponent from '../CardInformationDetail/CardInformationDetailComponent';
import GeographyChartComponent from '../GeographyChart/GeographyChartComponent';
import BarChartComponent from '../BarChart/BarChartComponent';
import LineChartComponent from '../LineChart/LineChartComponent';
import PieChartComponent from '../PieChart/PieChartComponent';
import DashboardFAQScreens from '../GlobalComponent/FAQ/DashboardFAQComponent';
import ProfileSetup from '../AdminProfile/AdminProfileSettingComponent';
import ManageMaterials from '../ManageMaterials/AdminMaterialManagerment/AdminManagerScreen/ManageMaterialScreens';
import AdminManagePrice from '../ManagePrice/AdminPriceManagement/AdminManagementScreen/ManagePriceScreens';
import ManageSizes from '../ManageSize/AdminSizeManagement/AdminManagerScreen/ManageSizeScreens';
import ManageCategories from '../ManageCategory/AdminCategoryManagement/AdminManagerScreen/ManageCategoryScreens';
import AdminConfiguration from '../SystemConfigurationAdministration/SystemConfigurationAdministrationScreen';

const DashboardAdminScreens = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('admin_dashboard');
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [popperOpen, setPopperOpen] = useState({});

    useEffect(() => {
        // Get the active tab from localStorage on component mount
        const savedActiveMenu = localStorage.getItem('activeMenu');
        if (savedActiveMenu) {
            setActiveMenu(savedActiveMenu);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuClick = (menu: any) => {
        setActiveMenu(menu);
        // Save the active tab to localStorage
        localStorage.setItem('activeMenu', menu);
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (event.target instanceof Element) {
                if (!event.target.closest('.popover')) {
                    setPopperOpen({
                        notification: false,
                        user: false,
                    });
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const _handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const togglePopper = (key: any) => {
        setPopperOpen((prev) => ({
            notification: key === 'notification' ? !prev.notification : false,
            user: key === 'user' ? !prev.user : false,
        }));
    };

    const renderComponent = () => {
        switch (activeMenu) {
            case 'admin_profile':
                return <ProfileSetup />;
            case 'admin_manage_material':
                return (
                    <>
                        <ManageMaterials />
                        <div style={{ display: "flex", marginBottom: 100 }}>
                            <ManageCategories />
                            <ManageSizes />
                        </div>
                    </>
                );
            case 'admin_manage_price':
                return <AdminManagePrice />;
            case 'admin_faq':
                return <DashboardFAQScreens />;
            case 'geography_chart':
                return <GeographyChartComponent />;
            case 'line_chart':
                return <LineChartComponent />;
            case 'bar_chart':
                return <BarChartComponent />;
            case 'pie_chart':
                return <PieChartComponent />;
            case 'system_configuration':
                return <AdminConfiguration />;
            default:
                return (
                    <>
                        <CardInformationDetailComponent />
                        <GeographyChartComponent />
                        <div style={{ display: "flex" }}>
                            <BarChartComponent />
                            <PieChartComponent />
                        </div>
                        <LineChartComponent />
                    </>
                );
        }
    };

    return (
        <div className="flex">
            <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} activeMenu={activeMenu} handleMenuClick={handleMenuClick} />
            <div className="flex flex-col w-full">
                <Navbar toggleMenu={toggleMenu} menu={activeMenu} popperOpen={popperOpen} togglePopper={togglePopper} />
                <main className="p-6 flex-grow ml-0 xl:ml-[20%]">
                    {renderComponent()}
                </main>
                {showScrollButton && (
                    <IconButton
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 100,
                            backgroundColor: "#E96208",
                            color: "white"
                        }}
                        onClick={_handleScrollToTop}
                    >
                        <ArrowUpward />
                    </IconButton>
                )}
            </div>
        </div>
    );
};

export default DashboardAdminScreens;
