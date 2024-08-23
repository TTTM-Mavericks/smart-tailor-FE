import React, { useEffect, useState } from 'react';
import Sidebar from '../GlobalComponent/SideBarComponent/SideBarComponent';;
import Navbar from '../GlobalComponent/NavBarComponent/NavbarComponent';
import EmployeeManageCustomer from '../ManageCustomer/ManageCustomerScreen';
import EmployeeManageBrand from '../ManageBrand/EmployeeBrandManagement/EmployeeManageBrandScreen/ManageBrandScreen';
import EmployeeManageReport from '../ManageReport/EmployeeReportManagement/EmployeeManageReportScreen/ManageReportScreen';
import EmployeeManageOrder from '../ManageOrder/EmployeeOrderManagement/EmployeeManageOrderScreen/ManageOrderScreen';
import EmployeeManageTransaction from '../ManageTransaction/EmployeeTransactionManagement/EmployeeManageTransactionScreen/ManageTransactionScreen';
import ManageNotificationScreens from '../ManageNotification/ManageNotificationScreens';
import EmployeeProfileSetup from '../EmployeeProfile/EmployeeProfileComponent';
import NotificationEmployeeComponent from '../GlobalComponent/Notification/NotificationEmployeeComponent';

const DashboardEmployeeScreens = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('employee_manage_order');
    const [showScrollButton, setShowScrollButton] = React.useState<boolean>(false);
    const [popperOpen, setPopperOpen] = useState<Record<string, boolean>>({});

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        // Get the active tab from localStorage on component mount
        const savedActiveMenu = localStorage.getItem('employeeActiveMenu');
        if (savedActiveMenu) {
            setActiveMenu(savedActiveMenu);
        }
    }, []);

    const handleMenuClick = (menu: any) => {
        setActiveMenu(menu);
        // Save the active tab to localStorage
        localStorage.setItem('employeeActiveMenu', menu);
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
            case 'employee_manage_brand':
                return <EmployeeManageBrand />;
            case 'employee_manage_report':
                return <EmployeeManageReport />;
            case 'employee_manage_order':
                return <EmployeeManageOrder />;
            case 'employee_manage_transaction':
                return <EmployeeManageTransaction />;
            case 'employee_manage_notification':
                return <NotificationEmployeeComponent />;
            case 'employee_profile':
                return <EmployeeProfileSetup />;
            default:
                return (
                    <EmployeeManageCustomer />
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

export default DashboardEmployeeScreens;
