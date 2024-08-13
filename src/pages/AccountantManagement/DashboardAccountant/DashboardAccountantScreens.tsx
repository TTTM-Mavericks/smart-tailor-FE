import React, { useState, useEffect } from 'react';
import Sidebar from '../GlobalComponent/SidebarComponent/SidebarComponent';
import Navbar from '../GlobalComponent/NavbarComponent/NavbarComponent';
import { IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import AccountantDashboards from '../AccountantDashboard/AccountantDashboardScreen';
import AccountantManagePaymentForBrandComponent from '../AccountantManagePaymentForBrand/AccountantManagePaymentForBrandComponent';
import AccountantDashboard from '../AccountantDashboard/AccountantDashboardScreen';
import AccountantManageRefundPaymentForBrandComponent from '../AccountantManageRefundPayment/AccountantManageRefundPaymentForBrandComponent';

// Define the type for popperOpen
type PopperOpenState = Record<string, boolean>;

const DashboardAccountantScreens: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('accountant_dashboard');
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [popperOpen, setPopperOpen] = useState<PopperOpenState>({ // Initialize with type
        notification: false,
        user: false,
    });

    useEffect(() => {
        // Get the active tab from localStorage on component mount
        const savedActiveMenu = localStorage.getItem('accountantActiveMenu');
        if (savedActiveMenu) {
            setActiveMenu(savedActiveMenu);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuClick = (menu: string) => { // Updated to string type
        setActiveMenu(menu);
        // Save the active tab to localStorage
        localStorage.setItem('accountantActiveMenu', menu);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
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

    const togglePopper = (key: string) => { // Accept any string key
        setPopperOpen((prev) => ({
            ...prev,
            [key]: !prev[key], // Toggle the specific key
        }));
    };

    const renderComponent = () => {
        switch (activeMenu) {
            case 'accountant_manage_brand_payment':
                return (
                    <AccountantManagePaymentForBrandComponent />
                );
            case 'accountant_dash':
                return (
                    <AccountantDashboard />
                );
            case 'accountant_manage_refund_payment':
                return (
                    <AccountantManageRefundPaymentForBrandComponent />
                );
            default:
                return (
                    <AccountantManagePaymentForBrandComponent />
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

export default DashboardAccountantScreens;
