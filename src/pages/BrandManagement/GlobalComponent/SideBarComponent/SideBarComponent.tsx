import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationInterface } from '../../../../models/NotificationModel';
import Cookies from 'js-cookie';
import { UserInterface } from '../../../../models/UserModel';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { toast } from 'react-toastify';

interface SidebarProps {
    menuOpen: boolean;
    toggleMenu: () => void;
    activeMenu: string;
    handleMenuClick: (menu: string) => void;
}



const Sidebar: React.FC<SidebarProps> = ({ menuOpen, toggleMenu, activeMenu, handleMenuClick }) => {
    const [notificationList, setNotificationList] = useState<NotificationInterface[]>([]);
    const [notiNumber, setNotiNumber] = useState<number>(0);
    const [messages, setMessages] = useState<NotificationInterface[]>([]);

    const userStorage = Cookies.get('userAuth');
    if (!userStorage) return;
    const userParse: UserInterface = JSON.parse(userStorage);
    const websocketUrl = `ws://localhost:6969/websocket?userid=${userParse.userID}`;

    // 1. First useEffect to fetch notifications and set notiNumber
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.notification + functionEndpoints.notification.getNotiByUserId}/${userParse.userID}`);
                if (response.status === 200) {
                    const sortedData = response.data.sort((a: NotificationInterface, b: NotificationInterface) => {
                        return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
                    });
                    setNotificationList(sortedData);
                    console.log(response.data);
                    const filterStatusNoti = response.data.filter((noti: NotificationInterface) => noti.status === false);
                    setNotiNumber(filterStatusNoti.length);
                } else {

                }
            } catch (error) {
                toast.error(`${error}`, { autoClose: 4000 });
                console.log('error: ', error);
            }
        };

        fetchNotifications();
    }, [userParse.userID]);

    // 2. Second useEffect to handle WebSocket connection after notiNumber is set
    useEffect(() => {
        const originalTitle = document.title;
        const websocket = new WebSocket(websocketUrl);

        websocket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        websocket.onmessage = (event) => {
            console.log('Message received:', event.data);
            const data: NotificationInterface = JSON.parse(event.data);
            console.log(data);
            setMessages(prevMessages => [...prevMessages, data]);
            setNotiNumber(prevNotiNumber => prevNotiNumber + 1); // Ensure state is updated correctly
            document.title = `New message | ${originalTitle}`;
        };

        websocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            websocket.close();
        };
    }, [websocketUrl]);

    


    return (
        <aside className={`bg-gradient-to-br from-gray-800 to-gray-900 ${menuOpen ? 'translate-x-0' : '-translate-x-80'} fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0`}>
            <div className="relative border-b border-white/20">
                <a className="flex items-center gap-4 py-6 px-8" href="/brand">
                    <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">Brand Dashboard</h6>
                </a>
                <button onClick={toggleMenu} className="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden" type="button">
                    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true" className="h-5 w-5 text-white" style={{ marginTop: "35px", marginRight: "20px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </span>
                </button>
            </div>
            <div className="m-4">
                <ul className="mb-4 flex flex-col gap-1">
                    <li>
                        <div onClick={() => handleMenuClick('manage_notification')} className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${activeMenu === 'manage_notification' ? 'bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]' : 'text-white hover:bg-white/10 active:bg-white/30'} w-full flex items-center gap-4 px-4 capitalize`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
                            </svg>
                            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Manage Notification ({notiNumber})</p>
                        </div>
                    </li>
                    <li>
                        <div onClick={() => handleMenuClick('manage_material')} className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${activeMenu === 'manage_material' ? 'bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]' : 'text-white hover:bg-white/10 active:bg-white/30'} w-full flex items-center gap-4 px-4 capitalize`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
                            </svg>
                            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Manage Material</p>
                        </div>
                    </li>
                    <li>
                        <div onClick={() => handleMenuClick('brand_profile')} className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${activeMenu === 'brand_profile' ? 'bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]' : 'text-white hover:bg-white/10 active:bg-white/30'} w-full flex items-center gap-4 px-4 capitalize`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                            </svg>
                            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Brand Profile</p>
                        </div>
                    </li>
                    <li>
                        <div onClick={() => handleMenuClick('manage_order')} className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${activeMenu === 'manage_order' ? 'bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]' : 'text-white hover:bg-white/10 active:bg-white/30'} w-full flex items-center gap-4 px-4 capitalize`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
                            </svg>
                            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Manage Order</p>
                        </div>
                    </li>
                    <li>
                        <div onClick={() => handleMenuClick('manage_brand_trandsactions')} className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${activeMenu === 'manage_brand_trandsactions' ? 'bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]' : 'text-white hover:bg-white/10 active:bg-white/30'} w-full flex items-center gap-4 px-4 capitalize`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path>
                            </svg>
                            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Manage Transactions</p>
                        </div>
                    </li>
                    <li>
                        <div onClick={() => handleMenuClick('manage_price')} className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${activeMenu === 'manage_price' ? 'bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]' : 'text-white hover:bg-white/10 active:bg-white/30'} w-full flex items-center gap-4 px-4 capitalize`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"></path>
                            </svg>
                            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Manage Price</p>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
