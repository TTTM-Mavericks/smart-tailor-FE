import React from 'react';
import {
    HomeIcon,
    UserIcon,
    ListBulletIcon,
    ChevronDownIcon,
    BellIcon,
    EnvelopeIcon,
} from '@heroicons/react/20/solid';

interface SidebarProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    dropdownOpen: Record<string, boolean>;
    toggleDropdown: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar, dropdownOpen, toggleDropdown }) => {
    return (
        <>
            <div
                className={`fixed left-0 top-0 w-64 h-full bg-[#f8f4f3] p-4 z-50 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0`}
            >
                <a href="#" className="flex items-center pb-4 border-b border-b-gray-800">
                    <h2 className="font-bold text-2xl">
                        ROLE <span className="bg-[#f84525] text-white px-2 rounded-md">ADMIN</span>
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
        </>
    );
};

export default Sidebar;
