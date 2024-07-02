import React, { useEffect, useState } from 'react';
import {
    Bars4Icon,
    HomeIcon,
    UserIcon,
    ListBulletIcon,
    ChevronDownIcon,
    BellIcon,
    EnvelopeIcon,
    BellAlertIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
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
            <div
                className={`fixed left-0 top-0 w-64 h-full bg-[#f8f4f3] p-4 z-50 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0`}
            >
                <a href="#" className="flex items-center pb-4 border-b border-b-gray-800">
                    <h2 className="font-bold text-2xl">
                        ROLE <span className="bg-[#f84525] text-white px-2 rounded-md">BRAND</span>
                    </h2>
                </a>
                <ul className="mt-4">
                    <span className="text-gray-400 font-bold">ADMIN</span>
                    <li className="mb-1">
                        <a
                            href="#"
                            className="flex items-center py-2 px-4 text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            <HomeIcon className="h-5 w-5 mr-3" />
                            <span className="text-sm">Dashboard</span>
                        </a>
                    </li>
                    <li className="mb-1">
                        <a
                            href="#"
                            className="flex items-center py-2 px-4 text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                            onClick={() => toggleDropdown('users')}
                        >
                            <UserIcon className="h-5 w-5 mr-3" />
                            <span className="text-sm">Users</span>
                            <ChevronDownIcon className={`ml-auto h-5 w-5 transform ${dropdownOpen['users'] ? 'rotate-180' : ''}`} />
                        </a>
                        <ul className={`pl-7 mt-2 ${dropdownOpen['users'] ? 'block' : 'hidden'}`}>
                            <li className="mb-4 flex items-center">
                                <span className="h-2 w-2 bg-gray-900 rounded-full mr-2"></span>
                                <a
                                    href="#"
                                    className="text-gray-900 text-sm hover:text-[#f84525]"
                                >
                                    All
                                </a>
                            </li>
                            <li className="mb-4 flex items-center">
                                <span className="h-2 w-2 bg-gray-900 rounded-full mr-2"></span>
                                <a
                                    href="#"
                                    className="text-gray-900 text-sm hover:text-[#f84525]"
                                >
                                    Roles
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="mb-1">
                        <a
                            href="#"
                            className="flex items-center py-2 px-4 text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            <ListBulletIcon className="h-5 w-5 mr-3" />
                            <span className="text-sm">Activities</span>
                        </a>
                    </li>
                    <span className="text-gray-400 font-bold mt-4">BLOG</span>
                    <li className="mb-1">
                        <a
                            href="#"
                            className="flex items-center py-2 px-4 text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                            onClick={() => toggleDropdown('post')}
                        >
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10c0 7.7-7 13-9 13-2 0-9-5.3-9-13a9 9 0 1118 0z" />
                            </svg>
                            <span className="text-sm">Post</span>
                            <ChevronDownIcon className={`ml-auto h-5 w-5 transform ${dropdownOpen['post'] ? 'rotate-180' : ''}`} />
                        </a>
                        <ul className={`pl-7 mt-2 ${dropdownOpen['post'] ? 'block' : 'hidden'}`}>
                            <li className="mb-4 flex items-center">
                                <span className="h-2 w-2 bg-gray-900 rounded-full mr-2"></span>
                                <a
                                    href="#"
                                    className="text-gray-900 text-sm hover:text-[#f84525]"
                                >
                                    All
                                </a>
                            </li>
                            <li className="mb-4 flex items-center">
                                <span className="h-2 w-2 bg-gray-900 rounded-full mr-2"></span>
                                <a
                                    href="#"
                                    className="text-gray-900 text-sm hover:text-[#f84525]"
                                >
                                    Categories
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="mb-1">
                        <a
                            href="#"
                            className="flex items-center py-2 px-4 text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            <BellIcon className="h-5 w-5 mr-3" />
                            <span className="text-sm">Archive</span>
                        </a>
                    </li>
                    <span className="text-gray-400 font-bold mt-4">PERSONAL</span>
                    <li className="mb-1">
                        <a
                            href="#"
                            className="flex items-center py-2 px-4 text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            <BellIcon className="h-5 w-5 mr-3" />
                            <span className="text-sm">Notifications</span>
                            <span className="ml-auto text-xs font-medium tracking-wide text-red-600 bg-red-200 rounded-full px-2 py-0.5">
                                5
                            </span>
                        </a>
                    </li>
                    <li className="mb-1">
                        <a
                            href="#"
                            className="flex items-center py-2 px-4 text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            <EnvelopeIcon className="h-5 w-5 mr-3" />
                            <span className="text-sm">Messages</span>
                            <span className="ml-auto text-xs font-medium tracking-wide text-green-600 bg-green-200 rounded-full px-2 py-0.5">
                                2 New
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
            <div
                className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'
                    }`}
                onClick={toggleSidebar}
            >
            </div>

            {/* Nav Bar */}
            <main className="w-full md:w-[calc(100%-16rem)] md:ml-64 bg-gray-200 min-h-screen transition-all">
                <div className="py-2 px-6 bg-[#f8f4f3] flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30" style={{ height: "70px" }}>
                    {showBars4Icon && (
                        <button
                            type="button"
                            className="text-lg text-gray-900 font-semibold"
                            onClick={toggleSidebar}
                        >
                            <Bars4Icon className="h-6 w-6" />
                        </button>
                    )}
                    <ul className="ml-auto flex items-center">
                        <li className="mr-1 dropdown relative">
                            <button
                                type="button"
                                className="text-gray-400 w-8 h-8 rounded flex items-center justify-center hover:text-gray-600 transition-colors"
                                onClick={() => togglePopper('search')}
                            >
                                <MagnifyingGlassIcon className="h-6 w-6" />
                            </button>
                            <div
                                className={`absolute right-0 top-10 w-[20rem] p-6 rounded-md shadow-md shadow-black/5 bg-white z-50 transition-all duration-300 ${popperOpen['search'] ? 'block' : 'hidden'
                                    }`}
                            >
                                <input
                                    type="text"
                                    placeholder="Search something..."
                                    className="px-4 py-3 rounded-md border-2 border-gray-200 w-full"
                                />
                            </div>
                        </li>
                        <li className="mr-1 dropdown relative">
                            <button
                                type="button"
                                className="text-gray-400 w-8 h-8 rounded flex items-center justify-center hover:text-gray-600 transition-colors"
                                onClick={() => togglePopper('settings')}
                            >
                                <BellAlertIcon className="h-6 w-6" color='red' />
                            </button>
                            <div
                                className={`absolute right-0 top-10 w-72 p-6 rounded-md shadow-md shadow-black/5 bg-white z-50 transition-all duration-300 ${popperOpen['settings'] ? 'block' : 'hidden'
                                    }`}
                            >
                                <h3 className="text-md text-gray-400 font-semibold mb-5">Notification</h3>
                                <ul>
                                    <li className="mb-4">
                                        <a
                                            href="#"
                                            className="text-gray-900 flex items-center hover:text-[#f84525]"
                                        >
                                            Notification 1
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a
                                            href="#"
                                            className="text-gray-900 flex items-center hover:text-[#f84525]"
                                        >
                                            Notification 2
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="dropdown relative">
                            <button
                                type="button"
                                className="flex items-center"
                                onClick={() => togglePopper('user')}
                            >
                                <span className="text-gray-900 font-semibold mr-2">Brand Account</span>
                                <img
                                    src="https://www.lucidadvertising.com/wp-content/uploads/2020/07/Brand_Dev-1.jpg"
                                    className="h-10 w-10 rounded-full border-2 border-[#f84525]"
                                    alt="profile"
                                />
                            </button>
                            <div
                                className={`absolute right-0 top-14 w-72 p-6 rounded-md shadow-md shadow-black/5 bg-white z-50 transition-all duration-300 ${popperOpen['user'] ? 'block' : 'hidden'
                                    }`}
                            >
                                <h3 className="text-md text-gray-400 font-semibold mb-2">Brand Account</h3>
                                <ul>
                                    <li className="mb-4">
                                        <a
                                            href="#"
                                            className="text-gray-900 flex items-center hover:text-[#f84525]"
                                        >
                                            Profile
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a
                                            href="#"
                                            className="text-gray-900 flex items-center hover:text-[#f84525]"
                                        >
                                            Settings
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a
                                            href="#"
                                            className="text-gray-900 flex items-center hover:text-[#f84525]"
                                        >
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div>
                    {/* Content in here */}
                    <ManageMaterialComponent />
                </div>
            </main>
        </div>
    );
};

export default Brand;
