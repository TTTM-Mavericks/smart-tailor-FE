import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import io from 'socket.io-client';
import { Avatar, Rating, Typography } from '@mui/material';
import axios from 'axios';

// Interface for Notification data
interface NotificationInterface {
    notiID?: any;
    baseUserID?: UserInterFace;
    targetUserID?: string;
    messageType?: string;
    content?: string;
    sender?: string;
    action?: string;
    actionID?: any;
    message?: string;
    status?: boolean;
    dateTime?: string;
}

// Interface for User data
interface UserInterFace {
    userID?: number;
    username?: string;
    password?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    gender?: string;
    role?: string;
    subRole?: string;
    imgUrl?: string | string[];
    status?: string;
    language?: string;
    isFirstLogin?: boolean;
    followed?: boolean;
}

const ReviewProductScreen: React.FC = () => {

    // ---------------UseState Variable---------------//
    const [data, setData] = useState<NotificationInterface[]>([]);

    // ---------------Usable Variable---------------//
    const socket = io('ws');
    const stompClient = Stomp.over(socket);

    // ---------------UseEffect---------------//
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:6969/api/v1/notification/get-all-notification?userid=1&target_userid=2'
                );
                const getData = await response.json();
                if (getData) {
                    setData(getData.data);
                } else {
                    console.error('Error fetching data:', getData.message);
                }
            } catch (error) {
                console.error('An error occurred during data fetching:', error);
            }
        };

        fetchData();

        const onConnect = () => {
            console.log('Connected to WebSocket');
            stompClient.subscribe('/topic/notifications', (message) => {
                const newNotification = JSON.parse(message.body);
                setData((prevData) => [newNotification, ...prevData]);
                console.log("bebe ");

            });
        };

        if (stompClient && stompClient.connect) {
            stompClient.connect({}, onConnect);
        }

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [stompClient]);


    return (
        <div className="w-full flex justify-start items-start flex-col bg-gray-50 dark:bg-gray-800 p-8">
            <Typography variant="h4" className="text-gray-800 dark:text-white mb-4" style={{ marginBottom: "2%" }}>
                Reviews
            </Typography>
            {data.map((review) => (
                <div
                    key={review.notiID}
                    className="bg-white dark:bg-gray-700 shadow-md rounded-lg w-full mb-6 p-6"
                >
                    <div className="flex flex-col md:flex-row justify-between w-full">
                        <div className="flex flex-row justify-between items-start">
                            <div>
                                <Typography className="text-xl md:text-2xl font-medium text-gray-800 dark:text-white" style={{ fontWeight: "bold", fontSize: "24px" }}>
                                    {review.action}
                                </Typography>
                                <Rating name="half-rating" defaultValue={2.5} precision={0.5} readOnly />
                                <Typography className="text-xl md:text-2xl font-medium text-gray-800 dark:text-white" style={{ width: "84%" }}>
                                    When you want to decorate your home, the idea of choosing a decorative theme can seem daunting. Some themes seem to have an endless amount of pieces, while others can feel hard to accomplish
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="md:block">
                        <Typography className="mt-3 text-base text-gray-600 dark:text-gray-300 w-full md:w-9/12 xl:w-5/6">
                            {review.content}
                        </Typography>
                        <div className="hidden md:flex mt-6 flex-row justify-start items-start space-x-4">
                            {Array.isArray(review.baseUserID?.imgUrl) ? (
                                review.baseUserID?.imgUrl.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt={`review-${index}`} className="w-24 h-24 rounded-lg" />
                                    </div>
                                ))
                            ) : (
                                <div style={{ display: "flex" }}>
                                    <img
                                        src={review.baseUserID?.imgUrl as string}
                                        alt="review"
                                        className="w-24 h-24 rounded-lg"
                                    />
                                    <img
                                        src={review.baseUserID?.imgUrl as string}
                                        alt="review"
                                        className="w-24 h-24 rounded-lg"
                                    />
                                    <img
                                        src={review.baseUserID?.imgUrl as string}
                                        alt="review"
                                        className="w-24 h-24 rounded-lg"
                                    />
                                    <img
                                        src={review.baseUserID?.imgUrl as string}
                                        alt="review"
                                        className="w-24 h-24 rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-start items-center flex-row space-x-2.5">
                            <Avatar src="https://smart-tailor-fe.pages.dev/assets/smart-tailor_logo-CUmlLF_X.png" alt="user-avatar" />
                            <div className="flex flex-col justify-start items-start space-y-2">
                                <Typography className="text-base font-medium text-gray-800 dark:text-white">
                                    {review.baseUserID?.username}
                                </Typography>
                                <Typography className="text-sm text-gray-600 dark:text-gray-300">
                                    {new Date(review.dateTime || '').toLocaleDateString()}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewProductScreen;
