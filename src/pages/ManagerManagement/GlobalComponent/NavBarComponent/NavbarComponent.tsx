import { BellAlertIcon } from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';
import React from 'react';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { toast } from 'react-toastify';

interface NavbarProps {
    toggleMenu: () => void;
    menu: string;
    popperOpen: Record<string, boolean>;
    togglePopper: (key: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleMenu, menu, popperOpen, togglePopper }) => {
    const __handleLogout = async () => {
        try {
            const authToken = Cookies.get('token');
            const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.signout}`, authToken);
            if (response.status === 200) {
                Cookies.remove('token');
                Cookies.remove('refreshToken');
                Cookies.remove('userAuth');

                window.location.href = '/auth/signin'

            } else {
                toast.error(`${response.message}`, { autoClose: 4000 });
            }
            console.log(response);

        } catch (error: any) {
            console.error('Error posting data:', error);
            toast.error(`${error}`, { autoClose: 4000 });
        }
    }
    return (
        <div className="p-4 xl:ml-80">
            <nav className="block w-full max-w-full bg-transparent text-white shadow-none rounded-xl transition-all px-0 py-1">
                <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
                    <div className="capitalize">
                        <nav aria-label="breadcrumb" className="w-max">
                            <ol className="flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
                                <li className="flex items-center text-blue-gray-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500">
                                    <a href="#">
                                        <p className="block antialiased font-sans text-sm leading-normal text-blue-900 font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100">dashboard</p>
                                    </a>
                                    <span className="text-gray-500 text-sm antialiased font-sans font-normal leading-normal mx-2 pointer-events-none select-none">/</span>
                                </li>
                                <li className="flex items-center text-blue-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-blue-500">
                                    <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{menu}</p>
                                </li>
                            </ol>
                        </nav>
                        <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-gray-900">home</h6>
                    </div>

                    <div className="flex items-center">
                        <div className="mr-auto md:mr-4 md:w-56">
                            <div className="relative w-full min-w-[200px] h-10">
                                <input
                                    className="peer w-full h-full bg-transparent text-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-blue-500"
                                    placeholder=" "
                                />
                                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal peer-placeholder-shown:text-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:border-blue-500 after:border-blue-gray-200 peer-focus:after:border-blue-500">
                                    Type here
                                </label>
                            </div>
                        </div>

                        {/* Menu Icon */}
                        <button
                            onClick={toggleMenu}
                            className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden"
                            type="button"
                        >
                            <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" strokeWidth="3" className="h-6 w-6 text-blue-gray-500">
                                    <path
                                        fillRule="evenodd"
                                        d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </span>
                        </button>

                        <button
                            type="button"
                            className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
                            onClick={() => togglePopper('notification')}
                        >
                            <BellAlertIcon className="h-6 w-6 text-red-500" />
                        </button>


                        <button
                            type="button"
                            // className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
                            onClick={() => togglePopper('user')}
                        >
                            <span className="flex items-center">
                                <span className="text-gray-900 font-semibold mr-2">Manager</span>
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3yTTdH4icgz_2KDXa5eYcYPak8--DVwPeQ&s"
                                    className="h-10 w-10 rounded-full border-2 border-[#f84525]"
                                    alt="profile"
                                />
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="relative">
                {popperOpen.notification && (
                    <div
                        className="popover absolute right-0 mt-2 w-72 p-6 rounded-md shadow-md shadow-black/5 bg-white z-50"
                    >
                        <h3 className="text-lg font-semibold mb-4">Notification</h3>
                        <ul>
                            <li className="py-1">Notification 1</li>
                            <li className="py-1">Notification 2</li>
                        </ul>
                    </div>
                )}
                {popperOpen.user && (
                    <div
                        className="popover absolute right-0 mt-2 w-48 p-6 rounded-md shadow-md shadow-black/5 bg-white z-50"
                    >
                        <h3 className="text-lg font-semibold mb-4">Admin Account</h3>
                        <ul>
                            <li className="py-1">Settings</li>
                            <li className="py-1" onClick={__handleLogout} style={{ cursor: "pointer" }}>Logout</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
