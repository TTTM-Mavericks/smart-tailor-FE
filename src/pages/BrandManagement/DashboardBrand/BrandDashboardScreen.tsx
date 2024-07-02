import React, { useEffect, useState } from 'react';
import Sidebar from '../../AdminManagement/GlobalComponent/SidebarComponent/SidebarComponent';
import Navbar from '../../AdminManagement/GlobalComponent/NavbarComponent/NavbarComponent';
import ManageMaterialComponent from '../ManageMaterial/MaterialManage/MaterialManageScreens';

const Brand: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
    const [popperOpen, setPopperOpen] = useState<Record<string, boolean>>({});
    const [showBars4Icon, setShowBars4Icon] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setShowBars4Icon(window.innerWidth <= 747);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleDropdown = (key: string) => {
        setDropdownOpen({ ...dropdownOpen, [key]: !dropdownOpen[key] });
    };

    const togglePopper = (key: string) => {
        setPopperOpen({ ...popperOpen, [key]: !popperOpen[key] });
    };

    return (
        <div className="relative text-gray-800 font-inter">
            <Sidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                dropdownOpen={dropdownOpen}
                toggleDropdown={toggleDropdown}
            />
            <Navbar
                showBars4Icon={showBars4Icon}
                toggleSidebar={toggleSidebar}
                popperOpen={popperOpen}
                togglePopper={togglePopper}
            />
            <div className="p-4 sm:ml-64 border-2 border-gray-200 border-dashed rounded-lg" style={{ marginTop: "-1%" }}>
                <ManageMaterialComponent />
            </div>
        </div>
    );
};

export default Brand;
