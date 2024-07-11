import React, { useEffect, useState } from 'react';
import Sidebar from '../../GlobalComponent/SidebarComponent/SidebarComponent';
import Navbar from '../../GlobalComponent/NavbarComponent/NavbarComponent';
import ManageMaterials from '../AdminMaterialManagerment/AdminManagerScreen/ManageMaterialScreens';
import { IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import ManageCategories from '../../ManageCategory/AdminCategoryManagement/AdminManagerScreen/ManageCategoryScreens';
import ManageSizes from '../../ManageSize/AdminSizeManagement/AdminManagerScreen/ManageSizeScreens';
import { Box } from '@mui/system';

const DashboardAdminManageMaterialScreen = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('admin_manage_material');
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


    return (
        <div className="flex">
            <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} activeMenu={activeMenu} handleMenuClick={handleMenuClick} />
            <div className="flex flex-col w-full">
                <Navbar toggleMenu={toggleMenu} menu="Mangage Material & Category & Size" popperOpen={popperOpen} togglePopper={togglePopper} />
                <main className="p-6 flex-grow ml-0 xl:ml-[20%] mt-[-3%]">
                    <div>
                        <p>bebe</p>
                        <ManageMaterials />
                    </div>
                    <Box display="flex" justifyContent="space-between" m="20px" width="100%">
                        <Box flex="1" m="10px">
                            <ManageSizes />
                        </Box>
                        <Box flex="1" m="10px">
                            <ManageCategories />
                        </Box>
                    </Box>
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

export default DashboardAdminManageMaterialScreen;
