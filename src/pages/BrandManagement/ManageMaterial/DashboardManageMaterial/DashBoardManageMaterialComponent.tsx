import React, { useEffect, useState } from 'react';
import Sidebar from '../../GlobalComponent/SideBarComponent/SideBarComponent';
import Navbar from '../../GlobalComponent/NavBarComponent/NavbarComponent';
import ManageMaterialComponent from '../MaterialManage/MaterialManageScreens';
import BrandProfileSetup from '../../BrandProfile/BrandProfileComponent';
import ManagePrice from '../../ManagePrice/BrandPriceManagement/BrandManagementScreen/ManagePriceScreens';
import OrderRequestScreen from '../../BrandOrderManagement/OrderRequestScreen';
import UploadBrandInforForm from '../../BrandUploadInfor/BrandUploadInforComponent';
import NotificationPage from '../../ManageNotification/NotificationPageComponent';
import BrandManageOrderProcessingComponent from '../../BrandOrderProcessing/BrandManageOrderProcessingComponent';
import BrandManageOrder from '../../ManageOrder/BrandOrderManagement/ManageOrderScreen';

const DashboardManageMaterialScreen = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('manage_notification');
    const [showScrollButton, setShowScrollButton] = React.useState<boolean>(false);
    const [popperOpen, setPopperOpen] = useState<Record<string, boolean>>({});

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        // Get the active tab from localStorage on component mount
        const savedActiveMenu = localStorage.getItem('brandActiveMenu');
        if (savedActiveMenu) {
            setActiveMenu(savedActiveMenu);
        }
    }, []);

    const handleMenuClick = (menu: any) => {
        setActiveMenu(menu);
        // Save the active tab to localStorage
        localStorage.setItem('brandActiveMenu', menu);
    }

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

    React.useEffect(() => {
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
            case '/brand/manage_order_request/:id':
                return <UploadBrandInforForm />;
            case 'manage_notification':
                return <NotificationPage></NotificationPage>;
            case 'brand_profile':
                return <BrandProfileSetup />;
            case 'manage_order':
                return <BrandManageOrder></BrandManageOrder>;
            case 'manage_order_processing':
                return <BrandManageOrderProcessingComponent></BrandManageOrderProcessingComponent>;
            case 'manage_price':
                return <ManagePrice />;
            case 'manage_material':
                return <ManageMaterialComponent />;
            case 'manage_order_request':
                return <OrderRequestScreen />;
            default:
                return (
                    <ManageMaterialComponent />
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
            </div>
        </div>
    );
};

export default DashboardManageMaterialScreen;
