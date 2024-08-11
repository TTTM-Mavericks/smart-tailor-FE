import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/SidebarComponent';
import { ProfileSettings } from '../../../Authentication';
import OrderHistory from '../../OrderHistory/OrderHistoryScreen';
import ReportHistorySreen from '../../ReportHistory/ReportHistorySreen';
import RefundTransactionHistoryScreen from '../../RefundTransactionHistory/RefundTransactionHistoryScreen';
import DesignCollectionScreen from '../../../DesignCollection/DesignCollectionContainer/DesignCollectionScreen';
import HeaderComponent from '../../../../components/Header/HeaderComponent';
import FooterComponent from '../../../../components/Footer/FooterComponent';

const DashboardCustomerScreen = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('profile_setting');
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [popperOpen, setPopperOpen] = useState<Record<string, boolean>>({});

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        // Get the active tab from localStorage on component mount
        const savedActiveMenu = localStorage.getItem('customerActiveMenu');
        if (savedActiveMenu) {
            setActiveMenu(savedActiveMenu);
        }
    }, []);

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
        // Save the active tab to localStorage
        localStorage.setItem('customerActiveMenu', menu);
    };

    // Effect to close popper on outside click
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

    const togglePopper = (key: string) => {
        setPopperOpen((prev) => ({
            notification: key === 'notification' ? !prev.notification : false,
            user: key === 'user' ? !prev.user : false,
        }));
    };

    const renderComponent = () => {
        switch (activeMenu) {
            case 'profile_setting':
                return <ProfileSettings />;
            case 'order_history':
                return <OrderHistory />;
            case 'report_history':
                return <ReportHistorySreen />;
            case 'refund_history':
                return <RefundTransactionHistoryScreen />;
            case 'design_collection':
                return <DesignCollectionScreen />;
            default:
                return <ProfileSettings />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderComponent />
            <main className="flex flex-grow">
                <div className="w-full xl:w-1/5">
                    <Sidebar
                        menuOpen={menuOpen}
                        toggleMenu={toggleMenu}
                        activeMenu={activeMenu}
                        handleMenuClick={handleMenuClick}
                    />
                </div>
                <div className="w-full xl:w-4/5 p-6">
                    {renderComponent()}
                </div>
            </main>
            <FooterComponent />
        </div>
    );
};

export default DashboardCustomerScreen;
