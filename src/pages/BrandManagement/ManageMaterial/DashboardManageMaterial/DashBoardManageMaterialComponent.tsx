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
import { IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import BrandManageTransactionComponent from '../../BrandManageTransaction/BrandManageTransactionComponent';
import ExpertTailoringBrandManagerComponent from '../../BrandProperty/ManageExpertailoring/BrandManageExpertTailoringComponent';
import BrandManagePropertyComponent from '../../BrandProperty/ManageProperties/ManagePropertiesComponent';
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import axios from 'axios';
import { __getToken } from '../../../../App';
import Cookies from 'js-cookie';

const DashboardManageMaterialScreen = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const [activeMenu, setActiveMenu] = useState('manage_material');
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [popperOpen, setPopperOpen] = useState<Record<string, boolean>>({});

    const [showProductivityDialog, setShowProductivityDialog] = useState(false);
    const [userAuth, setUserAuth] = useState<any>(null);
    const checkPerformed = useRef(false);

    const _handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        if (!checkPerformed.current) {
            let authData;
            const userAuthCookie = Cookies.get('userAuth');
            const brandAuthCookie = Cookies.get('brandAuth');

            if (userAuthCookie) {
                try {
                    authData = JSON.parse(userAuthCookie);
                } catch (error) {
                    console.error("Error parsing userAuth cookie:", error);
                }
            } else if (brandAuthCookie) {
                try {
                    authData = JSON.parse(brandAuthCookie);
                } catch (error) {
                    console.error("Error parsing brandAuth cookie:", error);
                }
            }

            if (!authData) {
                console.error("No valid auth data found in cookies");
                return; // Exit early if no auth data is available
            }

            setUserAuth(authData);

            const checkBrandProductivity = async () => {
                try {
                    const response = await axios.get(
                        `${baseURL}${versionEndpoints.v1}${featuresEndpoints.brandPropertise}${functionEndpoints.brandProperties.getBrandByProductiveByBrandID}/${authData.userID || authData.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${__getToken()}`
                            }
                        }
                    );

                    if (response.data.data === null) {
                        setShowProductivityDialog(true);
                    } else {
                        setShowProductivityDialog(false);
                    }
                } catch (error) {
                    console.error('Error fetching brand productivity data:', error);
                }
            };

            checkBrandProductivity();
            checkPerformed.current = true;
        }
    }, []);

    const handleCloseProductivityDialog = () => {
        setShowProductivityDialog(false);
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

    const togglePopper = (key: string) => {
        setPopperOpen((prev) => ({
            notification: key === 'notification' ? !prev.notification : false,
            user: key === 'user' ? !prev.user : false,
        }));
    };

    const renderComponent = () => {
        switch (activeMenu) {
            case 'manage_notification':
                return (
                    <>
                        <NotificationPage />
                        {/* <UploadBrandInforForm /> */}
                    </>

                );
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
            case 'manage_brand_trandsactions':
                return <BrandManageTransactionComponent />;
            case 'manage_expert_tailoring':
                return (
                    <div>
                        <BrandManagePropertyComponent />
                        <ExpertTailoringBrandManagerComponent />
                    </div>
                );
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
                        brandID={userAuth?.userID || userAuth?.id}
                    />
                )}
                <main className="p-6 flex-grow ml-0 xl:ml-[20%]">
                    {renderComponent()}
                </main>
            </div>
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
    );
};

export default DashboardManageMaterialScreen;