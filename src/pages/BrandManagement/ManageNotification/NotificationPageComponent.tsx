import React, { useState } from 'react';
import NotificationBrandComponent from '../GlobalComponent/Notification/NotificationBrandComponent';

const NotificationPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [visibleCount, setVisibleCount] = useState(5);

    const notifications = [
        {
            id: 1,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            name: 'LV',
            action: 'thích câu trả lời của bạn cho một câu hỏi.',
            time: '11 giờ',
            type: 'like'
        },
        {
            id: 2,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            name: 'LV',
            action: 'đã nhắc đến bạn ở một bình luận trong Hội Những Người Ở Ký Túc Xá Khu B - KTX ĐHQG TP.HCM.',
            time: '12 giờ',
            type: 'mention'
        },
        {
            id: 3,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            groupName: 'Sinh viên KTX ĐHQG TP.HCM',
            action: 'nhận được hơn 357 lượt bày tỏ cảm xúc',
            time: '1 ngày',
            reactions: 357,
            comments: 70,
            type: 'group'
        },
        {
            id: 4,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            groupName: 'Sinh viên KTX ĐHQG TP.HCM',
            action: 'nhận được hơn 357 lượt bày tỏ cảm xúc',
            time: '1 ngày',
            reactions: 357,
            comments: 70,
            type: 'group'
        },
        {
            id: 5,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            groupName: 'Sinh viên KTX ĐHQG TP.HCM',
            action: 'nhận được hơn 357 lượt bày tỏ cảm xúc',
            time: '1 ngày',
            reactions: 357,
            comments: 70,
            type: 'group'
        },
        {
            id: 6,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            groupName: 'Sinh viên KTX ĐHQG TP.HCM',
            action: 'nhận được hơn 357 lượt bày tỏ cảm xúc',
            time: '1 ngày',
            reactions: 357,
            comments: 70,
            type: 'group'
        },
        {
            id: 7,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            groupName: 'Sinh viên KTX ĐHQG TP.HCM',
            action: 'nhận được hơn 357 lượt bày tỏ cảm xúc',
            time: '1 ngày',
            reactions: 357,
            comments: 70,
            type: 'group'
        },
        {
            id: 8,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            groupName: 'Sinh viên KTX ĐHQG TP.HCM',
            action: 'nhận được hơn 357 lượt bày tỏ cảm xúc',
            time: '1 ngày',
            reactions: 357,
            comments: 70,
            type: 'group'
        },
        {
            id: 9,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            groupName: 'Sinh viên KTX ĐHQG TP.HCM',
            action: 'nhận được hơn 357 lượt bày tỏ cảm xúc',
            time: '1 ngày',
            reactions: 357,
            comments: 70,
            type: 'group'
        },
        {
            id: 10,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            groupName: 'Sinh viên KTX ĐHQG TP.HCM',
            action: 'nhận được hơn 357 lượt bày tỏ cảm xúc',
            time: '1 ngày',
            reactions: 357,
            comments: 70,
            type: 'group'
        },
        {
            id: 11,
            avatar: 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-1/411436928_355670253755110_5935660771330271398_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=hur-Cub5-DwQ7kNvgHwYrFJ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYA-T9fDj7Eo2WN4mUwqcxcWqVJr-q5gU43Nfj4PcEoHZA&oe=66A4288C',
            groupName: 'Sinh viên KTX ĐHQG TP.HCM',
            action: 'nhận được hơn 357 lượt bày tỏ cảm xúc',
            time: '1 ngày',
            reactions: 357,
            comments: 70,
            type: 'group'
        },
    ];

    const _handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + 5);
    };

    return (
        <div style={{ width: "50%", marginLeft: "20%" }}>
            {/* <h1 className="text-2xl font-bold mb-4">Thông báo</h1> */}
            {/* <div className="flex mb-4">
                <button
                    className={`mr-4 ${activeTab === 'all' ? 'text-blue-500' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All
                </button>
                <button
                    className={activeTab === 'unread' ? 'text-blue-500' : ''}
                    onClick={() => setActiveTab('unread')}
                >
                    Unread
                </button>
            </div>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Trước đó</h2>
                {notifications.slice(0, visibleCount).map(notification => (
                    <div key={notification.id} className="flex items-start mb-4">
                        <img src={notification.avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <p>
                                <span className="font-semibold">{notification.name || notification.groupName}</span> {notification.action}
                            </p>
                            <p className="text-gray-400 text-sm">{notification.time}</p>
                            {notification.type === 'group' && (
                                <p className="text-gray-400 text-sm">{notification.reactions} cảm xúc · {notification.comments} bình luận</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {visibleCount < notifications.length && (
                <button
                    onClick={_handleLoadMore}
                    className="w-full text-center py-2 rounded bg-blue-500 text-white"
                >
                    View Previous Notification
                </button>
            )} */}
            <NotificationBrandComponent userId='a' />
        </div>
    );
};

export default NotificationPage;