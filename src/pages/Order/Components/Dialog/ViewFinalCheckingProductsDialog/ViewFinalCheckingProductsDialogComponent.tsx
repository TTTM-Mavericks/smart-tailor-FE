import { useEffect, useState } from "react";
import { Report, ReportImageList } from "../../../../../models/EmployeeManageReportModel";
import { FaCalendar, FaChevronLeft, FaChevronRight, FaClipboardCheck, FaExclamationCircle, FaUser } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { greenColor, redColor } from "../../../../../root/ColorSystem";
import { motion } from 'framer-motion';
import { OrderDetailInterface } from "../../../../../models/OrderModel";
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from "../../../../../api/ApiConfig";
import { __getToken, __getUserLogined } from "../../../../../App";
import LoadingComponent from "../../../../../components/Loading/LoadingComponent";
import { toast, ToastContainer } from "react-toastify";
import { UserInterface } from "../../../../../models/UserModel";
import { __handleSendNotification } from "../../../../../utils/NotificationUtils";

function isReportImageListArray(reportImageList?: ReportImageList | ReportImageList[]): reportImageList is ReportImageList[] {
    return Array.isArray(reportImageList);
}

const ViewFinalCheckingProductsDialogComponent: React.FC<{ order?: OrderDetailInterface; onClose: () => void; onMarkResolved?: (reportID: string) => void }> = ({ order, onClose, onMarkResolved }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [report, setReport] = useState<Report>();
    const [isLoading, setIsLoading] = useState<boolean>(false);



    useEffect(() => {
        __handleFetchReport()
    }, [])

    const __handleFetchReport = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.report + functionEndpoints.report.getReportByOrderID}/${order?.orderID}`, null, __getToken());
            if (response.status === 200) {
                const reports = response.data;
                console.log(response.data);

                // Convert createDate to Date objects and find the most recent report
                const nearestReport = reports.reduce((latestReport: any, currentReport: any) => {
                    const latestDate = new Date(latestReport.createDate.split(' ').join('T'));
                    const currentDate = new Date(currentReport.createDate.split(' ').join('T'));

                    return currentDate > latestDate ? currentReport : latestReport;
                });

                setReport(nearestReport);
                setIsLoading(false);
            } else {
                console.log('detail error: ', response.message);

            }
        } catch (error) {
            console.log('error: ', error);

        }
    };

    const __handleReportOrder = async (status: string) => {
        setIsLoading(true);

        const fileToBase64 = (file: File) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
            });
        };

        try {

            const bodyData = {
                typeOfReport: 'REPORT_ORDER',
                orderID: order?.orderID,
                userID: __getUserLogined().userID,
                content: status === 'ACCEPTED_PRODUCTS' ? "Accepted to delivery" : "Deny products",
                reportImageList: [],
            };
            console.log('bodyDataRport: ', bodyData);


            const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.report + functionEndpoints.report.createOrderReport}`, bodyData, __getToken());

            if (response.status === 200) {
                toast.success(`${response.message}`, { autoClose: 4000 });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

                const user: UserInterface = __getUserLogined();
                const bodyRequest = {
                    senderID: user.userID,
                    recipientID: order?.employeeID,
                    action: 'REPORT',
                    type: status,
                    targetID: order?.orderID,
                    message: status === 'ACCEPTED_PRODUCTS' ? "Accepted to delivery" : "Deny products",
                };

                console.log(bodyRequest);

                await __handleSendNotification(bodyRequest);

            } else {
                toast.error(`${response.message}`, { autoClose: 4000 });

            }
        } catch (error) {
            console.log('error: ', error);
            toast.error(`${error}`, { autoClose: 4000 });
            setIsLoading(false);
        }
    };


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
        if (isReportImageListArray(report?.reportImageList)) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === report?.reportImageList.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const prevImage = () => {
        if (isReportImageListArray(report?.reportImageList)) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? report?.reportImageList.length - 1 : prevIndex - 1
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
            <ToastContainer></ToastContainer>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
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

                <h2 className="text-sm  font-bold text-indigo-700 mb-6 shadow-text">Order Report Details</h2>

                <div className="flex justify-between items-center mb-6 bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <FaClipboardCheck className="text-indigo-500 mr-2" size={20} />
                        <span className="text-sm  font-semibold text-gray-700">Report ID:</span>
                        <p className="text-sm font-bold text-indigo-700 ml-2">{report?.reportID}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[
                        { icon: FaUser, label: 'Customer', value: report?.orderResponse.buyerName },
                        { icon: FaCalendar, label: 'Date', value: report?.createDate },
                        {
                            icon: FaExclamationCircle,
                            label: 'Report Status',
                            value: report?.reportStatus ? 'Read' : 'Unread',
                            customClass: report?.reportStatus ? 'text-green-600' : 'text-yellow-600'
                        },
                        {
                            icon: FaExclamationCircle,
                            label: 'Order Status',
                            value: report?.orderResponse.orderStatus,
                            // customClass: getStatusColor(report?.orderResponse?.orderStatus)
                        }
                    ].map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 flex items-center mb-2">
                                <item.icon className="mr-2 text-indigo-500" />
                                <span className="text-sm font-semibold">{item.label}:</span>
                            </p>
                            <p className={`text-sm  font-bold ${item.customClass || 'text-gray-800'}`}>
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mb-8">
                    <h3 className="text-sm  font-semibold text-gray-700 mb-3">Description</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                        {report?.content}
                    </p>
                </div>

                {isReportImageListArray(report?.reportImageList) && report?.reportImageList.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-sm  font-semibold text-gray-700 mb-3">Report Images</h3>
                        <div className="relative flex items-center justify-center">
                            <img
                                src={report?.reportImageList[currentImageIndex].reportImageUrl}
                                alt={report?.reportImageList[currentImageIndex].reportImageName}
                                className="object-cover rounded-lg"
                                style={{ width: 500, height: 550 }}
                            />
                            {report?.reportImageList.length > 1 && (
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
                        className="px-2 py-2 text-white rounded-md hover:bg-red-700 transition duration-200 mr-0"
                        style={{ backgroundColor: greenColor, fontSize: 13 }}
                        onClick={() => __handleReportOrder('ACCEPTED_PRODUCTS')}
                    >
                        Accept to delivery
                    </button>
                    <button
                        className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200 mr-0"
                        style={{ backgroundColor: redColor, fontSize: 13 }}
                        onClick={() => __handleReportOrder('REJECT_PRODUCTS')}

                    >
                        Reject
                    </button>
                </div>


            </motion.div>
        </motion.div>
    );
};

export default ViewFinalCheckingProductsDialogComponent