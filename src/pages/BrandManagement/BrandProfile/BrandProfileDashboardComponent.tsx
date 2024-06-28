import React, { useState } from 'react';
import Sidebar from '../GlobalComponent/SideBarComponent/SideBarComponent';
import Navbar from '../GlobalComponent/NavBarComponent/NavbarComponent';
import BrandProfileSetup from './BrandProfileComponent';

const DashboardBrandProfileScreens = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('brand_profile');

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuClick = (menu: any) => {
        setActiveMenu(menu);
    };

    return (
        <div className="flex">
            <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} activeMenu={activeMenu} handleMenuClick={handleMenuClick} />
            <div className="flex flex-col w-full">
                <Navbar toggleMenu={toggleMenu} />
                <main className="p-6 flex-grow ml-0 xl:ml-[20%]">
                    <BrandProfileSetup />
                </main>
            </div>
        </div>
    );
};

export default DashboardBrandProfileScreens;
