import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendar, FaClipboardCheck, FaExclamationCircle, FaChevronLeft, FaChevronRight, FaTimes, FaCheck } from 'react-icons/fa';
import { ArrowDropDown } from '@mui/icons-material';
import axios from 'axios';
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { BrandOrder, ImageList } from '../../../../models/BrandManageOrderModel';
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { greenColor, primaryColor, secondaryColor, yellowColor } from '../../../../root/ColorSystem';
import PartOfDesignInformationDialogComponent from '../../BrandOrderManagement/PartOfDesignInformationDialogComponent';
import LoadingComponent from '../../../../components/Loading/LoadingComponent';
import Cookies from 'js-cookie';
import { UserInterface } from '../../../../models/UserModel';
import BrandUpdateSampleProductDialog from '../../GlobalComponent/Dialog/UpdateSampleProduct/BrandUpdateSampleProductDialog';
import { __handleAddCommasToNumber } from '../../../../utils/NumbericUtils';
import BrandUploadProgcessSampleProduct from '../../GlobalComponent/Dialog/UploadProgcessSampleProduct/BrandUploadProgcessSampleProduct';
import { StageInterface } from '../../../../models/OrderModel';

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
 * Progress Step
 */
const progressSteps = [
    'PENDING',
    'START_PRODUCING',
    'FINISH_FIRST_STAGE',
    'FINISH_SECOND_STAGE',
    'COMPLETED'
]


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
                            <img
                                src={part.successImageUrl || '/placeholder-image.png'}
                                alt={part.partOfDesignName}
                                className="w-full h-auto object-contain rounded-lg shadow-md"
                            />
                        </div>
                        <div className="w-1/2 pl-4">
                            <h3 className="text-2xl font-bold mb-4 text-indigo-700">Item Masks</h3>
                            <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                                {part?.itemMasks && part.itemMasks.map((mask: any, index: any) => (
                                    <div key={index} className="mb-6 last:mb-0 bg-white p-4 rounded-md shadow-sm">
                                        <div className="flex items-center mb-4">
                                            {mask.imageUrl && (
                                                <img
                                                    src={mask.imageUrl}
                                                    alt="Mask Image"
                                                    className="w-20 h-24 object-cover rounded-md mr-4"
                                                />
                                            )}
                                            <h4 className="text-lg font-semibold text-gray-800">{mask.itemMaskName}</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <p><span className="font-medium text-gray-600">Type:</span> {mask.typeOfItem}</p>
                                            <p><span className="font-medium text-gray-600">Position:</span> X: {mask.positionX}, Y: {mask.positionY}</p>
                                            <p><span className="font-medium text-gray-600">Scale:</span> X: {mask.scaleX}, Y: {mask.scaleY}</p>
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
                        <p className=" text-sm font-medium">Part name: {part.partOfDesignName}</p>
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
const BrandOrderFields: React.FC<{
    order: BrandOrder;
    onViewDetails: (order: BrandOrder, design: any) => void;
    onMarkResolved: (orderID: string) => void;
}> = ({ order, onViewDetails, onMarkResolved }) => {
    const navigate = useNavigate();
    const [showDesignDetails, setShowDesignDetails] = useState(false);
    const [designDetails, setDesignDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openOrderDetail, setOpenOrderDetail] = useState<BrandOrder | null>(null);
    const [userAuth, setUseAuth] = useState<UserInterface>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);
    const [isUploadSampleDialogOpen, setIsUploadSampleDialogOpen] = useState(false);
    const [selectedStep, setSelectedStep] = useState<{ orderID: string, step: string } | null>(null);
    const [progressSteps, setProgressStep] = useState<StageInterface[]>();
    const [stageIdStart, setStageIdStart] = useState<string>();

    const customSortOrder = [
        'START_PRODUCING',
        'FINISH_FIRST_STAGE',
        'FINISH_SECOND_STAGE',
        'COMPLETED'
    ];

    const sortStages = (stages: StageInterface[]) => {
        return stages.sort((a, b) => {
            const indexA = customSortOrder.indexOf(a.stage);
            const indexB = customSortOrder.indexOf(b.stage);
            return indexA - indexB;
        });
    };


    useEffect(() => {
        const userStorage = Cookies.get('userAuth');
        if (!userStorage) return;
        const userParse: UserInterface = JSON.parse(userStorage)
        setUseAuth(userParse);
    }, []);

    const __handleLoadProgressStep = async (subOrderId: any) => {
        setIsLoading(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderStageById}/${subOrderId}`);
            if (response.status === 200) {
                setIsLoading(false);
                const sortedData = sortStages(response.data);
                setProgressStep(sortedData);
            }
            else {
                console.log('detail error: ', response.message);
                toast.error(`${response.message}`, { autoClose: 4000 });
            }
        } catch (error) {
            console.log('error: ', error);
            toast.error(`${error}`, { autoClose: 4000 });
            navigate('/error404');
        }

    }

    const __handleOpenUpdateProcessDialog = (orderDetail: BrandOrder) => {
        setOpenOrderDetail(orderDetail);
        __handleLoadProgressStep(orderDetail.orderID)
    };

    const __handleCloseUpdateProcessDialog = () => {
        setOpenOrderDetail(null);
    };

    const __handleOpenUpLoadProcessSampleProductDialog = (orderId: string, step: string) => {
        setIsUploadSampleDialogOpen(true);
        setSelectedStep({ orderID: orderId, step: step });
    };

    const __handleCloseUpLoadProcessSampleProductDialog = () => {
        setIsUploadSampleDialogOpen(false);
        setSelectedStep(null);
    };

    const __handleCalculateProgressWidth = (status: string) => {
        if (!progressSteps || progressSteps.length === 0) return 0;

        const completedIndex = progressSteps.findIndex(step => step.stage === status);

        if (completedIndex === - 1) return 0;

        return ((completedIndex + 1) / progressSteps.length) * 130;
    };

    const __handelUpdateOrderState = async (orderID: any, step: string) => {
        setIsLoading(true);
        try {
            const bodyRequest = {
                orderID: orderID,
                status: step
            }
            console.log('bodyRequest: ', bodyRequest);
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest);
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                setIsLoading(false);
                toast.success(`${response.message}`, { autoClose: 4000 });
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            }
            else {
                console.log('detail error: ', response.message);
                toast.error(`${response.message}`, { autoClose: 4000 });
            }
        } catch (error) {
            console.log('error: ', error);
            toast.error(`${error}`, { autoClose: 4000 });
            navigate('/error404');
        }
    }

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

    const __handleOpenInputSampleProductDialog = async (orderID: any) => {
        setSelectedOrderID(orderID);
        setIsDialogOpen(true);

        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderStageById}/${orderID}`);
            if (response.status === 200) {
                setIsLoading(false);
                const sortedData = sortStages(response.data);
                const stageStart: StageInterface = response.data.find((item: StageInterface) => item.stage === 'START_PRODUCING')
                setStageIdStart(stageStart.stageId)
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
                                        className="mt-2 w-40 h-52 rounded-lg"
                                    />
                                </div>
                            ) : (
                                <p>No image available</p>
                            )}
                        </div>
                        <div className="ml-4 mt-10">
                            <p className="text-sm text-gray-600 mb-2">Order ID: {order.orderID}</p>
                            <p className="text-sm text-gray-600 mb-2">
                                Order Status: <span className={` mb-2 ${getStatusColor(order.orderStatus)} font-bold`}>{order.orderStatus}</span>
                            </p>
                            <div className="mt-4">
                                {order.detailList.map((detail, index) => (
                                    <p key={index} className="text-sm text-gray-600">
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
                <span style={{ fontWeight: "bold", fontSize: 14 }}>Show Design Details</span>
            </div>
            {showDesignDetails && (
                <DesignDetails design={designDetails} />
            )}
            <div className="mt-6 flex justify-end">
                {order.orderStatus === 'CHECKING_SAMPLE_DATA' && (
                    <>
                        <button
                            onClick={() => __handleOpenInputSampleProductDialog(order.orderID)}
                            className="text-sm bg-indigo-500 text-white px-4 py-2  hover:bg-indigo-600 transition duration-300 mr-4"
                            style={{
                                borderRadius: 4,
                                backgroundColor: yellowColor
                            }}
                        >
                            Update sampleData
                        </button>
                        {selectedOrderID === order.orderID && (
                            <BrandUpdateSampleProductDialog stageID={stageIdStart} isOpen={isDialogOpen} orderID={order.orderID} brandID={userAuth?.userID} onClose={__handleCloseInputSampleProductDialog}></BrandUpdateSampleProductDialog>
                        )}
                    </>
                )}



                <button
                    onClick={() => onViewDetails(order, designDetails)}
                    className="bg-indigo-500 text-sm text-white px-4 py-2  hover:bg-indigo-600 transition duration-300 mr-4"
                    style={{
                        borderRadius: 4,
                        backgroundColor: secondaryColor
                    }}
                >
                    View Details
                </button>

                <button
                    onClick={() => __handleOpenUpdateProcessDialog(order)}
                    className="bg-green-500 text-sm text-white px-4 py-2  hover:bg-green-600 transition duration-300"
                    style={{
                        borderRadius: 4,
                        backgroundColor: greenColor
                    }}
                >
                    Update process
                </button>
            </div>

            {/* Progress Bar */}
            {openOrderDetail && openOrderDetail.orderID === order.orderID && (
                <>
                    <Dialog open={true} onClose={__handleCloseUpdateProcessDialog} aria-labelledby="popup-dialog-title" maxWidth="lg" fullWidth>
                        <DialogTitle id="popup-dialog-title">
                            <div style={{ float: 'left', alignItems: 'center', justifyContent: 'center' }}>
                                <span> Order Progress</span>
                                <div className={` inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 ml-2`}>
                                    <span>
                                        Click to complete state
                                    </span>
                                </div>
                            </div>
                        </DialogTitle>
                        <IoMdCloseCircleOutline
                            cursor={'pointer'}
                            size={20}
                            color="red"
                            onClick={__handleCloseUpdateProcessDialog}
                            style={{ position: 'absolute', right: 20, top: 20 }}
                        />
                        <DialogContent dividers>
                            <div className="pt-4 mb-20">
                                <p className="text-sm text-gray-600 mb-2">Progress Date: {order.productionCompletionDate}</p>
                                <div className="flex justify-between text-sm mb-2">
                                    {progressSteps?.map((step, index) => {
                                        // const isCompleted = index < step.indexOf(order.orderStatus) + 1;
                                        // const isCurrent = index === progressSteps.indexOf(step.status) + 1;
                                        const isClickable = index >= 1 && index <= 99;
                                        return (
                                            <p key={index} className={`text-center px-6 py-2 `}>
                                                <p
                                                    className=" flex justify-center items-center px-6 py-2 text-white rounded-md transition duration-200 ml-auto"
                                                    style={{
                                                        color: !step.status ? '#CBCBCB' : secondaryColor
                                                    }}
                                                >
                                                    {step.currentQuantity} / {order.quantity}
                                                </p>
                                                {selectedStep?.orderID === order.orderID && selectedStep.step === step.stage && (
                                                    <BrandUploadProgcessSampleProduct
                                                        step={step.stage}
                                                        orderID={selectedStep?.orderID}
                                                        isOpen={true}
                                                        onClose={__handleCloseUpLoadProcessSampleProductDialog}
                                                    >
                                                    </BrandUploadProgcessSampleProduct>
                                                )}
                                            </p>
                                        );
                                    })}
                                </div>
                                <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
                                    <div className="absolute top-0 left-0 h-2 bg-indigo-600 rounded-full" style={{ width: `${__handleCalculateProgressWidth(order.orderStatus)}%` }}></div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    {progressSteps?.map((step, index) => {
                                        // const isCompleted = index < step.indexOf(order.orderStatus) + 1;
                                        // const isCurrent = index === progressSteps.indexOf(step.status) + 1;
                                        const isClickable = index >= 1 && index <= 99;
                                        return (
                                            <p key={index} className={`text-center `}>
                                                <button
                                                    className=" flex justify-center items-center px-4 py-2 text-white rounded-md transition duration-200 ml-auto"
                                                    style={{
                                                        backgroundColor: step.status ? '#CBCBCB' : secondaryColor
                                                    }}
                                                    onClick={isClickable ? () => __handleOpenUpLoadProcessSampleProductDialog(order.orderID, step.stage) : () => console.log('none')} // Add your click handler here
                                                >
                                                    {step.status && (<FaCheck color={greenColor} style={{ marginRight: 10 }} size={12}></FaCheck>)}
                                                    {step.stage}
                                                </button>
                                                {selectedStep?.orderID === order.orderID && selectedStep.step === step.stage && (
                                                    <BrandUploadProgcessSampleProduct
                                                        brandID={userAuth?.userID}
                                                        step={step.stage}
                                                        stageID={step.stageId}
                                                        orderID={selectedStep?.orderID}
                                                        isOpen={true}
                                                        onClose={__handleCloseUpLoadProcessSampleProductDialog}
                                                    >
                                                    </BrandUploadProgcessSampleProduct>
                                                )}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>


                </>
            )}
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
                className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-150"
                    aria-label="Close modal"
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-xl font-bold text-indigo-700 mb-4 shadow-text">Order Brand Details</h2>

                <div className="flex justify-between items-center mb-4 bg-indigo-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <FaClipboardCheck className="text-indigo-500" size={16} />
                        <span className="font-semibold text-gray-700 text-sm" style={{ fontSize: "13px" }}>Order ID:</span>
                        <p className="text-sm font-bold text-indigo-700" style={{ fontSize: "13px" }}>{order.orderID}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-600 flex items-center mb-1 text-xs">
                                <item.icon className="mr-2 text-indigo-500" size={14} />
                                <span className="font-semibold">{item.label}:</span>
                            </p>
                            <p className={`text-sm font-bold ${item.customClass || 'text-gray-800'}`} style={{ fontSize: "13px" }}>
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-700 mb-2" style={{ fontSize: "13px" }}>Buyer Name</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-inner" style={{ fontSize: "13px" }}>
                        {order.buyerName}
                    </p>
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

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onMarkResolved(order.orderID)}
                        className={`px-4 py-2 rounded-lg text-white transition duration-150 focus:outline-none focus:ring-2 text-sm ${order.orderStatus
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
/**
 * 
 * @returns 
 * Call Api /get-all-order
 * Get all the order of the brand 
 * show all card of the BrandOrderFields
 */
const BrandManageOrder: React.FC = () => {
    const [order, setOrder] = useState<BrandOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<BrandOrder[]>([]);
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
    const [selectedOrder, setSelectedOrder] = useState<BrandOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [goToPage, setGoToPage] = useState('1');
    const [designDetails, setDesignDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const userStorage = Cookies.get('userAuth');
        if (!userStorage) {
            setIsLoading(false);
            return;
        }
        const userParse: UserInterface = JSON.parse(userStorage)
        const apiUrl = `${baseURL}${versionEndpoints.v1}${featuresEndpoints.order}${functionEndpoints.order.getOrderByBrandId}/${userParse.userID}`;
        console.log(apiUrl);
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

    const FILTERED_ORDER_TYPE = "SUB_ORDER";

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

    const handleViewDetails = async (order: BrandOrder) => {
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
                </>
            )}
        </div>
    );
};

export default BrandManageOrder;