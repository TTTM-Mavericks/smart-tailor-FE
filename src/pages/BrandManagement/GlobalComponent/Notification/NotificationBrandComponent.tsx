import React, { useEffect, useRef, useState } from 'react';
import { IconButton } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { EyeIcon } from '@heroicons/react/24/outline';

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
    imgUrl?: string;
    status?: string;
    language?: string;
    isFirstLogin?: boolean;
    followed?: boolean;
}

interface NotificationItemProps {
    avatar: string;
    name: string;
    message: string;
    time: string;
}

interface NotificationBrandComponentProps {
    setActiveMenu: (menu: string) => void;
}

const NotificationBrandComponent: React.FC<NotificationBrandComponentProps> = ({ setActiveMenu }) => {
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const toggleNotifications = () => {
        setIsOpen(!isOpen);
    };

    const _handleViewAllClick = () => {
        setActiveMenu('manage_notification');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='relative' ref={notificationRef}>
            <IconButton onClick={toggleNotifications}>
                <NotificationsOutlinedIcon />
            </IconButton>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-md overflow-hidden z-50">
                    <div className="p-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-center mb-4">Notifications</h2>
                        <div className="space-y-4">
                            <NotificationItem
                                avatar="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C"
                                name="Jese Leos"
                                message="Hey, what's up? All set for the presentation?"
                                time="a few moments ago"
                            />
                            <NotificationItem
                                avatar="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C"
                                name="Joseph Mcfall"
                                message="and 5 others started following you."
                                time="10 minutes ago"
                            />
                            <NotificationItem
                                avatar="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C"
                                name="Bonnie Green"
                                message="and 141 others love your story. See it and view more stories."
                                time="44 minutes ago"
                            />
                            <NotificationItem
                                avatar="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C"
                                name="Leslie Livingston"
                                message='mentioned you in a comment: @bonnie.green what do you say?'
                                time="44 minutes ago"
                            />
                            <NotificationItem
                                avatar="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C"
                                name="Robert Brown"
                                message="posted a new video: Glassmorphism - learn how to implement the new design trend."
                                time="3 hours ago"
                            />
                        </div>
                        <button
                            className="w-full mt-4 py-2 text-sm text-blue-600 hover:underline focus:outline-none"
                            onClick={() => setActiveMenu('manage_notification')}
                        >
                            View all
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const NotificationItem: React.FC<NotificationItemProps> = ({ avatar, name, message, time }) => {
    return (
        <div className="flex items-start space-x-3">
            <img className="w-10 h-10 rounded-full" src={avatar} alt={name} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{name}</span> {message}
                </p>
                <p className="text-sm text-blue-500">{time}</p>
            </div>
        </div>
    );
};

export default NotificationBrandComponent;