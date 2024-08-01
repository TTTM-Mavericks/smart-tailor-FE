import React, { useEffect, useState, useRef } from 'react';
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
import BrandProductivityInputDialog from '../../GlobalComponent/Dialog/BrandProductivity/BrandProductivityInputDialog';

const DashboardManageMaterialScreen = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const [activeMenu, setActiveMenu] = useState('manage_notification');
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [popperOpen, setPopperOpen] = useState<Record<string, boolean>>({});

    const [showProductivityDialog, setShowProductivityDialog] = useState(false);
    const [userAuth, setUserAuth] = useState<any>(null);
    const checkPerformed = useRef(false);

    useEffect(() => {
        if (!checkPerformed.current) {
            const isFirstLogin = localStorage.getItem('brandFirstLogin');
            const dialogShown = sessionStorage.getItem('productivityDialogShown');
            const userAuthData = JSON.parse(localStorage.getItem('userAuth') || '{}');
            setUserAuth(userAuthData);

            if (isFirstLogin === 'true' && dialogShown !== 'true') {
                setShowProductivityDialog(true);
                sessionStorage.setItem('productivityDialogShown', 'true');
            }
            checkPerformed.current = true;
        }
    }, []);

    const handleCloseProductivityDialog = () => {
        setShowProductivityDialog(false);
        sessionStorage.setItem('productivityDialogShown', 'false');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const savedActiveMenu = localStorage.getItem('brandActiveMenu');
        if (savedActiveMenu) {
            setActiveMenu(savedActiveMenu);
        }
    }, []);

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
        localStorage.setItem('brandActiveMenu', menu);
    }

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
            setShowScrollButton(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScrollToTop = () => {
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
            case '/brand/manage_order_request/:id':
                return <UploadBrandInforForm />;
            case 'manage_notification':
                return <NotificationPage />;
            case 'brand_profile':
                return <BrandProfileSetup />;
            case 'manage_order':
                return <BrandManageOrder />;
            case 'manage_order_processing':
                return <BrandManageOrderProcessingComponent />;
            case 'manage_price':
                return <ManagePrice />;
            case 'manage_material':
                return <ManageMaterialComponent />;
            case 'manage_order_request':
                return <OrderRequestScreen />;
            default:
                return <ManageMaterialComponent />;
        }
    };

    return (
        <div className="flex">
            <Sidebar
                menuOpen={menuOpen}
                toggleMenu={toggleMenu}
                activeMenu={activeMenu}
                handleMenuClick={handleMenuClick}
            />
            <div className="flex flex-col w-full">
                <Navbar
                    toggleMenu={toggleMenu}
                    menu={activeMenu}
                    popperOpen={popperOpen}
                    togglePopper={togglePopper}
                />
                {showProductivityDialog && (
                    <BrandProductivityInputDialog
                        isOpen={showProductivityDialog}
                        onClose={handleCloseProductivityDialog}
                        brandID={userAuth?.userID}
                    />
                )}
                <main className="p-6 flex-grow ml-0 xl:ml-[20%]">
                    {renderComponent()}
                </main>
            </div>
            {showScrollButton && (
                <button
                    onClick={handleScrollToTop}
                    className="fixed bottom-5 right-5 bg-blue-500 text-white p-2 rounded-full"
                >
                    Scroll to Top
                </button>
            )}
        </div>
    );
};

export default DashboardManageMaterialScreen;