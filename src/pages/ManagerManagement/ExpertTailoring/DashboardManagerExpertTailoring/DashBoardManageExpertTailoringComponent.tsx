import React, { useEffect, useState } from 'react';
import Sidebar from '../../GlobalComponent/SideBarComponent/SideBarComponent';
import Navbar from '../../GlobalComponent/NavBarComponent/NavbarComponent';
import ManageExpertTailoring from '../ManagerExpertTailoringManagement/ManagerManageScreen/ManageExpertTailoringScreens';
import ManageBrand from '../../ManageBrand/ManagerBrandManagement/ManagerManageBrandScreen/ManageBrandScreens';
import ManageTask from '../../ManageTask/ManagerTaskManagement/ManagerManageTaskScreen/ManageTaskScreens';
import ManageEmployee from '../../ManageEmployee/ManagerEmployeeManagement/ManagerManageEmployeeScreen/ManageEmployeeScreens';
import ManageCustomer from '../../ManageCustomer/ManageCustomerManagement/ManagerManageCustomerScreen/ManageCustomerScreens';

const DashboardManagerMangeExpertTailoring = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('expert_tailoring');
    const [showScrollButton, setShowScrollButton] = React.useState<boolean>(false);
    const [popperOpen, setPopperOpen] = useState<Record<string, boolean>>({});

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuClick = (menu: any) => {
        setActiveMenu(menu);
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
            case 'manager_manage_brand':
                return <ManageBrand />;
            case 'manager_manage_task':
                return <ManageTask />;
            case 'manager_manage_employee':
                return <ManageEmployee />;
            case 'manager_manage_customer':
                return <ManageCustomer />;
            default:
                return (
                    <ManageBrand />
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

export default DashboardManagerMangeExpertTailoring;
