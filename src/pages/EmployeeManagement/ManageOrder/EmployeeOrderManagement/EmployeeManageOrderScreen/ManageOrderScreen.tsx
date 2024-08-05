import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendar, FaClipboardCheck, FaExclamationCircle, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { ArrowDropDown, BrandingWatermark } from '@mui/icons-material';
import axios from 'axios';
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { EmployeeOrder, ImageList } from '../../../../../models/EmployeeManageOrderModel';
import { motion } from 'framer-motion'
import { toast } from 'react-toastify';
import LoadingComponent from '../../../../../components/Loading/LoadingComponent';
import PartOfDesignInformationDialogComponent from '../../../../BrandManagement/BrandOrderManagement/PartOfDesignInformationDialogComponent';
import { greenColor, primaryColor, redColor, secondaryColor, yellowColor } from '../../../../../root/ColorSystem';
import { __handleAddCommasToNumber } from '../../../../../utils/NumbericUtils';
import { UserInterface } from '../../../../../models/UserModel';
import Cookies from 'js-cookie';
import BrandUpdateSampleProductDialog from '../../../../BrandManagement/GlobalComponent/Dialog/UpdateSampleProduct/BrandUpdateSampleProductDialog';
import ViewSampleUpdateDialog from './ViewSampleUpdateDialog';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { __handlegetRatingStyle, __handlegetStatusBackgroundBoolean } from '../../../../../utils/ElementUtils';
import style from './EmployeeManageOrderStyle.module.scss'
import { OrderDetailInterface } from '../../../../../models/OrderModel';
import { CircularProgress } from '@mui/material';
import { CustomerReportOrderDialogComponent } from '../../../../../components';
/**
 * 
 * @param status 
 * @returns 
 * Take The Status of all state
 * With Each status have each color
 */
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

/**
 * 
 * @param param0 
 * @returns 
 * Show The modal when click on the each item part
 * Show the information of each item part
 */
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
                        <h2 className="text-xl font-bold" style={{ fontSize: "13px" }}>{part.partOfDesignName}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 pr-4">
                            <img src={part.successImageUrl || '/placeholder-image.png'} alt={part.partOfDesignName} className="w-full h-auto object-contain" />
                        </div>
                        <div className="w-1/2 pl-4">
                            <h3 className="text-lg font-semibold mb-2" style={{ fontSize: "13px" }}>Item Masks</h3>
                            <div className="bg-gray-100 p-4 rounded">
                                {part?.itemMasks && part.itemMasks.map((mask: any) => (
                                    <div>
                                        <div>
                                            {mask.imageUrl && <img src={mask.imageUrl} alt="Mask Image" style={{ width: 70, height: 80 }} />}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: "13px" }}><strong>Item Mask Name:</strong> {mask.itemMaskName}</p>
                                            <p style={{ fontSize: "13px" }}><strong>Type:</strong> {mask.typeOfItem}</p>
                                            <p style={{ fontSize: "13px" }}><strong>Position:</strong> X: {mask.positionX}, Y: {mask.positionY}</p>
                                            <p style={{ fontSize: "13px" }}><strong>Scale:</strong> X: {mask.scaleX}, Y: {mask.scaleY}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

/**
 * 
 * @param param0 
 * @returns 
 * Show The part of design when click on the Show Design Details
 * Show All 4 part
 */
const DesignDetails: React.FC<{ design: any }> = ({ design }) => {
    const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
    const [selectedDesignPart, setSelectedDesignPart] = useState<any>(null);
    console.log("bebe" + JSON.stringify(selectedDesignPart));
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="mt-4 p-4 rounded-lg">
            <h4 className="text-sm font-semibold mb-4">Part of Designs</h4>
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
                        <p className="text-sm font-medium">Part name: {part.partOfDesignName}</p>
                        <p className='text-sm'>Material name: {part.material?.materialName || 'N/A'}</p>
                        <p className='text-sm'>HS code: {part.material?.hsCode || 'N/A'}</p>
                    </div>
                    {(part?.itemMasks && part?.itemMasks?.length > 0) && (
                        <div className="ml-auto">
                            <button
                                onClick={() => {
                                    setSelectedDesignPart(part);
                                    setIsDesignModalOpen(true);
                                    setDialogOpen(true)
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
                <PartOfDesignInformationDialogComponent open={dialogOpen} onClose={() => setIsDesignModalOpen(false)} part={selectedDesignPart} />
            )}
        </div>
    );
};

/**
 * 
 * @param param0 
 * @returns 
 * The Card when first load the page order management
 * call api /get-all-design-detail-by-order-id
 * Click on DesignDetails to show the detail of the Order Brand Details
 */
const EmployeeOrderFields: React.FC<{
    order: EmployeeOrder;
    onViewDetails: (order: EmployeeOrder, design: any) => void;
    onUpdatedOrderPending: (orderID: string) => void;
}> = ({ order, onViewDetails, onUpdatedOrderPending }) => {
    const [showDesignDetails, setShowDesignDetails] = useState(false);
    const [designDetails, setDesignDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userAuth, setUseAuth] = useState<UserInterface>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);


    useEffect(() => {
        const userStorage = Cookies.get('userAuth');
        if (!userStorage) return;
        const userParse: UserInterface = JSON.parse(userStorage)
        setUseAuth(userParse);
    }, [])

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
        fetchDesignDetails();
    }, [order.orderID]);

    const __handleOpenInputSampleProductDialog = (orderID: any) => {
        setSelectedOrderID(orderID);
        setIsDialogOpen(true);
    };

    const __handleCloseInputSampleProductDialog = () => {
        setIsDialogOpen(false);
        setSelectedOrderID(null);
    };

    return (
        <div className="bg-white mb-8 shadow-lg rounded-lg p-6 transition duration-300 ease-in-out transform hover:shadow-xl">
            <h3 className="text-sm font-semibold mb-3 text-indigo-700">Type order: {order.orderType}</h3>
            <div className="flex justify-between">
                <div className="w-1/2">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {isLoading ? (
                                <p className='text-sm'>Loading image...</p>
                            ) : designDetails && designDetails.imageUrl ? (
                                <div className="mb-4">
                                    <img
                                        src={designDetails.imageUrl}
                                        alt="Model"
                                        className="mt-0 w-40 h-52 rounded-lg"
                                    />
                                </div>
                            ) : (
                                <p style={{ fontSize: "13px" }}>No image available</p>
                            )}
                        </div>
                        <div className="ml-4 mt-10">
                            <p className="text-gray-600 mb-2 text-sm">Order ID: {order.orderID}</p>
                            <p className="text-gray-600 mb-2 text-sm">
                                Order Status: <span className={`mb-2 ${getStatusColor(order.orderStatus)} font-bold`}>{order.orderStatus}</span>
                            </p>
                            <div className="mt-4">
                                {order.detailList.map((detail, index) => (
                                    <p key={index} className="text-gray-600 text-sm">
                                        Size {detail.size.sizeName}: Quantity {detail.quantity}
                                    </p>
                                ))}
                            </div>
                            <p className="text-gray-700 mt-4 text-sm">Price: {__handleAddCommasToNumber(order.totalPrice)} VND</p>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 mt-10 pl-28">
                    <p className="text-gray-600 mb-2 text-sm">Customer: {order.buyerName}</p>
                    <p className="text-gray-600 mb-2 text-sm">Date: {order.createDate}</p>
                    <p className="text-gray-600 mb-2 text-sm">
                        Address: {order.address}, {order.ward}, {order.district}, {order.province}
                    </p>
                </div>
            </div>
            <div className="mt-4 flex items-center" onClick={() => setShowDesignDetails(!showDesignDetails)}>
                <ArrowDropDown
                    className="cursor-pointer mr-2"
                />
                <span style={{ fontSize: 14, fontWeight: "bold" }}>Show Design Details</span>
            </div>
            {showDesignDetails && (
                <DesignDetails design={designDetails} />
            )}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => __handleOpenInputSampleProductDialog(order.orderID)}
                    className="bg-indigo-500 text-sm text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-300 mr-4"
                    style={{
                        borderRadius: 4,
                        backgroundColor: yellowColor
                    }}
                >
                    View sample data
                </button>
                <ViewSampleUpdateDialog isOpen={isDialogOpen} orderID={order.orderID} brandID={userAuth?.userID} onClose={__handleCloseInputSampleProductDialog}></ViewSampleUpdateDialog>

                <button
                    onClick={() => onViewDetails(order, designDetails)}
                    className="bg-indigo-500 text-sm text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-300 mr-4"
                    style={{
                        borderRadius: 4,
                        backgroundColor: secondaryColor
                    }}
                >
                    View details
                </button>
                <button
                    onClick={() => onUpdatedOrderPending(order.orderID)}
                    className="bg-green-500 text-sm text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                    style={{
                        borderRadius: 4,
                        backgroundColor: primaryColor
                    }}
                >
                    Verify order
                </button>
            </div>
        </div>
    );
};

/**
 * 
 * @param orderImageList 
 * @returns 
 * Function to get All Image (if need)
 */
function isOrderImageListArray(orderImageList: ImageList | ImageList[]): orderImageList is ImageList[] {
    return Array.isArray(orderImageList);
}

/**
 * 
 * @param param0 
 * @returns 
 * The modal of the Brand when click on the View Detail Button
 */
const EmployeeOrderModal: React.FC<{ order: EmployeeOrder; onClose: () => void; onUpdatedOrderPending: (orderID: string) => void, designDetails: any }> = ({ order, onClose, onUpdatedOrderPending, designDetails }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [orderChild, setOrderChild] = useState<{ [orderId: string]: OrderDetailInterface[] }>({});
    const [isOpenReportOrderDialog, setIsOpenReportOrderDialog] = useState<boolean>(false);
    const [isOpenReportOrderCanceledDialog, setIsOpenReportOrderCanceledDialog] = useState<boolean>(false);




    useEffect(() => {
        __handleFetchOrderDetails(order.orderID);
    }, [order])

    // TODO
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

    const getStatusColorOfSubOrder = (status: string) => {
        switch (status) {
            case 'NOT_VERIFY': return 'text-gray-600';
            case 'PENDING': return 'text-yellow-600';
            case 'START_PRODUCING': return secondaryColor;
            case 'PROCESSING': return 'text-orange-600';
            case 'CANCEL': return redColor;
            case 'COMPLETED': return greenColor;
            case 'FINISH_FIRST_STAGE': return primaryColor;
            case 'FINISH_SECOND_STAGE': return primaryColor;
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

    const __handleFetchOrderDetails = async (orderId: string) => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getAllSubOrder}/${orderId}`);
            if (response.status === 200) {
                setOrderChild(prevState => ({
                    ...prevState,
                    [orderId]: response.data // Assuming response.data is an array of OrderDetailInterface
                }));
            }
        } catch (error) {
            console.error(`Error fetching details for order ${orderId}:`, error);
        }
    };

    const __handleOpenReportDialog = () => {
        console.log('open');
        setIsOpenReportOrderCanceledDialog(true);
    }

    /**
     * Handle cancel order click
     */
    const _handleCancelOrder = async (orderDetail: any) => {
        try {
            const bodyRequest = {
                orderID: orderDetail?.orderID,
                status: 'CANCEL'
            }
            console.log('bodyRequest: ', bodyRequest);
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest);
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                toast.success(`${response.message}`, { autoClose: 4000 });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
            else {
                console.log('detail error: ', response.message);
                toast.error(`${response.message}`, { autoClose: 4000 });
            }
        } catch (error) {
            console.log('error: ', error);
            toast.error(`${error}`, { autoClose: 4000 });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${style.custom__scrollbar} fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50`}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className={`${style.custom__scrollbar} relative bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto`}
                onClick={e => e.stopPropagation()}
            >
                {/* <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-150"
                    aria-label="Close modal"
                >
                    <FaTimes size={20} />
                </button> */}
                <IoMdCloseCircleOutline
                    cursor="pointer"
                    size={20}
                    color="red"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />

                <div className={`${style.employeeManagerOrderDialog__content}`}>
                    <h2 className="text-md font-bold text-indigo-700 mb-4 shadow-text">Order Brand Details</h2>

                    <div className="flex justify-between items-center mb-4 bg-indigo-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <FaClipboardCheck className="text-indigo-500" size={16} />
                            <span className="font-semibold text-gray-700 text-sm">Order ID:</span>
                            <p className="text-sm font-bold text-indigo-700 ml-2">{order.orderID}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {[
                            { icon: FaUser, label: 'Customer', value: order.buyerName },
                            { icon: FaCalendar, label: 'Create date', value: order.createDate },
                            { icon: FaCalendar, label: 'Expected start at', value: order.expectedStartDate },
                            { icon: FaCalendar, label: 'Expected complete at', value: order.expectedProductCompletionDate },
                            {
                                icon: FaExclamationCircle,
                                label: 'Order Status',
                                value: order.orderStatus,
                                customClass: getStatusColor(order.orderStatus)
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-600 flex items-center mb-1 text-xs">
                                    <item.icon className="mr-2 text-indigo-500" size={14} />
                                    <span className="font-semibold" style={{ fontSize: "13px" }}>{item.label}:</span>
                                </p>
                                <p className={`text-sm font-bold ${item.customClass || 'text-gray-800'}`} style={{ fontSize: "13px" }}>
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {designDetails && (
                        <div className="mb-6 flex justify-center">
                            <div className="text-center">
                                <img
                                    src={designDetails.imageUrl}
                                    alt="Model"
                                    className="max-w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>
                    )}


                    {isOrderImageListArray(order.orderImageList) && order.orderImageList.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2" style={{ fontSize: "13px" }}>Report Images</h3>
                            <div className="relative">
                                <img
                                    src={order.orderImageList[currentImageIndex].orderImageUrl}
                                    alt={order.orderImageList[currentImageIndex].orderImageName}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                {order.orderImageList.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full">
                                            <FaChevronLeft size={14} />
                                        </button>
                                        <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full">
                                            <FaChevronRight size={14} />
                                        </button>
                                    </>
                                )}
                            </div>
                            <p className="text-center mt-2 text-gray-600 text-xs">
                                {order.orderImageList[currentImageIndex].orderImageName}
                            </p>
                        </div>
                    )}
                </div>


                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600 flex items-center mb-1 text-xs">
                        <BrandingWatermark className="mr-2 text-indigo-500" size={14} />
                        <span className="font-semibold">Brand list:</span>
                    </p>

                </div>


                {/* {isOrderImageListArray(order.orderImageList) && order.orderImageList.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Report Images</h3>
                                <div className="relative">
                                    <img
                                        src={order.orderImageList[currentImageIndex].orderImageUrl}
                                        alt={order.orderImageList[currentImageIndex].orderImageName}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    {order.orderImageList.length > 1 && (
                                        <>
                                            <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full">
                                                <FaChevronLeft size={14} />
                                            </button>
                                            <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full">
                                                <FaChevronRight size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                <p className="text-center mt-2 text-gray-600 text-xs">
                                    {order.orderImageList[currentImageIndex].orderImageName}
                                </p>
                            </div>
                        )} */}

                {orderChild[order.orderID] ? orderChild[order.orderID]?.map((order, itemIndex) => (
                    <div key={itemIndex} className=" relative flex flex-col md:flex-row items-start md:items-center mt-10 mb-4 md:mb-6 border-b pb-4 md:pb-6">
                        <div className="flex-shrink-0">
                        </div>
                        <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex-grow" style={{ position: 'relative' }}>
                            <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Sub ID: <span className="text-sm text-gray-500 pb-2"> {order.orderID}</span></p>
                            <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Type: <span className="text-sm text-blue-700 pb-2"> {order.orderType}</span></p>
                            <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Brand ID: <span className="text-sm text-gray-500 pb-2">{order.brand?.brandID}</span></p>
                            <p style={{ fontWeight: '500' }} className="text-sm text-black flex content-center items-center">Brand:
                                <p style={{ fontWeight: '500' }} className="text-sm text-black flex content-center items-center">
                                    <img src={order.brand?.user.imageUrl} style={{ width: 30, height: 30, borderRadius: 90, marginLeft: 5, marginRight: 5 }}></img>
                                    <p className={`${__handlegetRatingStyle(order.brand?.rating)} text-sm text-gray-500`} > {order.brand?.brandName}</p>
                                </p>
                            </p>
                            <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Rating: <span className="text-sm text-gray-500 pb-2">{order.brand?.rating}</span></p>

                            <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Total price: <span className="text-sm text-gray-500 pb-2"> {__handleAddCommasToNumber(order.totalPrice)} VND</span></p>
                            <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Expected start at: <span className="text-sm text-gray-500 pb-2"> {order.expectedStartDate}</span></p>
                            <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Expected complete at: <span className="text-sm text-gray-500 pb-2"> {order.expectedProductCompletionDate}</span></p>

                            <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2 flex content-center items-center">Status:
                                <button
                                    className={`py-1 px-3 rounded-full ml-2 text-white `}
                                    style={{ backgroundColor: getStatusColorOfSubOrder(order.orderStatus) }}
                                >
                                    {order.orderStatus}

                                </button>
                            </p>
                            <p style={{ fontWeight: '500' }} className="text-sm text-black pb-4">Details:
                                {order.detailList?.map((detail) => (
                                    <div className='ml-14 grid grid-cols-5 gap-5 pt-0'>
                                        <p className="text-sm text-gray-500 pb-2">Size: {detail.size?.sizeName}</p>
                                        <p className="text-sm text-gray-500 pb-2">Quantity: {detail.quantity}</p>
                                    </div>
                                ))}
                            </p>

                        </div>
                        {order.orderStatus !== 'COMPELETD' && (
                            <>
                                <button
                                    onClick={() => __handleOpenReportDialog()}
                                    className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200 mr-4"
                                    style={{ backgroundColor: redColor, position: 'absolute', top: 0, right: 10 }}
                                >
                                    CANCEL BRAND
                                </button>
                            </>
                        )}
                        <CustomerReportOrderDialogComponent
                            isCancelOrder={true}
                            orderID={order?.orderID}
                            onClose={() => setIsOpenReportOrderCanceledDialog(false)}
                            isOpen={isOpenReportOrderCanceledDialog}
                            onClickReportAndCancel={() => _handleCancelOrder(order)}
                        ></CustomerReportOrderDialogComponent>
                    </div>
                )
                ) : (
                    <div style={{ width: '100%', marginTop: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <CircularProgress size={20} />
                            <p className="text-sm text-gray-500 pl-3">Loading brands</p>

                        </div>
                    </div>
                )}




            </motion.div>
        </motion.div>
    );
};

/**
 * 
 * @returns 
 * Call Api /get-all-order
 * Get all the order of the brand 
 * show all card of the EmployeeOrderFields
 */
const EmployeeManageOrder: React.FC = () => {
    const [order, setOrder] = useState<EmployeeOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<EmployeeOrder[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(6);
    const [filters, setFilters] = useState({
        selectedFilter: 'date',
        date: '',
        status: '',
        name: '',
        orderStatus: '',
        orderID: '',
    });
    const [selectedOrder, setSelectedOrder] = useState<EmployeeOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [goToPage, setGoToPage] = useState('1');
    const [designDetails, setDesignDetails] = useState<any>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    useEffect(() => {
        const apiUrl = `${baseURL}${versionEndpoints.v1}${featuresEndpoints.order}${functionEndpoints.order.getAllOrder}`;
        setIsLoading(true);
        axios.get(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    const subOrders = responseData.data.filter((order: any) => order.orderType === FILTERED_ORDER_TYPE);
                    setOrder(subOrders);
                    console.log("Data received:", subOrders);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, order]);

    const handleUpdateOrder = async (orderID: string) => {
        try {
            setIsLoading(true);
            console.log("order id" + orderID);

            const response = await axios.put(
                `${baseURL}${versionEndpoints.v1}${featuresEndpoints.order}${functionEndpoints.order.changeOrderStatus}`,
                {
                    orderID: orderID,
                    status: "PENDING"
                }
            );

            if (response.status === 200) {
                setOrder(prevOrders =>
                    prevOrders.map(order =>
                        order.orderID === orderID ? { ...order, orderStatus: "PENDING" } : order
                    )
                );
                setIsLoading(false);
                toast.success("Update Status Order Success")
            } else {
                setIsLoading(false);
                toast.error("Updated Status Order Fail")
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(`Updated Status Order Fail beause of ${error}`)
        }
    };

    const FILTERED_ORDER_TYPE = "PARENT_ORDER";

    const applyFilters = () => {
        let filtered = order.filter(order => order.orderType === FILTERED_ORDER_TYPE);

        switch (filters.selectedFilter) {
            case 'date':
                if (filters.date) {
                    const filterDate = new Date(filters.date);
                    filtered = filtered.filter(order => {
                        const orderDate = new Date(order.createDate.split(' ')[0]);
                        return orderDate.toDateString() === filterDate.toDateString();
                    });
                }
                break;
            case 'orderID':
                if (filters.orderID) {
                    filtered = filtered.filter(order =>
                        order.orderID.toLowerCase().includes(filters.orderID.toLowerCase())
                    );
                }
                break;
            case 'name':
                if (filters.name) {
                    filtered = filtered.filter(order =>
                        order.orderType.toLowerCase().includes(filters.name.toLowerCase())
                    );
                }
                break;
            case 'orderStatus':
                if (filters.orderStatus !== '') {
                    filtered = filtered.filter(order => order.orderStatus === filters.orderStatus);
                }
                break;
        }

        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const indexOfLastReport = currentPage * itemsPerPage;
    const indexOfFirstReport = indexOfLastReport - itemsPerPage;
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

    const handleViewDetails = async (order: EmployeeOrder) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
        setDesignDetails(designDetails)
        try {
            const response = await axios.get(`${baseURL + versionEndpoints.v1 + featuresEndpoints.designDetail + functionEndpoints.designDetail.getAllInforOrderDetail + `/${order.orderID}`}`);
            setDesignDetails(response.data.data.design);
        } catch (error) {
            console.error('Error fetching design details:', error);
        } finally {
        }
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
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <LoadingComponent isLoading={isLoading} />
                </div>
            ) : (
                <>

                    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex flex-col">
                            <label htmlFor="filterSelect" className="mb-2 text-sm font-medium text-gray-700">Select Filter</label>
                            <select
                                id="filterSelect"
                                name="selectedFilter"
                                value={filters.selectedFilter}
                                onChange={handleFilterChange}
                                className="px-4 py-2 rounded-lg border-2 border-black-300 focus:outline-none focus:ring-black-300"
                            >
                                <option value="date">Date</option>
                                <option value="orderID">Order ID</option>
                                <option value="name">Brand Name</option>
                                <option value="orderStatus">Order Status</option>
                            </select>
                        </div>

                        {filters.selectedFilter === 'date' && (
                            <div className="flex flex-col">
                                <label htmlFor="dateFilter" className="mb-2 text-sm font-medium text-gray-700">Date</label>
                                <input
                                    id="dateFilter"
                                    type="date"
                                    name="date"
                                    value={filters.date}
                                    onChange={handleFilterChange}
                                    className="px-4 py-2 rounded-lg border-2 border-black-300 focus:outline-none focus:ring-black-300"
                                />
                            </div>
                        )}

                        {filters.selectedFilter === 'orderID' && (
                            <div className="flex flex-col">
                                <label htmlFor="orderIDFilter" className="mb-2 text-sm font-medium text-gray-700">Order ID</label>
                                <input
                                    id="orderIDFilter"
                                    type="text"
                                    name="orderID"
                                    value={filters.orderID}
                                    placeholder="Filter by Order ID..."
                                    onChange={handleFilterChange}
                                    className="px-4 py-2 rounded-lg border-2 border-black-300 focus:outline-none focus:ring-black-300"
                                />
                            </div>
                        )}

                        {filters.selectedFilter === 'name' && (
                            <div className="flex flex-col">
                                <label htmlFor="brandNameFilter" className="mb-2 text-sm font-medium text-gray-700">Brand Name</label>
                                <input
                                    id="brandNameFilter"
                                    type="text"
                                    name="name"
                                    value={filters.name}
                                    placeholder="Filter by brand name..."
                                    onChange={handleFilterChange}
                                    className="px-4 py-2 rounded-lg border-2 border-black-300 focus:outline-none focus:ring-black-300"
                                />
                            </div>
                        )}

                        {filters.selectedFilter === 'orderStatus' && (
                            <div className="flex flex-col">
                                <label htmlFor="orderStatusFilter" className="mb-2 text-sm font-medium text-gray-700">Order Status</label>
                                <select
                                    id="orderStatusFilter"
                                    name="orderStatus"
                                    value={filters.orderStatus}
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
                        )}
                    </div>

                    <div >
                        {currentOrders.map(order => (
                            <EmployeeOrderFields key={order.orderID} order={order} onViewDetails={handleViewDetails} onUpdatedOrderPending={handleUpdateOrder} />
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
                        <EmployeeOrderModal
                            designDetails={designDetails}
                            order={selectedOrder}
                            onClose={handleCloseModal}
                            onUpdatedOrderPending={handleMarkResolved}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default EmployeeManageOrder;