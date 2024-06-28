import React, { useState } from 'react';
import Sidebar from '../../GlobalComponent/SideBarComponent/SideBarComponent';
import Navbar from '../../GlobalComponent/NavBarComponent/NavbarComponent';
import EmployeeManageTransaction from '../EmployeeTransactionManagement/EmployeeManageTransactionScreen/ManageTransactionScreen';

const DashboardManageTransactionScreen = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('employee_manage_transaction');

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
                    <EmployeeManageTransaction />
                </main>
            </div>
        </div>
    );
};

export default DashboardManageTransactionScreen;
