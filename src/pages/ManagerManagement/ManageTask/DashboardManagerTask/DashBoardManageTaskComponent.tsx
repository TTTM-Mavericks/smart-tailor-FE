import React, { useState } from 'react';
import Sidebar from '../../GlobalComponent/SideBarComponent/SideBarComponent';
import Navbar from '../../GlobalComponent/NavBarComponent/NavbarComponent';
import ManageTask from '../ManagerTaskManagement/ManagerManageTaskScreen/ManageTaskScreens';

const DashboardManagerMangeTask = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('expert_tailoring');

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
                    <ManageTask />
                </main>
            </div>
        </div>
    );
};

export default DashboardManagerMangeTask;
