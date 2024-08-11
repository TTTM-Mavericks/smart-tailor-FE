
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Card, CardContent, IconButton, Pagination, Typography } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import style from './NotificationBrandComponentStyle.module.scss'
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { UserInterface } from '../../../../models/UserModel';
import { NotificationInterface } from '../../../../models/NotificationModel';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import LoadingComponent from '../../../../components/Loading/LoadingComponent';
import { greenColor, primaryColor, whiteColor } from '../../../../root/ColorSystem';
import { generateNotificationMessage } from '../../../../utils/ElementUtils';


export interface NotificationRealtimeInterface {
    sender: string;
    recipient: string;
    message: string;
    type: string;
}



const NotificationBrandComponent: React.FC = () => {
    // TODO MUTIL LANGUAGE

    // ---------------UseState---------------//
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [isOpenPaymentInforDialog, setIsOpenPaymentInformationDialog] = useState<boolean>(false);
    // const [isExtendTransaction, setIsExtendTransaction] = useState<{ orderID: string, isExtend: boolean } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userAuth, setUserAuth] = useState<UserInterface>();
    const [notificationList, setNotificationList] = useState<NotificationInterface[]>([]);
    const [messages, setMessages] = useState<NotificationInterface[]>([]);
    const userStorage = Cookies.get('userAuth');
    if (!userStorage) return;
    const userParse: UserInterface = JSON.parse(userStorage)
    const websocketUrl = `ws://localhost:6969/websocket?userid=${userParse.userID}`; // Đảm bảo dùng 'ws' thay vì 'http'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Adjust this as needed

    // Calculate total pages
    const totalPagesMessages = Math.ceil(messages.length / itemsPerPage);
    const totalPagesNotificationList = Math.ceil(notificationList.length / itemsPerPage);

    // Paginate function
    const paginate = (array: any, pageNumber: any) => {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        return array.slice(startIndex, startIndex + itemsPerPage);
    };

    // Handle page change
    const handlePageChange = (event: any, value: any) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        const websocket = new WebSocket(websocketUrl);

        websocket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        websocket.onmessage = (event) => {
            console.log('Message received:', event.data);
            var data: NotificationInterface = JSON.parse(event.data);
            console.log(data);
            setMessages(prevMessages => [...prevMessages, data]);
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


    // ---------------UseEffect---------------//

    /**
     * Move to Top When scroll down
     */
    useEffect(() => {
        const userStorage = Cookies.get('userAuth');
        if (userStorage) {
            const userParse: UserInterface = JSON.parse(userStorage);
            setUserAuth(userParse);
            __handleFetchNotification(userParse.userID);
        }
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

    // ---------------FunctionHandler---------------//



    /**
    * Scrolls the window to the top smoothly.
    */
    const _handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    const __handleFetchNotification = async (userId: any) => {
        setIsLoading(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.notification + functionEndpoints.notification.getNotiByUserId}/${userId}`);
            if (response.status === 200) {
                const sortedData = response.data.sort((a: NotificationInterface, b: NotificationInterface) => {
                    return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
                });

                setIsLoading(false);
                setNotificationList(sortedData);
                console.log(response.data);
            }
            else {
                toast.error(`${response.message}`, { autoClose: 4000 });
                return;
            }
        } catch (error) {
            toast.error(`${error}`, { autoClose: 4000 });
            console.log('error: ', error);

        }
    }

    const __handleMaskNotiRead = async (noti: NotificationInterface) => {
        
            try {
                const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.notification + functionEndpoints.notification.updateReadStatus}/${noti.notificationID}`);
                if (response.status === 200) {
                    setNotificationList((prevNotifications) =>
                        prevNotifications.map((item) =>
                            item.notificationID === noti.notificationID
                                ? { ...item, status: true }
                                : item
                        )
                    );
                }
                else {
                    toast.error(`${response.message}`, { autoClose: 4000 });
                    return;
                }
            } catch (error) {
                toast.error(`${error}`, { autoClose: 4000 });
                console.log('error: ', error);

            }
        }


        return (
            <div>
                <LoadingComponent isLoading={isLoading}></LoadingComponent>
                {/* <ToastContainer></ToastContainer> */}
                <div  >
                    <div style={{ width: '800px', margin: '0 auto' }} >

                        <div style={{ width: '60%' }}>
                            {messages.length > 0 && (
                                <div>
                                    <span className="text-gray-500 text-sm">New notifications</span>
                                    <div className="space-y-4 p-4">
                                        {paginate(messages, currentPage).map((notification: NotificationInterface, index: number) => (
                                            <Card
                                                key={index}
                                                className="shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl"
                                                style={{ backgroundColor: !notification.status ? '#FAFAFA' : whiteColor }}
                                                onClick={() => __handleMaskNotiRead(notification)}
                                            >
                                                <CardContent>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="font-semibold text-indigo-700 text-sm">
                                                            {notification.type || 'SYSTEM'}
                                                        </span>
                                                        <span className="font-semibold text-indigo-700 text-sm" style={{ fontSize: 10, color: notification.status ? greenColor : primaryColor }}>
                                                            {notification.status ? 'Read' : 'Not read'}
                                                        </span>

                                                    </div>
                                                    <Typography variant="body2" className="text-gray-700 mb-4">
                                                        {generateNotificationMessage(notification)}
                                                    </Typography>
                                                    <Typography variant="body2" className="text-gray-700 mb-4 pt-1">
                                                        ID: {notification.targetID}
                                                    </Typography>
                                                    <Typography variant="caption" className="text-gray-500">
                                                        Create at: {notification.createDate}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                </div>
                            )}
                            <div className="mt-10">
                                <span className="text-gray-500 text-sm">Old notifications</span>
                                <div className="space-y-4 p-4">
                                    {paginate(notificationList, currentPage).map((notification: NotificationInterface) => (
                                        <Card
                                            key={notification.notificationID}
                                            className="shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl"
                                            style={{ backgroundColor: !notification.status ? '#FAFAFA' : whiteColor }}
                                            onClick={() => __handleMaskNotiRead(notification)}
                                        >
                                            <CardContent>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="font-semibold text-indigo-700 text-sm">
                                                        {notification.type || 'SYSTEM'}
                                                    </span>
                                                    <span className="font-semibold text-indigo-700 text-sm" style={{ fontSize: 10, color: notification.status ? greenColor : primaryColor }}>
                                                        {notification.status ? 'Read' : 'Not read'}
                                                    </span>
                                                </div>
                                                <Typography variant="body2" className="text-gray-700 mb-4">
                                                    {generateNotificationMessage(notification)}
                                                </Typography>
                                                <Typography variant="body2" className="text-gray-700 mb-4 pt-1" >
                                                    ID: {notification.targetID}
                                                </Typography>
                                                <Typography variant="caption" className="text-gray-500">
                                                    Created at: {notification.createDate}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <Pagination
                                    count={totalPagesNotificationList}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    className="mt-4"
                                />
                            </div>
                        </div>



                        {showScrollButton && (
                            <IconButton
                                style={{
                                    position: 'fixed',
                                    bottom: '20px',
                                    right: '20px',
                                    zIndex: 100,
                                    backgroundColor: primaryColor,
                                    color: "white"
                                }}
                                onClick={_handleScrollToTop}
                            >
                                <ArrowUpward />
                            </IconButton>
                        )}
                    </div>
                </div>


                {/* Dialog */}
            </div >

        );
    };

    export default NotificationBrandComponent;

