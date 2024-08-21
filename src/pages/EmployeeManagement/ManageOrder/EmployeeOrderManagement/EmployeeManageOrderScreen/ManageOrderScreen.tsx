import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendar, FaClipboardCheck, FaExclamationCircle, FaChevronLeft, FaChevronRight, FaTimes, FaImage, FaFileAlt, FaBox, FaCalendarAlt, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import { ArrowDropDown, BrandingWatermark, Cancel, Verified, ViewAgenda, ViewAgendaOutlined, Visibility } from '@mui/icons-material';
import axios from 'axios';
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { EmployeeOrder, EmployeeOrderTable, ImageList } from '../../../../../models/EmployeeManageOrderModel';
import { motion } from 'framer-motion'
import { toast } from 'react-toastify';
import LoadingComponent from '../../../../../components/Loading/LoadingComponent';
import PartOfDesignInformationDialogComponent from '../../../../BrandManagement/BrandOrderManagement/PartOfDesignInformationDialogComponent';
import { blackColor, cancelColor, cancelColorText, completeColor, completeColorText, deliveredColor, deliveredColorText, deposisColor, deposisColorText, greenColor, pendingColor, pendingColorText, primaryColor, processingColor, processingColorText, redColor, secondaryColor, whiteColor, yellowColor } from '../../../../../root/ColorSystem';
import { __handleAddCommasToNumber } from '../../../../../utils/NumbericUtils';
import { UserInterface } from '../../../../../models/UserModel';
import Cookies from 'js-cookie';
import BrandUpdateSampleProductDialog from '../../../../BrandManagement/GlobalComponent/Dialog/UpdateSampleProduct/BrandUpdateSampleProductDialog';
import ViewSampleUpdateDialog from './ViewSampleUpdateDialog';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { __handlegetRatingStyle, __handlegetStatusBackgroundBoolean } from '../../../../../utils/ElementUtils';
import style from './EmployeeManageOrderStyle.module.scss'
import { OrderDetailInterface } from '../../../../../models/OrderModel';
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, useTheme } from '@mui/material';
import { CustomerReportOrderDialogComponent } from '../../../../../components';
import Select from 'react-select';
import { width } from '@mui/system';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../../../../theme';
import { __handleGetDateTimeColor, __isNearCurrentDate } from '../../../../../utils/DateUtils';
import { __getToken } from '../../../../../App';
import FinalCheckingProductsDialogComponent from '../../../../../components/Dialog/FinalCheckingProductsDialog/FinalCheckingProductsDialogComponent';
import MaterialDetailTableComponent from '../../../../Order/Components/Table/MaterialDetailTableComponent';



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
        case 'RECEIVED': return 'text-green-400';
        case 'REFUND_REQUEST': return 'text-red-600';


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
    const [isOpenReportOrderCanceledDialog, setIsOpenReportOrderCanceledDialog] = useState<boolean>(false);
    const [isOpenFinalCheckingOrderDialog, setIsOpenFinalCheckingOrderDialog] = useState<boolean>(false);
    const [selectedOrderMaterial, setSelectedOrderMaterial] = useState<any>();



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

    const __handleUpdateOrderDelivery = async (orderId: any, type: string) => {
        setIsLoading(true)
        try {
            const bodyRequest = {
                orderID: orderId,
                status: type
            }
            console.log('bodyRequest: ', bodyRequest);
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest, __getToken());
            if (response.status === 200) {
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
    }

    const __handleOpenReportDialog = () => {
        console.log('open');
        setIsOpenReportOrderCanceledDialog(true);
    }

    /**
     * Handle cancel order click
     */
    const _handleCancelOrder = async (orderDetail: any) => {
        setIsLoading(true)
        try {
            const bodyRequest = {
                orderID: orderDetail?.orderID,
                status: 'CANCEL'
            }
            console.log('bodyRequest: ', bodyRequest);
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest, __getToken());
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

    const __handleRejectOrder = async (orderDetail: any) => {
        setIsLoading(true)
        try {
            const bodyRequest = {
                orderID: orderDetail?.orderID,
                status: 'CANCEL'
            }
            console.log('bodyRequest: ', bodyRequest);
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest, __getToken());
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
    }

    return (
        <div className="bg-white mb-8 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:shadow-xl">
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
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
                                <p style={{ fontSize: "13px" }}>
                                    <FaImage className="inline-block mr-1" />
                                    No image available
                                </p>
                            )}
                        </div>
                        <div className="ml-4 mt-10">
                            <p className="text-gray-600 mb-2 text-sm">
                                <FaFileAlt className="inline-block mr-1" />
                                <span style={{ fontWeight: "bolder" }}>Order ID:</span> {order.orderID}
                            </p>
                            <p className="text-gray-600 mb-2 text-sm">
                                <FaBox className="inline-block mr-1" />
                                <span style={{ fontWeight: "bolder" }}>Order Status: </span> <span className={`mb-2 ${getStatusColor(order.orderStatus)} font-bold`}>{order.orderStatus}</span>
                            </p>
                            <div className="mt-4">
                                {order.detailList.map((detail, index) => (
                                    <p key={index} className="text-gray-600 text-sm">
                                        {/* <FaBox className="inline-block mr-1" /> */}
                                        <span style={{ fontWeight: "bolder" }}> Size: </span>{detail.size.sizeName}: <span style={{ fontWeight: "bolder" }}>Quantity: </span> {detail.quantity}
                                    </p>
                                ))}
                            </div>
                            {order.totalPrice > 0 && (
                                <p className="text-gray-700 mt-4 text-sm">
                                    {/* <FaBox className="inline-block mr-1" /> */}
                                    Price: {__handleAddCommasToNumber(order.totalPrice)} VND
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-1/2 mt-10">
                    <p className="text-gray-600 mb-2 text-sm">
                        <FaUser className="inline-block mr-1" />
                        <span style={{ fontWeight: "bolder" }}>Customer: </span>{order.buyerName}
                    </p>
                    <p className="text-gray-600 mb-2 text-sm">
                        <FaCalendarAlt className="inline-block mr-1" />
                        <span style={{ fontWeight: "bolder" }}>Date: </span>{order.createDate}
                    </p>
                    <p className="text-gray-600 mb-2 text-sm">
                        <FaMapMarkerAlt className="inline-block mr-1" />
                        <span style={{ fontWeight: "bolder" }}>Address:</span> {order.address}, {order.ward}, {order.district}, {order.province}
                    </p>
                    <p style={{ fontWeight: "500", color: secondaryColor, cursor: 'pointer' }} onClick={() => setSelectedOrderMaterial(order.orderID)}>
                        {/* <FaEye className="inline-block mr-1" /> */}
                        View material
                    </p>

                    {selectedOrderMaterial === order.orderID && (
                        <Dialog open={true} aria-labelledby="popup-dialog-title" maxWidth="lg" fullWidth onClose={() => setSelectedOrderMaterial(null)}>
                            <DialogTitle id="popup-dialog-title">
                                Material detail
                                <IoMdCloseCircleOutline
                                    cursor="pointer"
                                    size={20}
                                    color={redColor}
                                    onClick={() => setSelectedOrderMaterial(null)}
                                    style={{ position: 'absolute', right: 20, top: 20 }}
                                />
                            </DialogTitle>
                            <DialogContent>
                                <div>
                                    <MaterialDetailTableComponent materialDetailData={designDetails?.materialDetail}></MaterialDetailTableComponent>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <div className="mt-0 flex items-center pb-5" onClick={() => setShowDesignDetails(!showDesignDetails)}>
                    <span style={{ fontSize: 14, fontWeight: "bold", marginLeft: 20 }}>Show Design Details</span>
                    <ArrowDropDown
                        className="cursor-pointer mr-2"
                    />
                </div>
                {showDesignDetails && (
                    <DesignDetails design={designDetails} />
                )}
                <div className="mt-6 flex justify-end mb-2" style={{ position: 'absolute', bottom: 0, right: 10 }}>

                    {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCEL' && order.orderStatus !== 'NOT_VERIFY' && (

                        <button
                            onClick={() => __handleOpenReportDialog()}
                            className="bg-indigo-500 text-sm text-white px-4 py-2  hover:bg-indigo-600 transition duration-300 mr-4 mb-2"
                            style={{
                                borderRadius: 4,
                                backgroundColor: redColor
                            }}
                        >
                            Cancel
                        </button>
                    )}

                    <CustomerReportOrderDialogComponent
                        isCancelOrder={true}
                        orderID={order?.orderID}
                        onClose={() => setIsOpenReportOrderCanceledDialog(false)}
                        isOpen={isOpenReportOrderCanceledDialog}
                        onClickReportAndCancel={() => _handleCancelOrder(order)}
                    ></CustomerReportOrderDialogComponent>

                    <button
                        onClick={() => __handleOpenInputSampleProductDialog(order.orderID)}
                        className="mb-2 bg-indigo-500 text-sm text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-300 mr-4"
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
                        className="mb-2 bg-indigo-500 text-sm text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-300 mr-4"
                        style={{
                            borderRadius: 4,
                            backgroundColor: secondaryColor
                        }}
                    >
                        View details
                    </button>

                    {order.orderStatus === 'NOT_VERIFY' && (
                        <button
                            onClick={() => __handleRejectOrder(order.orderID)}
                            className="mb-2 bg-indigo-500 text-sm text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-300 mr-4"
                            style={{
                                borderRadius: 4,
                                backgroundColor: redColor
                            }}
                        >
                            Reject order
                        </button>
                    )}

                    {order.orderStatus === 'NOT_VERIFY' && (
                        <button
                            onClick={() => onUpdatedOrderPending(order.orderID)}
                            className="bg-green-500 text-sm text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 mr-4 mb-2"
                            style={{
                                borderRadius: 4,
                                backgroundColor: greenColor
                            }}
                        >
                            Verify order
                        </button>
                    )}

                    {order.orderStatus === 'FINAL_CHECKING' && (
                        <>
                            <button
                                onClick={() => setIsOpenFinalCheckingOrderDialog(true)}
                                className="mb-2 bg-green-500 text-sm text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 mr-4"
                                style={{
                                    borderRadius: 4,
                                    backgroundColor: primaryColor
                                }}
                            >
                                Upload final products
                            </button>

                            <FinalCheckingProductsDialogComponent onClose={() => setIsOpenFinalCheckingOrderDialog(false)} isOpen={isOpenFinalCheckingOrderDialog} order={order} orderID={order.orderID}></FinalCheckingProductsDialogComponent>

                            <button
                                onClick={() => __handleUpdateOrderDelivery(order.orderID, 'DELIVERED')}
                                className="mb-2 bg-green-500 text-sm text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 mr-4"
                                style={{
                                    borderRadius: 4,
                                    backgroundColor: greenColor
                                }}
                            >
                                Delivery
                            </button>
                        </>
                    )}

                    {order.orderStatus === 'COMPLETED' && (

                        <button
                            onClick={() => __handleUpdateOrderDelivery(order.orderID, 'FINAL_CHECKING')}
                            className="mb-2 bg-green-500 text-sm text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 mr-4"
                            style={{
                                borderRadius: 4,
                                backgroundColor: redColor
                            }}
                        >
                            Final check
                        </button>
                    )}
                </div>
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
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            case 'PENDING': return yellowColor;
            case 'START_PRODUCING': return secondaryColor;
            case 'PROCESSING': return 'text-orange-600';
            case 'CANCEL': return redColor;
            case 'COMPLETED': return greenColor;
            case 'FINISH_FIRST_STAGE': return primaryColor;
            case 'FINISH_SECOND_STAGE': return primaryColor;
            default: return blackColor;
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
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getAllSubOrder}/${orderId}`, null, __getToken());
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
        setIsLoading(true)
        try {
            const bodyRequest = {
                orderID: orderDetail?.orderID,
                status: 'CANCEL'
            }
            console.log('bodyRequest: ', bodyRequest);
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest, __getToken());
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
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
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
                        <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-6" style={{ position: 'relative' }}>
                            <div>
                                <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                    Sub ID: <span className="text-sm text-gray-500 pb-2"> {order.orderID}</span>
                                </p>
                                <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                    Type: <span className="text-sm text-blue-700 pb-2"> {order.orderType}</span>
                                </p>
                                <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                    Brand ID: <span className="text-sm text-gray-500 pb-2">{order.brand?.brandID}</span>
                                </p>
                                <p style={{ fontWeight: '500' }} className="text-sm text-black flex content-center items-center">
                                    Brand:
                                    <span className="flex content-center items-center">
                                        <img src={order.brand?.user.imageUrl} style={{ width: 30, height: 30, borderRadius: 90, marginLeft: 5, marginRight: 5 }} alt="Brand" />
                                        <span className={`${__handlegetRatingStyle(order.brand?.rating)} text-sm text-gray-500`}> {order.brand?.brandName}</span>
                                    </span>
                                </p>
                                <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                    Rating: <span className="text-sm text-gray-500 pb-2">{order.brand?.rating?.toFixed(2)}</span>
                                </p>

                                <p style={{ fontWeight: '500' }} className="text-sm text-black pb-0">
                                    Details:
                                    {order.detailList?.map((detail, index) => (
                                        <div key={index} className="ml-0 grid grid-cols-2 gap-x-10 pt-0">
                                            <p className="text-sm text-gray-500 pb-2">Size: {detail.size?.sizeName}</p>
                                            <p className="text-sm text-gray-500 pb-2">Quantity: {detail.quantity}</p>
                                        </div>
                                    ))}
                                </p>
                            </div>

                            <div>
                                <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                    Total price: <span className="text-sm text-gray-500 pb-2"> {__handleAddCommasToNumber(order.totalPrice)} VND</span>
                                </p>
                                <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                    Expected start at: <span className="text-sm text-gray-500 pb-2"> {order.expectedStartDate}</span>
                                </p>
                                <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                    Expected complete at: <span className={`text-sm pb-2 ${__handleGetDateTimeColor(order.expectedProductCompletionDate)}`}> {order.expectedProductCompletionDate}</span>
                                </p>
                                <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2 flex content-center items-center">
                                    Status:
                                    <button className={`py-1 px-3 rounded-full ml-2 text-white`} style={{ backgroundColor: getStatusColorOfSubOrder(order.orderStatus) }}>
                                        {order.orderStatus}
                                    </button>
                                </p>
                            </div>

                        </div>

                        {order.orderStatus !== 'COMPLETED' && (
                            <>
                                <button
                                    onClick={() => __handleOpenReportDialog()}
                                    className="px-3 py-2 text-white rounded-md hover:bg-red-700 transition duration-200 mr-4"
                                    style={{ backgroundColor: redColor, position: 'absolute', bottom: 10, right: 0, fontSize: 12 }}
                                >
                                    Cancel brand
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
 * @param param0 
 * @returns 
 * Order Table
 */
interface OrderTableProps {
    orders: EmployeeOrderTable[];
    onViewDetails: (order: EmployeeOrderTable, design: any) => void;
    onUpdatedOrderPending: (orderID: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onViewDetails, onUpdatedOrderPending }) => {
    const [showDesignDetails, setShowDesignDetails] = useState(false);
    const [designDetails, setDesignDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userAuth, setUseAuth] = useState<UserInterface>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);
    const [isOpenReportOrderCanceledDialog, setIsOpenReportOrderCanceledDialog] = useState<boolean>(false);
    const [openActions, setOpenActions] = useState<string | null>(null);

    useEffect(() => {
        const userStorage = Cookies.get('userAuth');
        if (!userStorage) return;
        const userParse: UserInterface = JSON.parse(userStorage);
        setUseAuth(userParse);
    }, []);

    const fetchDesignDetails = async (orderID: string) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseURL + versionEndpoints.v1 + featuresEndpoints.designDetail + functionEndpoints.designDetail.getAllInforOrderDetail + `/${orderID}`}`);
            setDesignDetails(response.data.data.design);
            onViewDetails(orders.find(order => order.orderID === orderID)!, response.data.data.design);
        } catch (error) {
            console.error('Error fetching design details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const __handleOpenInputSampleProductDialog = (orderID: string) => {
        setSelectedOrderID(orderID);
        setIsDialogOpen(true);
    };

    const __handleCloseInputSampleProductDialog = () => {
        setIsDialogOpen(false);
        setSelectedOrderID(null);
    };

    const __handleUpdateOrderDelivery = async (orderID: string) => {
        setIsLoading(true);
        try {
            const bodyRequest = { orderID, status: 'DELIVERED' };
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest, __getToken());
            if (response.status === 200) {
                toast.success(`${response.data.message}`, { autoClose: 4000 });
                onUpdatedOrderPending(orderID);
            } else {
                toast.error(`${response.data.message}`, { autoClose: 4000 });
            }
        } catch (error) {
            toast.error(`${error}`, { autoClose: 4000 });
        } finally {
            setIsLoading(false);
        }
    };

    const __handleOpenReportDialog = (orderId: string) => {
        setIsOpenReportOrderCanceledDialog(true);
    };

    const _handleCancelOrder = async (orderID: string) => {
        setIsLoading(true);
        try {
            const bodyRequest = { orderID, status: 'CANCEL' };
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest, __getToken());
            if (response.status === 200) {
                toast.success(`${response.data.message}`, { autoClose: 4000 });
                onUpdatedOrderPending(orderID);
            } else {
                toast.error(`${response.data.message}`, { autoClose: 4000 });
            }
        } catch (error) {
            toast.error(`${error}`, { autoClose: 4000 });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCEL':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const toggleActions = (orderID: string) => {
        if (openActions === orderID) {
            setOpenActions(null);
        } else {
            setOpenActions(orderID);
        }
    };

    const columns: GridColDef[] = [
        { field: 'orderID', headerName: 'Order ID', width: 150 },
        { field: 'buyerName', headerName: 'Customer', width: 150 },
        { field: 'address', headerName: 'Address', width: 150 },
        { field: 'province', headerName: 'Province', width: 150 },
        { field: 'phone', headerName: 'phone', width: 150 },
        { field: 'expectedStartDate', headerName: 'Date', width: 200 },
        {
            field: 'orderStatus',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                <Box
                    sx={{
                        backgroundColor:
                            params.value === "PENDING"
                                ? pendingColor
                                : params.value === "DELIVERED"
                                    ? deliveredColor
                                    : params.value === "DEPOSIT"
                                        ? deposisColor
                                        : params.value === "PROCESSING"
                                            ? processingColor
                                            : params.value === "COMPLETED"
                                                ? completeColor
                                                : cancelColor,
                        color: params.value === "PENDING"
                            ? pendingColorText
                            : params.value === "DELIVERED"
                                ? deliveredColorText
                                : params.value === "DEPOSIT"
                                    ? deposisColorText
                                    : params.value === "PROCESSING"
                                        ? processingColorText
                                        : params.value === "COMPLETED"
                                            ? completeColorText
                                            : cancelColorText,
                        borderRadius: '16px',
                        padding: '1px 5px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        height: "50%",
                        marginTop: "10%"
                    }}
                >
                    <Box
                        sx={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                        }}
                    />
                    {params.value}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <div>
                    <button
                        onClick={() => toggleActions(params.row.orderID)}
                        className="font-medium text-green-600 "
                    >
                        More <ArrowDropDown />
                    </button>
                    {openActions === params.row.orderID && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <Tooltip title="View Details">
                                <IconButton onClick={() => onViewDetails(params.row, null)} style={{ color: 'blue' }}>
                                    <Visibility />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="View Sample Data">
                                <IconButton onClick={() => __handleOpenInputSampleProductDialog(params.row.orderID)} style={{ color: 'green' }}>
                                    <ViewAgendaOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Verify Order">
                                <IconButton onClick={() => onUpdatedOrderPending(params.row.orderID)} style={{ color: 'orange' }}>
                                    <Verified />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <IconButton onClick={() => __handleOpenReportDialog(params.row.orderID)} style={{ color: 'red' }}>
                                    <Cancel />
                                </IconButton>
                            </Tooltip>
                        </div>
                    )}
                </div>
            )
        }
    ];

    const getRowId = (row: any) => `${row.orderID}`;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <>
            <div className="overflow-x-auto shadow-md sm:rounded-lg -mt-6">
                <Box
                    sx={{
                        height: "75vh",  // Adjust height as needed
                        width: '100%',  // Adjust width as needed
                        '& .MuiDataGrid-row:nth-of-type(odd)': {
                            backgroundColor: '#D7E7FF !important',  // Change background color to blue for odd rows
                        },
                        '& .MuiDataGrid-row:nth-of-type(even)': {
                            backgroundColor: '#FFFFFF !important',  // Change background color to red for even rows
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bolder',  // Make header text bolder
                        },
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .name-column--cell": {
                            color: colors.primary[300],
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: colors.primary[300],
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: colors.primary[100],
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "none",
                            backgroundColor: colors.primary[100],
                        },
                        "& .MuiCheckbox-root": {
                            color: `${colors.primary[100]} !important`,
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `${colors.primary[200]} !important`,
                        },
                        "& .MuiBadge-badge": {
                            display: "none !important"
                        }
                    }}
                >
                    <DataGrid
                        rows={orders}
                        columns={columns}
                        slots={{ toolbar: GridToolbar }}
                        getRowId={getRowId}
                    />
                </Box>
            </div>
            <ViewSampleUpdateDialog
                isOpen={isDialogOpen}
                orderID={selectedOrderID!}
                brandID={userAuth?.userID}
                onClose={__handleCloseInputSampleProductDialog}
            />
            <CustomerReportOrderDialogComponent
                isCancelOrder={true}
                orderID={selectedOrderID!}
                onClose={() => setIsOpenReportOrderCanceledDialog(false)}
                isOpen={isOpenReportOrderCanceledDialog}
                onClickReportAndCancel={async () => {
                    await _handleCancelOrder(selectedOrderID!);
                    setIsOpenReportOrderCanceledDialog(false);
                }}
            />
        </>
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
    // const [filters, setFilters] = useState({
    //     selectedFilter: 'date',
    //     date: '',
    //     status: '',
    //     name: '',
    //     orderStatus: '',
    //     orderID: '',
    // });
    const [selectedOrder, setSelectedOrder] = useState<EmployeeOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [goToPage, setGoToPage] = useState('1');
    const [designDetails, setDesignDetails] = useState<any>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [filters, setFilters] = useState({
        orderID: '',
        createDate: '',
        status: ''
    });
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const filterOptions = [
        { value: 'Date', label: 'Date' },
        { value: 'Order ID', label: 'Order ID' },
        { value: 'Order Status', label: 'Order Status' }
    ];

    const [pendingCount, setPendingCount] = useState<number>(0);
    const [canceledCount, setCanceledCount] = useState<number>(0);
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [checkingSampleDataCount, setCheckingSampleDataCount] = useState<number>(0);


    useEffect(() => {
        const apiUrl = `${baseURL}${versionEndpoints.v1}${featuresEndpoints.order}${functionEndpoints.order.getAllOrder}`;
        setIsLoading(true);
        axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${__getToken()}`,  // Add the Bearer token here
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    const subOrders = responseData.data.filter((order: any) => order.orderType === FILTERED_ORDER_TYPE);
                    const filteredPendingOrders = subOrders.filter((order: any) => order.orderStatus === 'PROCESSING');
                    const filteredCanceledOrders = subOrders.filter((order: any) => order.orderStatus === 'CANCEL');
                    const filteredCompletedOrders = subOrders.filter((order: any) => order.orderStatus === 'COMPLETED');
                    const filteredCheckingSampleDataOrders = subOrders.filter((order: any) => order.orderStatus === 'NOT_VERIFY');
                    setPendingCount(filteredPendingOrders.length);
                    setCanceledCount(filteredCanceledOrders.length);
                    setCompletedCount(filteredCompletedOrders.length);
                    setCheckingSampleDataCount(filteredCheckingSampleDataOrders.length);
                    setOrder(subOrders);
                    setFilteredOrders(subOrders); // Add this line
                    console.log("Data received:", subOrders);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const filtered = order.filter(applyFilters);
        setFilteredOrders(filtered);
    }, [filters, order]);

    const handleUpdateOrder = async (orderID: string) => {
        try {
            setIsLoading(true);
            console.log("order id" + orderID);

            const response = await api.put(
                `${baseURL}${versionEndpoints.v1}${featuresEndpoints.order}${functionEndpoints.order.changeOrderStatus}`,
                {
                    orderID: orderID,
                    status: "PENDING"
                },
                __getToken()
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

    /**
   * 
   * @param event 
   * Filter With the select 
  */
    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };


    /**
     * 
     * @param orderDetail 
     * @returns 
     * Apply the filter to the render with card
     */
    const applyFilters = (orderDetail: EmployeeOrder) => {
        return (
            (filters.orderID === '' || orderDetail.orderID.includes(filters.orderID)) &&
            (filters.createDate === '' || (orderDetail.expectedStartDate?.includes(filters.createDate) ?? false)) &&
            (filters.status === '' || orderDetail.orderStatus === filters.status)
        );
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

    const [isTableView, setIsTableView] = useState(false);

    const toggleView = () => {
        setIsTableView(!isTableView);
    };

    return (
        <div className='-mt-8'>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <LoadingComponent isLoading={isLoading} />
                </div>
            ) : (
                <>
                    <div style={{ width: "100%" }}>
                        <div className="flex flex-col">
                            <div className="mt-12">
                                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                                <path d="M19.14 12.936c.046-.306.071-.618.071-.936s-.025-.63-.071-.936l2.037-1.582a.646.646 0 00.154-.809l-1.928-3.338a.646.646 0 00-.785-.293l-2.4.964a7.826 7.826 0 00-1.617-.936l-.364-2.558A.645.645 0 0013.629 3h-3.258a.645.645 0 00-.635.538l-.364 2.558a7.82 7.82 0 00-1.617.936l-2.4-.964a.646.646 0 00-.785.293L2.642 9.673a.646.646 0 00.154.809l2.037 1.582a7.43 7.43 0 000 1.872l-2.037 1.582a.646.646 0 00-.154.809l1.928 3.338c.169.293.537.42.785.293l2.4-.964c.506.375 1.05.689 1.617.936l.364 2.558a.645.645 0 00.635.538h3.258a.645.645 0 00.635-.538l.364-2.558a7.82 7.82 0 001.617-.936l2.4.964c.248.127.616 0 .785-.293l1.928-3.338a.646.646 0 00-.154-.809l-2.037-1.582zM12 15.3A3.3 3.3 0 1112 8.7a3.3 3.3 0 010 6.6z" />
                                            </svg>
                                        </div>
                                        <div className="p-4 text-right">
                                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: secondaryColor, fontWeight: 'bold' }}>PROCESSING</p>
                                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{pendingCount}</h4>
                                        </div>

                                    </div>
                                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.95 6.05a.75.75 0 010 1.06L13.06 12l3.89 3.89a.75.75 0 11-1.06 1.06L12 13.06l-3.89 3.89a.75.75 0 11-1.06-1.06L10.94 12 7.05 8.11a.75.75 0 011.06-1.06L12 10.94l3.89-3.89a.75.75 0 011.06 0z" />
                                            </svg>

                                        </div>
                                        <div className="p-4 text-right">
                                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: redColor, fontWeight: 'bold' }}>CANCEL</p>
                                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{canceledCount}</h4>
                                        </div>

                                    </div>
                                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.59 14.59l-4.24-4.24 1.41-1.41L10.41 14l7.42-7.42 1.41 1.41-8.83 8.83z" />
                                            </svg>
                                        </div>
                                        <div className="p-4 text-right">
                                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: greenColor, fontWeight: 'bold' }}>COMPLETED</p>
                                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{completedCount}</h4>
                                        </div>

                                    </div>
                                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.59 14.59l-4.24-4.24 1.41-1.41L10.41 14l7.42-7.42 1.41 1.41-8.83 8.83z" />
                                            </svg>
                                        </div>
                                        <div className="p-4 text-right">
                                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: primaryColor, fontWeight: 'bold' }}>NOT VERIFY</p>
                                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{checkingSampleDataCount}</h4>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="mb-0">
                                <div className="flex mt-0">
                                    <div className="w-7/10" style={{ width: "60%" }}>
                                        <Select
                                            isMulti
                                            name="filters"
                                            options={filterOptions}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={filterOptions.filter(option => selectedFilters.includes(option.value))}
                                            onChange={(selectedOptions: any) => {
                                                setSelectedFilters(selectedOptions.map((option: any) => option.value));
                                            }}
                                        />
                                    </div>
                                    <div className="flex border border-gray-300 rounded-md overflow-hidden" style={{ marginLeft: "auto" }}>
                                        <button
                                            className={`px-2 py-1 text-sm ${!isTableView ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
                                            onClick={() => setIsTableView(false)}
                                        >
                                            List mode
                                        </button>
                                        <button
                                            className={`px-2 py-1 text-sm ${isTableView ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
                                            onClick={() => setIsTableView(true)}
                                        >
                                            Table mode
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {selectedFilters.includes('Date') && (
                                    <div className="filter-item">
                                        <label htmlFor="dateFilter" className="block mb-2 text-sm font-medium text-gray-700">Date</label>
                                        <input
                                            type="date"
                                            id="dateFilter"
                                            name="createDate"
                                            value={filters.createDate}
                                            onChange={handleFilterChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                        />
                                    </div>
                                )}

                                {selectedFilters.includes('Order ID') && (
                                    <div className="filter-item">
                                        <label htmlFor="orderIdFilter" className="block mb-2 text-sm font-medium text-gray-700">Order ID</label>
                                        <input
                                            type="text"
                                            id="orderIdFilter"
                                            name="orderID"
                                            value={filters.orderID}
                                            onChange={handleFilterChange}
                                            placeholder="Enter Order ID"
                                            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                        />
                                    </div>
                                )}

                                {selectedFilters.includes('Order Status') && (
                                    <div className="filter-item">
                                        <label htmlFor="statusFilter" className="block mb-2 text-sm font-medium text-gray-700">Order Status</label>
                                        <select
                                            id="statusFilter"
                                            name="status"
                                            value={filters.status}
                                            onChange={handleFilterChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
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

                        </div>
                    </div>

                    {isTableView ? (
                        <OrderTable
                            orders={currentOrders}
                            onViewDetails={handleViewDetails}
                            onUpdatedOrderPending={handleUpdateOrder}
                        />
                    ) : (
                        <div>
                            {currentOrders.map(order => (
                                <EmployeeOrderFields
                                    key={order.orderID}
                                    order={order}
                                    onViewDetails={handleViewDetails}
                                    onUpdatedOrderPending={handleUpdateOrder}
                                />
                            ))}
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
                        </div>
                    )}

                    {isModalOpen && selectedOrder && (
                        <EmployeeOrderModal
                            designDetails={designDetails}
                            order={selectedOrder}
                            onClose={handleCloseModal}
                            onUpdatedOrderPending={handleMarkResolved}
                        />
                    )}
                </>
            )
            }
        </div >
    );
};

export default EmployeeManageOrder;