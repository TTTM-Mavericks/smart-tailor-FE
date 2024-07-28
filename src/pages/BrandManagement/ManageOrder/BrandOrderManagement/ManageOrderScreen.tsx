import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendar, FaClipboardCheck, FaExclamationCircle, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { ArrowDropDown } from '@mui/icons-material';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { BrandOrder, ImageList } from '../../../../models/BrandManageOrderModel';
import { motion } from 'framer-motion'
import { values } from 'core-js/core/array';
import { use } from 'i18next';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'NOT_VERIFY': return 'text-gray-600';
        case 'PENDING': return 'text-yellow-600';
        case 'DEPOSIT': return 'text-blue-600';
        case 'PROCESSING': return 'text-orange-600';
        case 'CANCEL': return 'text-red-600';
        case 'COMPLETED': return 'text-green-600';
        case 'DELIVERED': return 'text-indigo-600';
        default: return 'text-gray-600';
    }
};

const DesignModal: React.FC<{ part: any; onClose: () => void }> = ({ part, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >

                <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{part.partOfDesignName}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 pr-4">
                            <img src={part.imageUrl || '/placeholder-image.png'} alt={part.partOfDesignName} className="w-full h-auto object-contain" />
                        </div>
                        <div className="w-1/2 pl-4">
                            <h3 className="text-lg font-semibold mb-2">Item Masks</h3>
                            <div className="bg-gray-100 p-4 rounded">
                                <img src={part.imageUrl || '/placeholder-image.png'} alt="Item Mask" className="w-24 h-24 object-contain mb-2" />
                                <p><strong>Item Mask Name:</strong> {part.material?.materialName}</p>
                                <p><strong>Type:</strong> ICON</p>
                                <p><strong>Position:</strong> X: 92, Y: 50</p>
                                <p><strong>Scale:</strong> X: 230, Y: 230</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const DesignDetails: React.FC<{ design: any }> = ({ design }) => {
    const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
    const [selectedDesignPart, setSelectedDesignPart] = useState<any>(null);

    return (
        <div className="mt-4 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Part of Designs</h4>
            {design.partOfDesign.map((part: any) => (
                <div key={part.partOfDesignID} className="flex items-start mb-4 pb-4 border-b border-gray-300 last:border-b-0">

                    <div className="w-16 h-16 mr-4">
                        <img
                            src={part.imageUrl || '/placeholder-image.png'}
                            alt={part.partOfDesignName}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <p className="font-medium">Part name: {part.partOfDesignName}</p>
                        <p>Material name: {part.material?.materialName || 'N/A'}</p>
                        <p>HS code: {part.material?.hsCode || 'N/A'}</p>
                    </div>
                    {(part.partOfDesignName === 'SLEEVE_CLOTH_PART' || part.partOfDesignName === 'LOGO_PART' || part.partOfDesignName === 'FRONT_CLOTH_PART' || part.partOfDesignName === 'BACK_CLOTH_PART') && (
                        <div className="ml-auto">
                            <button
                                onClick={() => {
                                    setSelectedDesignPart(part);
                                    setIsDesignModalOpen(true);
                                }}
                                className="inline-block p-1 bg-orange-500 text-white rounded"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            ))}
            {isDesignModalOpen && selectedDesignPart && (
                <DesignModal
                    part={selectedDesignPart}
                    onClose={() => setIsDesignModalOpen(false)}
                />
            )}
        </div>
    );
};

const BrandOrderFields: React.FC<{
    order: BrandOrder;
    onViewDetails: (order: BrandOrder, design: any) => void;
    onMarkResolved: (orderID: string) => void;
}> = ({ order, onViewDetails, onMarkResolved }) => {
    const [showDesignDetails, setShowDesignDetails] = useState(false);
    const [designDetails, setDesignDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDesignDetails = async () => {
        setIsLoading(true);
        try {
            console.log(order.orderID);
            const response = await axios.get(`${baseURL + versionEndpoints.v1 + featuresEndpoints.designDetail + functionEndpoints.designDetail.getAllInforOrderDetail + `/${order.orderID}`}`);
            setDesignDetails(response.data.data.design);
        } catch (error) {
            console.error('Error fetching design details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (showDesignDetails && !designDetails) {
            fetchDesignDetails();
        }
    }, [showDesignDetails]);

    useEffect(() => {
        console.log("Updated designDetails:", designDetails);
    }, [designDetails]);

    return (
        <div className="bg-white mb-8 shadow-lg rounded-lg p-6 transition duration-300 ease-in-out transform hover:shadow-xl">
            <h3 className="text-xl font-semibold mb-3 text-indigo-700">Type order: {order.orderType}</h3>
            <div className="flex justify-between">
                <div className="w-1/2">
                    <p className="text-gray-600 mb-2">Customer: {order.buyerName}</p>
                    <p className="text-gray-600 mb-2">Date: {order.createDate}</p>
                    <p className="text-gray-600 mb-2">
                        Status order:{' '}
                        <span className={`ml-2 font-semibold px-2 py-1 rounded-full ${order.orderStatus ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                            {order.orderStatus ? 'Read' : 'Unread'}
                        </span>
                    </p>
                    <div className="mt-4">
                        {order.detailList.map((detail, index) => (
                            <p key={index} className="text-gray-600">
                                Size {detail.size.sizeName}: Quantity {detail.quantity}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="w-1/2">
                    <p className="text-gray-600 mb-2">Order ID: {order.orderID}</p>
                    <p className="text-gray-600 mb-2">
                        Order Status: <span className={`mb-2 ${getStatusColor(order.orderStatus)} font-bold`}>{order.orderStatus}</span>
                    </p>
                    <p className="text-gray-600 mb-2">Total Quantity: {order.quantity}</p>
                    <p className="text-gray-600 mb-2">
                        Address: {order.address}, {order.ward}, {order.district}, {order.province}
                    </p>
                    <p className="text-gray-700 mt-4">Price: {order.totalPrice}</p>
                </div>
            </div>
            <div className="mt-4 flex items-center">
                <ArrowDropDown
                    onClick={() => setShowDesignDetails(!showDesignDetails)}
                    className="cursor-pointer mr-2"
                />
                <span style={{ fontWeight: "bold" }}>Show Design Details</span>
            </div>
            {showDesignDetails && (
                isLoading ? <p>Loading...</p> :
                    designDetails ? <DesignDetails design={designDetails} /> :
                        <p>No design details available</p>
            )}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => onViewDetails(order, designDetails)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-300 mr-4"
                >
                    View Details
                </button>
                <button
                    onClick={() => onMarkResolved(order.orderID)}
                    className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                >
                    Mark as Resolved
                </button>
            </div>
        </div>
    );
};

function isOrderImageListArray(orderImageList: ImageList | ImageList[]): orderImageList is ImageList[] {
    return Array.isArray(orderImageList);
}

const BrandOrderModal: React.FC<{ order: BrandOrder; onClose: () => void; onMarkResolved: (orderID: string) => void, designDetails: any }> = ({ order, onClose, onMarkResolved, designDetails }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NOT_VERIFY': return 'text-gray-600';
            case 'PENDING': return 'text-yellow-600';
            case 'DEPOSIT': return 'text-blue-600';
            case 'PROCESSING': return 'text-orange-600';
            case 'CANCEL': return 'text-red-600';
            case 'COMPLETED': return 'text-green-600';
            case 'DELIVERED': return 'text-indigo-600';
            default: return 'text-gray-600';
        }
    };

    const nextImage = () => {
        if (isOrderImageListArray(order.orderImageList)) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === order.orderImageList.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const prevImage = () => {
        if (isOrderImageListArray(order.orderImageList)) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? order.orderImageList.length - 1 : prevIndex - 1
            );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-150"
                    aria-label="Close modal"
                >
                    <FaTimes size={24} />
                </button>

                <h2 className="text-3xl font-bold text-indigo-700 mb-6 shadow-text">Order Brand Details</h2>

                <div className="flex justify-between items-center mb-6 bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <FaClipboardCheck className="text-indigo-500 mr-2" size={20} />
                        <span className="font-semibold text-gray-700">Order ID:</span>
                    </div>
                    <p className="text-xl font-bold text-indigo-700">{order.orderID}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[
                        { icon: FaUser, label: 'Customer', value: order.buyerName },
                        { icon: FaCalendar, label: 'Date', value: order.createDate },
                        {
                            icon: FaExclamationCircle,
                            label: 'Report Status',
                            value: order.orderStatus ? 'Read' : 'Unread',
                            customClass: order.orderStatus ? 'text-green-600' : 'text-yellow-600'
                        },
                        {
                            icon: FaExclamationCircle,
                            label: 'Order Status',
                            value: order.orderStatus,
                            customClass: getStatusColor(order.orderStatus)
                        }
                    ].map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600 flex items-center mb-2">
                                <item.icon className="mr-2 text-indigo-500" />
                                <span className="font-semibold">{item.label}:</span>
                            </p>
                            <p className={`text-lg font-bold ${item.customClass || 'text-gray-800'}`}>
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">Buyer Name</h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                        {order.buyerName}
                    </p>
                </div>

                {designDetails && designDetails.expertTailoring && (
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Model Image</h3>
                        <img
                            src={designDetails.expertTailoring.modelImageUrl}
                            alt="Model"
                            className="mt-2 max-w-full h-auto rounded-lg"
                        />
                    </div>
                )}
                {isOrderImageListArray(order.orderImageList) && order.orderImageList.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Report Images</h3>
                        <div className="relative">
                            <img
                                src={order.orderImageList[currentImageIndex].orderImageUrl}
                                alt={order.orderImageList[currentImageIndex].orderImageName}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            {order.orderImageList.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                                        <FaChevronLeft />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                                        <FaChevronRight />
                                    </button>
                                </>
                            )}
                        </div>
                        <p className="text-center mt-2 text-gray-600">
                            {order.orderImageList[currentImageIndex].orderImageName}
                        </p>
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onMarkResolved(order.orderID)}
                        className={`px-6 py-3 rounded-lg text-white transition duration-150 focus:outline-none focus:ring-2 ${order.orderStatus
                            ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400 cursor-not-allowed'
                            : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-400'
                            }`}
                        disabled={order.orderStatus}
                    >
                        {order.orderStatus ? 'Already Resolved' : 'Mark as Resolved'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const BrandManageOrder: React.FC = () => {
    const [order, setOrder] = useState<BrandOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<BrandOrder[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(6);
    const [filters, setFilters] = useState({
        date: '',
        status: '',
        name: '',
        orderStatus: '',
    });
    const [selectedOrder, setSelectedOrder] = useState<BrandOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [goToPage, setGoToPage] = useState('1');
    const [designDetails, setDesignDetails] = useState<any>(null)

    useEffect(() => {
        const apiUrl = `${baseURL}${versionEndpoints.v1}${featuresEndpoints.order}${functionEndpoints.order.getAllOrder}`;
        axios.get(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    setOrder(responseData.data);
                    console.log("Data received:", responseData);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, order]);


    const applyFilters = () => {
        let filtered = order;
        if (filters.date) {
            const filterDate = new Date(filters.date);
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.createDate.split(' ')[0]);
                return orderDate.toDateString() === filterDate.toDateString();
            });
        }
        if (filters.status !== '') {
            filtered = filtered.filter(order => order.orderStatus === (filters.status === 'true'));
        }
        if (filters.name) {
            filtered = filtered.filter(order =>
                order.orderType.toLowerCase().includes(filters.name.toLowerCase())
            );
        }
        if (filters.orderStatus !== '') {
            filtered = filtered.filter(order => order.orderStatus === filters.orderStatus);
        }
        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.name === 'status'
            ? e.target.value === 'true' ? true : e.target.value === 'false' ? false : ''
            : e.target.value;
        setFilters(prevFilters => ({
            ...prevFilters,
            [e.target.name]: value,
        }));
    };

    const indexOfLastReport = currentPage * ordersPerPage;
    const indexOfFirstReport = indexOfLastReport - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstReport, indexOfLastReport);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setGoToPage(pageNumber.toString());
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const showEllipsis = totalPages > 7;

        if (showEllipsis) {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        } else {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };

    const handleViewDetails = (order: BrandOrder, designDetail: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
        setDesignDetails(designDetail)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleMarkResolved = (id: string) => {
        setOrder(order.map(order =>
            order.orderID === id ? { ...order, status: true } : order
        ));
        handleCloseModal();
    };

    return (
        <div className='-mt-8'>
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col">
                    <label htmlFor="dateFilter" className="mb-2 text-sm font-medium text-gray-700">Date</label>
                    <input
                        id="dateFilter"
                        type="date"
                        name="date"
                        onChange={handleFilterChange}
                        className="px-4 py-2 rounded-lg border-2 border-black-300 focus:outline-none focus:ring-black-300"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="orderStatusFilter" className="mb-2 text-sm font-medium text-gray-700">Order Status</label>
                    <select
                        id="orderStatusFilter"
                        name="orderStatus"
                        onChange={handleFilterChange}
                        className="px-4 py-2 rounded-lg border-2 border-black-300 focus:outline-none focus:ring-black-300"
                    >
                        <option value="">All Order Statuses</option>
                        <option value="NOT_VERIFY">Not Verify</option>
                        <option value="PENDING">Pending</option>
                        <option value="DEPOSIT">Deposit</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="CANCEL">Cancel</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="DELIVERED">Delivered</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="brandNameFilter" className="mb-2 text-sm font-medium text-gray-700">Brand Name</label>
                    <input
                        id="brandNameFilter"
                        type="text"
                        name="name"
                        placeholder="Filter by brand name..."
                        onChange={handleFilterChange}
                        className="px-4 py-2 rounded-lg border-2 border-black-300 focus:outline-none focus:ring-black-300"
                    />
                </div>
            </div>

            <div >
                {currentOrders.map(order => (
                    <BrandOrderFields key={order.orderID} order={order} onViewDetails={handleViewDetails} onMarkResolved={handleMarkResolved} />
                ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center space-x-4">
                <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="border rounded-md px-3 py-2 text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:border-orange-500"
                >
                    <option value={5}>5/page</option>
                    <option value={10}>10/page</option>
                    <option value={20}>20/page</option>
                    <option value={50}>50/page</option>
                </select>

                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                    &lt;
                </button>

                {renderPageNumbers().map((number, index) => (
                    <button
                        key={index}
                        onClick={() => typeof number === 'number' && paginate(number)}
                        className={`px-3 py-2 rounded-md ${number === currentPage
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                            } ${number === '...' ? 'cursor-default' : ''}`}
                    >
                        {number}
                    </button>
                ))}

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                    &gt;
                </button>

                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <span className="text-gray-600">Go to</span>
                    <input
                        type="text"
                        className="border border-gray-300 rounded-md w-16 px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={goToPage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoToPage(e.target.value)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                                const page = Math.max(1, Math.min(parseInt(goToPage), totalPages));
                                if (!isNaN(page)) {
                                    paginate(page);
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {isModalOpen && selectedOrder && (
                <BrandOrderModal
                    designDetails={designDetails}
                    order={selectedOrder}
                    onClose={handleCloseModal}
                    onMarkResolved={handleMarkResolved}
                />
            )}
        </div>
    );
};

export default BrandManageOrder;