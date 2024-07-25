import React, { useState, useEffect } from 'react';
import './ManageReportStyles.module.scss'
import { motion } from 'framer-motion';
import { FaUser, FaCalendar, FaClipboardCheck, FaExclamationCircle, FaTimes } from 'react-icons/fa';

interface Report {
    id: number;
    orderId: string;
    customerName: string;
    date: string;
    status: 'Pending' | 'Resolved';
    description: string;
}

const OrderReport: React.FC<{ report: Report; onViewDetails: (report: Report) => void; onMarkResolved: (id: number) => void }> = ({ report, onViewDetails, onMarkResolved }) => (
    <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
        <h3 className="text-xl font-semibold mb-3 text-indigo-700">Order #{report.orderId}</h3>
        <p className="text-gray-600 mb-2">Customer: {report.customerName}</p>
        <p className="text-gray-600 mb-2">Date: {report.date}</p>
        <p className="text-gray-600 mb-2">Status:
            <span className={`ml-2 font-semibold px-2 py-1 rounded-full ${report.status === 'Resolved'
                ? 'bg-green-200 text-green-800'
                : 'bg-yellow-200 text-yellow-800'
                }`}>
                {report.status}
            </span>
        </p>
        <p className="text-gray-700 mt-4">{report.description}</p>
        <div className="mt-6 flex justify-between">
            <button onClick={() => onViewDetails(report)} className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-300">View Details</button>
            <button
                onClick={() => onMarkResolved(report.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
            >
                Mark as Resolved
            </button>
        </div>
    </div>
);

const ReportModal: React.FC<{ report: Report; onClose: () => void; onMarkResolved: (id: number) => void }> = ({ report, onClose, onMarkResolved }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="relative bg-white w-full max-w-2xl rounded-lg shadow-2xl p-8"
            onClick={e => e.stopPropagation()}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-150"
            >
                <FaTimes size={24} />
            </button>

            <h2 className="text-3xl font-bold text-indigo-700 mb-6">Order Report Details</h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                    <p className="text-gray-600 flex items-center mb-2">
                        <FaClipboardCheck className="mr-2 text-indigo-500" />
                        <span className="font-semibold">Order ID:</span>
                    </p>
                    <p className="text-xl font-bold text-gray-800">{report.orderId}</p>
                </div>
                <div>
                    <p className="text-gray-600 flex items-center mb-2">
                        <FaUser className="mr-2 text-indigo-500" />
                        <span className="font-semibold">Customer:</span>
                    </p>
                    <p className="text-xl font-bold text-gray-800">{report.customerName}</p>
                </div>
                <div>
                    <p className="text-gray-600 flex items-center mb-2">
                        <FaCalendar className="mr-2 text-indigo-500" />
                        <span className="font-semibold">Date:</span>
                    </p>
                    <p className="text-xl font-bold text-gray-800">{report.date}</p>
                </div>
                <div>
                    <p className="text-gray-600 flex items-center mb-2">
                        <FaExclamationCircle className="mr-2 text-indigo-500" />
                        <span className="font-semibold">Status:</span>
                    </p>
                    <p className={`text-xl font-bold ${report.status === 'Resolved' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {report.status}
                    </p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Description</h3>
                <p className="text-gray-600 bg-gray-100 p-4 rounded-lg">{report.description}</p>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150"
                >
                    Close
                </button>
                <button
                    onClick={() => onMarkResolved(report.id)}
                    className={`px-6 py-3 rounded-lg text-white transition duration-150 ${report.status === 'Resolved'
                        ? 'bg-green-500 hover:bg-green-600 cursor-not-allowed'
                        : 'bg-indigo-500 hover:bg-indigo-600'
                        }`}
                    disabled={report.status === 'Resolved'}
                >
                    {report.status === 'Resolved' ? 'Already Resolved' : 'Mark as Resolved'}
                </button>
            </div>
        </motion.div>
    </motion.div>
);

const EmployeeManageReport: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([
        { id: 1, orderId: '12345', customerName: 'John Doe', date: '2024-07-25', status: 'Pending', description: 'The product arrived damaged.' },
        { id: 2, orderId: '67890', customerName: 'Jane Smith', date: '2024-07-24', status: 'Resolved', description: 'Wrong item received, but customer support helped resolve the issue.' },
        { id: 3, orderId: '11111', customerName: 'Alice Johnson', date: '2024-07-23', status: 'Pending', description: 'Item not as described.' },
        { id: 4, orderId: '22222', customerName: 'Bob Brown', date: '2024-07-22', status: 'Resolved', description: 'Late delivery, but resolved with a refund.' },
        { id: 5, orderId: '33333', customerName: 'Carol White', date: '2024-07-21', status: 'Pending', description: 'Package lost in transit.' },
        { id: 6, orderId: '44444', customerName: 'David Black', date: '2024-07-20', status: 'Resolved', description: 'Received a refund for a damaged product.' },
        { id: 7, orderId: '55555', customerName: 'Eve Green', date: '2024-07-19', status: 'Pending', description: 'Missing parts in the package.' },
        { id: 8, orderId: '66666', customerName: 'Frank Red', date: '2024-07-18', status: 'Resolved', description: 'Replacement sent for a defective item.' },
        { id: 9, orderId: '77777', customerName: 'Grace Blue', date: '2024-07-17', status: 'Pending', description: 'Incorrect size received.' },
        { id: 10, orderId: '88888', customerName: 'Hank Yellow', date: '2024-07-16', status: 'Resolved', description: 'Refund issued for a missing package.' },
        { id: 11, orderId: '99999', customerName: 'Ivy Purple', date: '2024-07-15', status: 'Pending', description: 'Delayed shipment.' },
        { id: 12, orderId: '10101', customerName: 'Jack Orange', date: '2024-07-14', status: 'Resolved', description: 'Product returned and refund processed.' },
        { id: 13, orderId: '20202', customerName: 'Kate Pink', date: '2024-07-13', status: 'Pending', description: 'Received wrong color.' },
        { id: 14, orderId: '30303', customerName: 'Leo Brown', date: '2024-07-12', status: 'Resolved', description: 'Exchanged for the correct item.' },
        { id: 15, orderId: '40404', customerName: 'Mia Grey', date: '2024-07-11', status: 'Pending', description: 'Package damaged in transit.' },
        { id: 16, orderId: '50505', customerName: 'Nick White', date: '2024-07-10', status: 'Resolved', description: 'Refund for delayed shipment.' },
        { id: 17, orderId: '60606', customerName: 'Olive Black', date: '2024-07-09', status: 'Pending', description: 'Product arrived defective.' },
        { id: 18, orderId: '70707', customerName: 'Paul Green', date: '2024-07-08', status: 'Resolved', description: 'Replacement sent for missing parts.' },
        { id: 19, orderId: '80808', customerName: 'Quinn Red', date: '2024-07-07', status: 'Pending', description: 'Incorrect item shipped.' },
        { id: 20, orderId: '90909', customerName: 'Rita Blue', date: '2024-07-06', status: 'Resolved', description: 'Refund processed for incorrect item.' },
        { id: 21, orderId: '11112', customerName: 'Sam Yellow', date: '2024-07-05', status: 'Pending', description: 'Product not received.' },
        { id: 22, orderId: '22223', customerName: 'Tina Purple', date: '2024-07-04', status: 'Resolved', description: 'Refund for lost package.' },
        { id: 23, orderId: '33334', customerName: 'Uma Orange', date: '2024-07-03', status: 'Pending', description: 'Delayed delivery.' },
        { id: 24, orderId: '44445', customerName: 'Vince Pink', date: '2024-07-02', status: 'Resolved', description: 'Replacement sent for delayed shipment.' },
        { id: 25, orderId: '55556', customerName: 'Walt Brown', date: '2024-07-01', status: 'Pending', description: 'Received the wrong item.' },
        { id: 26, orderId: '66667', customerName: 'Xena Grey', date: '2024-06-30', status: 'Resolved', description: 'Refund processed for wrong item.' },
        { id: 27, orderId: '77778', customerName: 'Yuri White', date: '2024-06-29', status: 'Pending', description: 'Product arrived damaged.' },
        { id: 28, orderId: '88889', customerName: 'Zane Black', date: '2024-06-28', status: 'Resolved', description: 'Replacement sent for damaged product.' },
        { id: 29, orderId: '99990', customerName: 'Amy Green', date: '2024-06-27', status: 'Pending', description: 'Missing parts.' },
        { id: 30, orderId: '10102', customerName: 'Brian Red', date: '2024-06-26', status: 'Resolved', description: 'Refund for missing parts.' },
        { id: 31, orderId: '20203', customerName: 'Cathy Blue', date: '2024-06-25', status: 'Pending', description: 'Wrong size.' },
        { id: 32, orderId: '30304', customerName: 'Derek Yellow', date: '2024-06-24', status: 'Resolved', description: 'Exchanged for correct size.' },
        { id: 33, orderId: '40405', customerName: 'Eve Purple', date: '2024-06-23', status: 'Pending', description: 'Delayed shipment.' },
        { id: 34, orderId: '50506', customerName: 'Frank Orange', date: '2024-06-22', status: 'Resolved', description: 'Refund for delayed shipment.' },
        { id: 35, orderId: '60607', customerName: 'Grace Pink', date: '2024-06-21', status: 'Pending', description: 'Product not as described.' },
        { id: 36, orderId: '70708', customerName: 'Henry Brown', date: '2024-06-20', status: 'Resolved', description: 'Replacement sent for incorrect item.' },
        { id: 37, orderId: '80809', customerName: 'Ivy Grey', date: '2024-06-19', status: 'Pending', description: 'Package lost in transit.' },
        { id: 38, orderId: '90910', customerName: 'Jack White', date: '2024-06-18', status: 'Resolved', description: 'Refund for lost package.' },
        { id: 39, orderId: '11113', customerName: 'Kate Black', date: '2024-06-17', status: 'Pending', description: 'Incorrect color received.' },
        { id: 40, orderId: '22224', customerName: 'Leo Green', date: '2024-06-16', status: 'Resolved', description: 'Exchanged for correct color.' },
        { id: 41, orderId: '33335', customerName: 'Mia Red', date: '2024-06-15', status: 'Pending', description: 'Received a damaged product.' },
        { id: 42, orderId: '44446', customerName: 'Nick Blue', date: '2024-06-14', status: 'Resolved', description: 'Replacement sent for damaged product.' },
        { id: 43, orderId: '55557', customerName: 'Olive Yellow', date: '2024-06-13', status: 'Pending', description: 'Product arrived defective.' },
    ]);

    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage] = useState(6);
    const [filters, setFilters] = useState({
        date: '',
        status: '',
        name: '',
    });
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [goToPage, setGoToPage] = useState('1');

    useEffect(() => {
        applyFilters();
    }, [filters, reports]);

    const applyFilters = () => {
        let filtered = reports;
        if (filters.date) {
            filtered = filtered.filter(report => report.date === filters.date);
        }
        if (filters.status) {
            filtered = filtered.filter(report => report.status === filters.status);
        }
        if (filters.name) {
            filtered = filtered.filter(report =>
                report.customerName.toLowerCase().includes(filters.name.toLowerCase())
            );
        }
        setFilteredReports(filtered);
        setCurrentPage(1);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
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

    const handleMarkResolved = (id: number) => {
        setReports(reports.map(report =>
            report.id === id ? { ...report, status: 'Resolved' } : report
        ));
        handleCloseModal();
    };

    return (
        <div>
            <div className="mb-8 flex flex-wrap gap-4 justify-center bg-white p-6 rounded-lg shadow-lg">
                <input
                    type="date"
                    name="date"
                    onChange={handleFilterChange}
                    className="px-4 py-2 rounded-full border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out transform hover:scale-105"
                />
                <select
                    name="status"
                    onChange={handleFilterChange}
                    className="px-4 py-2 rounded-full border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out transform hover:scale-105"
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                </select>
                <input
                    type="text"
                    name="name"
                    placeholder="Filter by customer name..."
                    onChange={handleFilterChange}
                    className="px-4 py-2 rounded-full border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out transform hover:scale-105"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentReports.map(report => (
                    <OrderReport key={report.id} report={report} onViewDetails={handleViewDetails} onMarkResolved={handleMarkResolved} />
                ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center space-x-4">
                <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="border rounded-md px-3 py-2 text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:border-orange-500"
                >
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