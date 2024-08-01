import React, { useState, useEffect } from 'react';
import './ManageReportStyles.module.scss'
import { motion } from 'framer-motion';
import { FaUser, FaCalendar, FaClipboardCheck, FaExclamationCircle, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Report, ReportImageList } from '../../../../../models/EmployeeManageReportModel';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import axios from 'axios';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { greenColor, redColor, secondaryColor } from '../../../../../root/ColorSystem';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'NOT_VERIFY':
            return 'text-gray-600';
        case 'PENDING':
            return 'text-yellow-600';
        case 'DEPOSIT':
            return 'text-blue-600';
        case 'PROCESSING':
            return 'text-orange-600';
        case 'CANCEL':
            return 'text-red-600';
        case 'COMPLETED':
            return 'text-green-600';
        case 'DELIVERED':
            return 'text-indigo-600';
        default:
            return 'text-gray-600';
    }
};

const OrderReport: React.FC<{
    report: Report;
    onViewDetails: (report: Report) => void;
    onMarkResolved: (reportID: string) => void;
}> = ({ report, onViewDetails, onMarkResolved }) => (
    <div className="bg-white mb-8 shadow-lg rounded-lg p-6 transition duration-300 ease-in-out transform hover:shadow-xl">
        <h3 className="text-xl font-semibold mb-3 text-indigo-700">Type Report: {report.typeOfReport}</h3>
        <div className="flex justify-between">
            <div className="w-1/2">
                <p className="text-gray-600 mb-2">Customer: {report.orderResponse.buyerName}</p>
                <p className="text-gray-600 mb-2">Date: {report.createDate}</p>
                <p className="text-gray-600 mb-2">
                    Status Report:{' '}
                    <span
                        className={`ml-2 font-semibold px-2 py-1 rounded-full ${report.reportStatus ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                            }`}
                    >
                        {report.reportStatus ? 'Read' : 'Unread'}
                    </span>
                </p>
                <div className="mt-4">
                    {report.orderResponse.detailList.map((detail, index) => (
                        <p key={index} className="text-gray-600">
                            Size {detail.size.sizeName}: Quantity {detail.quantity}
                        </p>
                    ))}
                </div>
            </div>
            <div className="w-1/2">
                <p className="text-gray-600 mb-2">Order ID: {report.orderResponse.orderID}</p>
                <p className="text-gray-600 mb-2">
                    Order Status: <span className={`mb-2 ${getStatusColor(report.orderResponse.orderStatus)} font-bold`}>{report.orderResponse.orderStatus}</span>
                </p>
                <p className="text-gray-600 mb-2">Total Quantity: {report.orderResponse.quantity}</p>
                <p className="text-gray-600 mb-2">
                    Address: {report.orderResponse.address}, {report.orderResponse.ward}, {report.orderResponse.district},{' '}
                    {report.orderResponse.province}
                </p>
                <p className="text-gray-700 mt-4">Content: {report.content}</p>
            </div>
        </div>
        <div className="mt-6 flex justify-end">
            <button
                onClick={() => onViewDetails(report)}
                className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-300 mr-4"
                style={{
                    borderRadius: 4,
                    backgroundColor: secondaryColor
                }}
            >
                View Details
            </button>
            <button
                onClick={() => onMarkResolved(report.reportID)}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                style={{
                    borderRadius: 4,
                    backgroundColor: greenColor
                }}
            >
                Mark as Resolved
            </button>
        </div>
    </div>
);

function isReportImageListArray(reportImageList: ReportImageList | ReportImageList[]): reportImageList is ReportImageList[] {
    return Array.isArray(reportImageList);
}

const ReportModal: React.FC<{ report: Report; onClose: () => void; onMarkResolved: (reportID: string) => void }> = ({ report, onClose, onMarkResolved }) => {
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
        if (isReportImageListArray(report.reportImageList)) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === report.reportImageList.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const prevImage = () => {
        if (isReportImageListArray(report.reportImageList)) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? report.reportImageList.length - 1 : prevIndex - 1
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
                <IoMdCloseCircleOutline
                    cursor="pointer"
                    size={20}
                    color={redColor}
                    onClick={onClose}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />

                <h2 className="text-3xl font-bold text-indigo-700 mb-6 shadow-text">Order Report Details</h2>

                <div className="flex justify-between items-center mb-6 bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <FaClipboardCheck className="text-indigo-500 mr-2" size={20} />
                        <span className="font-semibold text-gray-700">Order ID:</span>
                    </div>
                    <p className="text-xl font-bold text-indigo-700">{report.reportID}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[
                        { icon: FaUser, label: 'Customer', value: report.orderResponse.buyerName },
                        { icon: FaCalendar, label: 'Date', value: report.lastModifiedDate },
                        {
                            icon: FaExclamationCircle,
                            label: 'Report Status',
                            value: report.reportStatus ? 'Read' : 'Unread',
                            customClass: report.reportStatus ? 'text-green-600' : 'text-yellow-600'
                        },
                        {
                            icon: FaExclamationCircle,
                            label: 'Order Status',
                            value: report.orderResponse.orderStatus,
                            customClass: getStatusColor(report.orderResponse.orderStatus)
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
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">Description</h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                        {report.content}
                    </p>
                </div>

                {isReportImageListArray(report.reportImageList) && report.reportImageList.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Report Images</h3>
                        <div className="relative flex items-center justify-center">
                            <img
                                src={report.reportImageList[currentImageIndex].reportImageUrl}
                                alt={report.reportImageList[currentImageIndex].reportImageName}
                                className="object-cover rounded-lg"
                                style={{ width: 500, height: 550 }}
                            />
                            {report.reportImageList.length > 1 && (
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

                    </div>
                )}

                <div className="flex justify-end space-x-4">

                    <button
                        onClick={() => onMarkResolved(report.reportID)}
                        className={`px-6 py-3 rounded-lg text-white transition duration-150 focus:outline-none focus:ring-2 ${report.reportStatus
                            ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400 cursor-not-allowed'
                            : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-400'
                            }`}
                        disabled={report.reportStatus}
                    >
                        {report.reportStatus ? 'Already Resolved' : 'Mark as Resolved'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const EmployeeManageReport: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage] = useState(6);
    const [filters, setFilters] = useState({
        date: '',
        status: '',
        name: '',
        orderStatus: '',
    });
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [goToPage, setGoToPage] = useState('1');

    useEffect(() => {
        const apiUrl = `${baseURL}${versionEndpoints.v1}${featuresEndpoints.report}${functionEndpoints.report.getAllReport}`;
        axios.get(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    setReports(responseData.data);
                    console.log("Data received:", responseData);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, reports]);

    const applyFilters = () => {
        let filtered = reports;
        if (filters.date) {
            const filterDate = new Date(filters.date);
            filtered = filtered.filter(report => {
                const reportDate = new Date(report.createDate.split(' ')[0]);
                return reportDate.toDateString() === filterDate.toDateString();
            });
        }
        if (filters.status !== '') {
            filtered = filtered.filter(report => report.reportStatus === (filters.status === 'true'));
        }
        if (filters.name) {
            filtered = filtered.filter(report =>
                report.typeOfReport.toLowerCase().includes(filters.name.toLowerCase())
            );
        }
        if (filters.orderStatus !== '') {
            filtered = filtered.filter(report => report.orderResponse.orderStatus === filters.orderStatus);
        }
        setFilteredReports(filtered);
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

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setGoToPage(pageNumber.toString());
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

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

    const handleViewDetails = (report: Report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    const handleMarkResolved = (id: string) => {
        setReports(reports.map(report =>
            report.reportID === id ? { ...report, status: true } : report
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
                {currentReports.map(report => (
                    <OrderReport key={report.reportID} report={report} onViewDetails={handleViewDetails} onMarkResolved={handleMarkResolved} />
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

            {isModalOpen && selectedReport && (
                <ReportModal
                    report={selectedReport}
                    onClose={handleCloseModal}
                    onMarkResolved={handleMarkResolved}
                />
            )}
        </div>
    );
};

export default EmployeeManageReport;