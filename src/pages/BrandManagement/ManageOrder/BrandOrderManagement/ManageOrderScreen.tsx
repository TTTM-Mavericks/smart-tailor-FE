import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendar, FaClipboardCheck, FaExclamationCircle, FaChevronLeft, FaChevronRight, FaTimes, FaCheck } from 'react-icons/fa';
import { ArrowDropDown, Cancel, Update, UpdateOutlined, Verified, ViewAgendaOutlined, Visibility } from '@mui/icons-material';
import axios from 'axios';
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { BrandOrder, BrandOrderTable, ImageList } from '../../../../models/BrandManageOrderModel';
import { motion } from 'framer-motion'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, useTheme } from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { greenColor, primaryColor, redColor, secondaryColor, yellowColor } from '../../../../root/ColorSystem';
import PartOfDesignInformationDialogComponent from '../../BrandOrderManagement/PartOfDesignInformationDialogComponent';
import LoadingComponent from '../../../../components/Loading/LoadingComponent';
import Cookies from 'js-cookie';
import { UserInterface } from '../../../../models/UserModel';
import BrandUpdateSampleProductDialog from '../../GlobalComponent/Dialog/UpdateSampleProduct/BrandUpdateSampleProductDialog';
import { __handleAddCommasToNumber } from '../../../../utils/NumbericUtils';
import BrandUploadProgcessSampleProduct from '../../GlobalComponent/Dialog/UploadProgcessSampleProduct/BrandUploadProgcessSampleProduct';
import { StageInterface } from '../../../../models/OrderModel';
import style from './ManageOrderBrandStyle.module.scss'
import { CustomerReportOrderDialogComponent } from '../../../../components';
import { EstimatedStageInterface } from '../../../Order/OrderDetail/OrderDetailScreen';
import Select from 'react-select';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../../../theme';
import { __getToken } from '../../../../App';

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
        case 'PENDING': return 'text-blue-600';
        case 'DEPOSIT': return 'text-blue-600';
        case 'PROCESSING': return 'text-orange-600';
        case 'CANCEL': return 'text-red-600';
        case 'COMPLETED': return 'text-green-600';
        case 'DELIVERED': return 'text-indigo-600';
        case 'START_PRODUCING': return 'text-pink-600';
        case 'CHECKING_SAMPLE_DATA': return 'text-orange-600';

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
    const [isOpenReportOrderCanceledDialog, setIsOpenReportOrderCanceledDialog] = useState<boolean>(false);
    const [timeline, setTimeLine] = useState<EstimatedStageInterface>();


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
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderStageById}/${subOrderId}`, null, __getToken());
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

    const __handleFetchTimeLine = async (parentId: any) => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderTimeLineByParentId}/${parentId}`, null, __getToken());
            if (response.status === 200) {
                setIsLoading(false);
                setTimeLine(response.data);
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
        __handleLoadProgressStep(orderDetail.orderID);
        __handleFetchTimeLine(orderDetail.parentOrderID);
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
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest, __getToken());
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
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderStageById}/${orderID}`, null, __getToken());
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

    useEffect(() => {
        const userStorage = Cookies.get('userAuth');
        if (!userStorage) return;
        const userParse: UserInterface = JSON.parse(userStorage)
        setUseAuth(userParse);
    }, []);

    return (
        <div className="bg-white mb-8 shadow-lg rounded-lg p-6 transition duration-300 ease-in-out transform hover:shadow-xl">
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
                            {order.totalPrice && (
                                <p className="text-gray-700 mt-4 text-sm">Price: {__handleAddCommasToNumber(order.totalPrice)} VND</p>
                            )}
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
                {/* {order.orderStatus === 'CHECKING_SAMPLE_DATA' && (
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
                )} */}

                {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCEL' && (

                    <button
                        onClick={() => __handleOpenReportDialog()}
                        className="bg-indigo-500 text-sm text-white px-4 py-2  hover:bg-indigo-600 transition duration-300 mr-4"
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
                    onClick={() => onViewDetails(order, designDetails)}
                    className="bg-indigo-500 text-sm text-white px-4 py-2  hover:bg-indigo-600 transition duration-300 mr-4"
                    style={{
                        borderRadius: 4,
                        backgroundColor: secondaryColor
                    }}
                >
                    View Details
                </button>

                {order.orderStatus !== 'CANCEL' && order.orderStatus !== 'COMPLETED' && (
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
                )}
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

                                <div className="flex justify-between text-sm mb-0 ml-0">
                                    <p className='flex'>
                                        <span>ET: </span>
                                        <span className={`text-indigo-600 ml-1`}>
                                            dd-mm-yyy 00:00:00
                                        </span>
                                    </p>
                                    <p className='flex'>
                                        <span>ET: </span>
                                        <span className={`text-indigo-600 ml-1`}>
                                            {timeline?.estimatedDateFinishFirstStage}
                                        </span>
                                    </p>
                                    <p className='flex'>
                                        <span>ET: </span>
                                        <span className={`text-indigo-600 ml-1`}>
                                            {timeline?.estimatedDateFinishSecondStage}
                                        </span >
                                    </p>
                                    <p className='flex'>
                                        <span>ET: </span>
                                        <span className={`text-indigo-600 ml-1`}>
                                            {timeline?.estimatedDateFinishCompleteStage}
                                        </span>
                                    </p>


                                </div>
                                <div className="flex justify-between text-sm mb-0 ml-0">
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
                                                        orderDetail={order}
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
                                        const isClickable = !step.status;
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
                                                        orderDetail={order}
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
            className={`${style.custom__scrollbar} fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50`}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className={`${style.custom__scrollbar}relative bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto`}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-150"
                    aria-label="Close modal"
                >
                    <FaTimes size={20} />
                </button>

                <div className={`${style.employeeManagerOrderDialog__content}`}>

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
                </div>
                {
                    designDetails && (
                        <div className="mb-6 flex justify-center">
                            <div className="text-center">
                                <img
                                    src={designDetails.imageUrl}
                                    alt="Model"
                                    className="max-w-full h-auto rounded-lg"
                                />
                            </div>

                        </div>)}

                {
                    isOrderImageListArray(order.orderImageList) && order.orderImageList.length > 0 && (
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
                                )}
                            </div>
                        </div>
                    )}
            </motion.div>
        </motion.div >
    );
};

/**
 * 
 * @param param0 
 * @returns 
 * Order Table
 */
interface OrderTableProps {
    orders: BrandOrderTable[];
    onViewDetails: (order: BrandOrderTable, design: any) => void;
    onUpdatedOrderPending: (orderID: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onViewDetails, onUpdatedOrderPending }) => {
    const [openActions, setOpenActions] = useState<string | null>(null);
    const [designDetails, setDesignDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenReportOrderCanceledDialog, setIsOpenReportOrderCanceledDialog] = useState<boolean>(false);
    const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [stageIdStart, setStageIdStart] = useState<string>();
    const [userAuth, setUseAuth] = useState<UserInterface>();
    const [openOrderDetail, setOpenOrderDetail] = useState<BrandOrderTable | null>(null);
    const [progressSteps, setProgressStep] = useState<StageInterface[]>();
    const navigate = useNavigate();
    const [timeline, setTimeLine] = useState<EstimatedStageInterface>();
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

    const fetchDesignDetails = async (orderID: string) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseURL + versionEndpoints.v1 + featuresEndpoints.designDetail + functionEndpoints.designDetail.getAllInforOrderDetail + `/${orderID}`}`);
            setDesignDetails(response.data.data.design);
        } catch (error) {
            console.error('Error fetching design details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchDesignDetails();
    // }, [orders.orderID]);

    const toggleActions = (orderID: string) => {
        if (openActions === orderID) {
            setOpenActions(null);
        } else {
            setOpenActions(orderID);
        }
    };

    const __handleOpenReportDialog = () => {
        console.log('open');
        setIsOpenReportOrderCanceledDialog(true);
    }

    /**
     * Handle cancel order click
     */
    const _handleCancelOrder = async (orderID: any) => {
        setIsLoading(true)
        try {
            const bodyRequest = {
                orderID: orderID,
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

    const __handleOpenInputSampleProductDialog = async (orderID: any) => {
        setSelectedOrderID(orderID);
        setIsDialogOpen(true);

        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderStageById}/${orderID}`, null, __getToken());
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

    const __handleLoadProgressStep = async (subOrderId: any) => {
        setIsLoading(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderStageById}/${subOrderId}`, null, __getToken());
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
    const __handleFetchTimeLine = async (parentId: any) => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderTimeLineByParentId}/${parentId}`, null, __getToken());
            if (response.status === 200) {
                setIsLoading(false);
                setTimeLine(response.data);
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

    const __handleOpenUpdateProcessDialog = (orderDetail: BrandOrderTable) => {
        setOpenOrderDetail(orderDetail);
        __handleLoadProgressStep(orderDetail.orderID);
        __handleFetchTimeLine(orderDetail.parentOrderID);
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

    const columns: GridColDef[] = [
        { field: 'orderID', headerName: 'Order ID', width: 150 },
        { field: 'buyerName', headerName: 'Customer', width: 150 },
        { field: 'address', headerName: 'Address', width: 150 },
        { field: 'phone', headerName: 'phone', width: 150 },
        { field: 'expectedStartDate', headerName: 'Date', width: 200 },
        {
            field: 'orderStatus',
            headerName: 'Status',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(params.value)}`}>
                    {params.value}
                </span>
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
                                <IconButton onClick={() => onViewDetails(params.row, designDetails)} style={{ color: 'blue' }}>
                                    <Visibility />
                                </IconButton>
                            </Tooltip>

                            {params.row.orderStatus !== 'CANCEL' && params.row.orderStatus !== 'COMPLETED' && (
                                <Tooltip title="Update Process">
                                    <IconButton
                                        onClick={() => __handleOpenUpdateProcessDialog(params.row)}
                                        style={{ color: 'teal' }}
                                    >
                                        <ViewAgendaOutlined />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {params.row.orderStatus === 'CHECKING_SAMPLE_DATA' && (
                                <Tooltip title="Update Sample Data">
                                    <IconButton
                                        onClick={() => __handleOpenInputSampleProductDialog(params.row.orderID)}
                                        style={{ color: 'pink' }}
                                    >
                                        <Verified />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {selectedOrderID === params.row.orderID && (
                                <BrandUpdateSampleProductDialog stageID={stageIdStart} isOpen={isDialogOpen} orderID={params.row.orderID} brandID={userAuth?.userID} onClose={__handleCloseInputSampleProductDialog}></BrandUpdateSampleProductDialog>

                            )}
                            {params.row.orderStatus !== 'COMPLETED' && params.row.orderStatus !== 'CANCEL' && (
                                <Tooltip title="Cancel">
                                    <IconButton
                                        onClick={() => __handleOpenReportDialog()}
                                        style={{ color: 'crimson' }}
                                    >
                                        <Cancel />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <CustomerReportOrderDialogComponent
                                isCancelOrder={true}
                                orderID={params.row.orderID}
                                onClose={() => setIsOpenReportOrderCanceledDialog(false)}
                                isOpen={isOpenReportOrderCanceledDialog}
                                onClickReportAndCancel={() => _handleCancelOrder(orders)}
                            ></CustomerReportOrderDialogComponent>
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
                        rows={Array.isArray(orders) ? orders : [orders]}
                        columns={columns}
                        slots={{ toolbar: GridToolbar }}
                        getRowId={getRowId}
                    />
                </Box>
            </div>
        </>
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
    // const [filters, setFilters] = useState({
    //     selectedFilter: 'date',
    //     date: '',
    //     status: '',
    //     name: '',
    //     orderStatus: '',
    //     orderID: '',
    // });
    const [selectedOrder, setSelectedOrder] = useState<BrandOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [goToPage, setGoToPage] = useState('1');
    const [designDetails, setDesignDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        const userStorage = Cookies.get('userAuth');
        if (!userStorage) {
            setIsLoading(false);
            return;
        }
        const userParse: UserInterface = JSON.parse(userStorage)
        const apiUrl = `${baseURL}${versionEndpoints.v1}${featuresEndpoints.order}${functionEndpoints.order.getOrderByBrandId}/${userParse.userID}`;
        console.log(apiUrl);
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
            .then((responseData: any) => {
                if (responseData && Array.isArray(responseData.data)) {
                    const subOrders = responseData.data.filter((order: any) => order.orderType === FILTERED_ORDER_TYPE);
                    const filteredPendingOrders = subOrders.filter((order: any) => order.orderStatus === 'PENDING');
                    const filteredCanceledOrders = subOrders.filter((order: any) => order.orderStatus === 'START_PRODUCING');
                    const filteredCompletedOrders = subOrders.filter((order: any) => order.orderStatus === 'COMPLETED');
                    const filteredCheckingSampleDataOrders = subOrders.filter((order: any) => order.orderStatus === 'CHECKING_SAMPLE_DATA');
                    setFilteredOrders(subOrders);
                    setOrder(subOrders);
                    setPendingCount(filteredPendingOrders.length);
                    setCanceledCount(filteredCanceledOrders.length);
                    setCompletedCount(filteredCompletedOrders.length);
                    setCheckingSampleDataCount(filteredCheckingSampleDataOrders.length);

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
    }, [order, filters]);

    const FILTERED_ORDER_TYPE = "SUB_ORDER";

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
    const applyFilters = (orderDetail: BrandOrder) => {
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

    const [isTableView, setIsTableView] = useState(false);

    const toggleView = () => {
        setIsTableView(!isTableView);
    };

    return (
        <div className='-mt-8'>
            <div className="mt-12">
                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                <path d="M19.14 12.936c.046-.306.071-.618.071-.936s-.025-.63-.071-.936l2.037-1.582a.646.646 0 00.154-.809l-1.928-3.338a.646.646 0 00-.785-.293l-2.4.964a7.826 7.826 0 00-1.617-.936l-.364-2.558A.645.645 0 0013.629 3h-3.258a.645.645 0 00-.635.538l-.364 2.558a7.82 7.82 0 00-1.617.936l-2.4-.964a.646.646 0 00-.785.293L2.642 9.673a.646.646 0 00.154.809l2.037 1.582a7.43 7.43 0 000 1.872l-2.037 1.582a.646.646 0 00-.154.809l1.928 3.338c.169.293.537.42.785.293l2.4-.964c.506.375 1.05.689 1.617.936l.364 2.558a.645.645 0 00.635.538h3.258a.645.645 0 00.635-.538l.364-2.558a7.82 7.82 0 001.617-.936l2.4.964c.248.127.616 0 .785-.293l1.928-3.338a.646.646 0 00-.154-.809l-2.037-1.582zM12 15.3A3.3 3.3 0 1112 8.7a3.3 3.3 0 010 6.6z" />
                            </svg>
                        </div>
                        <div className="p-4 text-right">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: secondaryColor, fontWeight: 'bold' }}>PENDING</p>
                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{pendingCount}</h4>
                        </div>

                    </div>
                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15V7l6 5-6 5z" />
                            </svg>

                        </div>
                        <div className="p-4 text-right">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: redColor, fontWeight: 'bold' }}>START</p>
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
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-.75 5.5c0-.414.336-.75.75-.75s.75.336.75.75v6c0 .414-.336.75-.75.75h-.008c-.414 0-.742-.336-.742-.75V7.5zm.75 11c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z" />
                            </svg>

                        </div>
                        <div className="p-4 text-right">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: primaryColor, fontWeight: 'bold' }}>CHECKING</p>
                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{checkingSampleDataCount}</h4>
                        </div>

                    </div>
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <LoadingComponent isLoading={isLoading} />
                </div>
            ) : (
                <>
                    <div style={{ width: "100%" }}>
                        <div className="flex flex-col">
                            <div className="mb-6">
                                <div className="flex mt-0">
                                    <div className="w-7/10" style={{ width: "80%" }}>
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
                                            className={`px-2 py-1 ${!isTableView ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 '} text-sm`}
                                            onClick={() => setIsTableView(false)}
                                        >
                                            List mode
                                        </button>
                                        <button
                                            className={`px-2 py-1 ${isTableView ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'} text-sm`}
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

                    <div>
                        {isTableView ? (
                            <OrderTable
                                orders={currentOrders}
                                onViewDetails={handleViewDetails}
                                onUpdatedOrderPending={handleMarkResolved}
                            />
                        ) : (
                            <div>
                                {
                                    currentOrders.map(order => (
                                        <BrandOrderFields
                                            key={order.orderID}
                                            order={order}
                                            onViewDetails={handleViewDetails}
                                            onMarkResolved={handleMarkResolved}
                                        />
                                    ))
                                }
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