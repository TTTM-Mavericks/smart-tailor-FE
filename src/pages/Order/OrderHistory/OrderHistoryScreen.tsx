import React from 'react';
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';

interface DeliveredItem {
    name: string;
    price: string;
    description: string;
    imageUrl: string;
    deliveredDate: string;
}

interface CanceledItem {
    name: string;
    price: string;
    description: string;
    imageUrl: string;
    canceledDate: string;
}

type OrderItem = DeliveredItem | CanceledItem;

interface Order {
    orderNumber: string;
    datePlaced: string;
    totalAmount: string;
    items: OrderItem[];
}

const OrderHistory: React.FC = () => {

    // ---------------UseState---------------//
    const orders: Order[] = [
        {
            orderNumber: 'WU88191111',
            datePlaced: 'Jul 6, 2021',
            totalAmount: '$160.00',
            items: [
                {
                    name: 'Micro Backpack',
                    price: '$70.00',
                    description: 'Are you a minimalist looking for a compact carry option? The Micro Backpack is the perfect size for your essential everyday carry items. Wear it like a backpack or carry it like a satchel for all-day use.',
                    imageUrl: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
                    deliveredDate: 'July 12, 2021'
                },
                {
                    name: 'Nomad Shopping Tote',
                    price: '$90.00',
                    description: 'This durable shopping tote is perfect for the world traveler. Its yellow canvas construction is water, fray, tear resistant. The matching handle, backpack straps, and shoulder loops provide multiple carry options for a day out on your next adventure.',
                    imageUrl: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
                    deliveredDate: 'July 12, 2021'
                },
            ],
        },
        {
            orderNumber: 'AT4841546',
            datePlaced: 'Dec 22, 2020',
            totalAmount: '$40.00',
            items: [
                {
                    name: 'Double Stack Clothing Bag',
                    price: '$40.00',
                    description: 'Save space and protect your favorite clothes in this double-layer garment bag. Each compartment easily holds multiple pairs of jeans or tops, while keeping your items neatly folded throughout your trip.',
                    imageUrl: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
                    canceledDate: 'January 5, 2021'
                },
            ],
        },
    ];

    // ---------------FunctionHandler---------------//
    /**
     * 
     * @param item 
     * @returns 
     */
    const isDeliveredItem = (item: OrderItem): item is DeliveredItem => {
        return 'deliveredDate' in item;
    };

    /**
     * 
     * @param item 
     * @returns 
     */
    const isCanceledItem = (item: OrderItem): item is CanceledItem => {
        return 'canceledDate' in item;
    };

    /**
     * 
     * @param item 
     * @returns 
     */
    const renderStatusIcon = (item: OrderItem) => {
        if (isDeliveredItem(item)) {
            return (
                <div className="flex items-center text-green-600">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Delivered on {item.deliveredDate}</span>
                </div>
            );
        } else if (isCanceledItem(item)) {
            return (
                <div className="flex items-center text-red-600">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Canceled on {item.canceledDate}</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center text-gray-500">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Order status unknown</span>
                </div>
            );
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className="max-w-6xl mx-auto p-6 min-h-screen" style={{ marginTop: "10%", marginBottom: "5%" }}>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Order History</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Check the status of recent orders, manage returns, and discover similar products.
                </p>
                {orders.map((order, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md p-6 mb-8 transform transition-all hover:shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Order #{order.orderNumber}</h2>
                                <p className="text-sm text-gray-500">Date placed: {order.datePlaced}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">{order.totalAmount}</p>
                                <div className="mt-2">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">View Order</button>
                                    <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">View Invoice</button>
                                </div>
                            </div>
                        </div>
                        {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center mb-6 border-b pb-6">
                                <div className="flex-shrink-0">
                                    <img className="w-35 h-40 rounded-lg shadow-md" src={item.imageUrl} alt={`Image of ${item.name}`} />
                                </div>
                                <div className="ml-6 flex-grow">
                                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-lg text-gray-900 mb-2">{item.price}</p>
                                    <p className="text-gray-600 mb-4">{item.description}</p>
                                    <div className="flex items-center">
                                        {renderStatusIcon(item)}
                                        <div className="ml-auto">
                                            <button key={`view-product-${index}-${itemIndex}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105">View product</button>
                                            <button key={`buy-again-${index}-${itemIndex}`} className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105">Buy again</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <FooterComponent />
        </div>
    );
};

export default OrderHistory;
