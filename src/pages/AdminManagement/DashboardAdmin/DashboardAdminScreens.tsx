import React, { useState } from 'react';
import Sidebar from '../GlobalComponent/SidebarComponent/SidebarComponent';
import Navbar from '../GlobalComponent/NavbarComponent/NavbarComponent';
import { IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import CardInformationDetailComponent from '../CardInformationDetail/CardInformationDetailComponent';
import GeographyChartComponent from '../GeographyChart/GeographyChartComponent';
import BarChartComponent from '../BarChart/BarChartComponent';
import LineChartComponent from '../LineChart/LineChartComponent';
import PieChartComponent from '../PieChart/PieChartComponent';

const DashboardAdminScreens = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('admin_dashboard');
    const [showScrollButton, setShowScrollButton] = React.useState<boolean>(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuClick = (menu: any) => {
        setActiveMenu(menu);
    };

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

    return (
        <div className="flex">
            <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} activeMenu={activeMenu} handleMenuClick={handleMenuClick} />
            <div className="flex flex-col w-full">
                <Navbar toggleMenu={toggleMenu} />
                <main className="p-6 flex-grow ml-0 xl:ml-[20%]">
                    <CardInformationDetailComponent />
                    <GeographyChartComponent />
                    <BarChartComponent />
                    <LineChartComponent />
                    <PieChartComponent />
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

export default DashboardAdminScreens;
