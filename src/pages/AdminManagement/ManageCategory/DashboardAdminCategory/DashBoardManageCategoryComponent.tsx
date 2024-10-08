import React, { useEffect, useState } from 'react';
import Sidebar from '../../GlobalComponent/SidebarComponent/SidebarComponent';
import Navbar from '../../GlobalComponent/NavbarComponent/NavbarComponent';
import { IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import ManageCategories from '../AdminCategoryManagement/AdminManagerScreen/ManageCategoryScreens';

const DashboardAdminManageCategoryScreen = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('admin_dashboard');
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


    return (
        <div className="flex">
            <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} activeMenu={activeMenu} handleMenuClick={handleMenuClick} />
            <div className="flex flex-col w-full">
                <Navbar toggleMenu={toggleMenu} menu="Mangage Category" popperOpen={popperOpen} togglePopper={togglePopper} />
                <main className="p-6 flex-grow ml-0 xl:ml-[20%]">
                    <ManageCategories />
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

export default DashboardAdminManageCategoryScreen;
