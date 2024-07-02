import React, { useState } from 'react';
import {
    Bars4Icon,
    BellAlertIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';

interface NavbarProps {
    showBars4Icon: boolean;
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ showBars4Icon, toggleSidebar }) => {
    const [popperOpen, setPopperOpen] = useState<Record<string, boolean>>({
        search: false,
        notification: false,
        user: false,
    });

    const togglePopper = (key: string) => {
        setPopperOpen((prev) => {
            const newPopperOpen = { search: false, notification: false, user: false };
            newPopperOpen[key] = !prev[key];
            return newPopperOpen;
        });
    };

    return (
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
                        onClick={() => togglePopper('notification')}
                    >
                        <BellAlertIcon className="h-6 w-6" color='red' />
                    </button>
                    <div
                        className={`absolute right-0 top-10 mt-2 w-72 p-6 rounded-md shadow-md shadow-black/5 bg-white z-50 transition-all duration-300 ${popperOpen['notification'] ? 'block' : 'hidden'
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
                        <span className="text-gray-900 font-semibold mr-2">Admin Account</span>
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
                        <h3 className="text-md text-gray-400 font-semibold mb-2">Admin Account</h3>
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
    );
};

export default Navbar;
