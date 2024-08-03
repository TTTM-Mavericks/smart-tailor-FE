import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import VerticalLinearStepperComponent from '../Components/ProgressBar/VerticalStepperComponent';
import style from './OrderDetailStyles.module.scss'
import CancelOrderPolicyDialogComponent from '../../../components/Dialog/PolicyDialog/CancelOrderPolicyDialogComponent';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { OrderDetailInterface, OrderInterface, StageInterface } from '../../../models/OrderModel';
import { CustomerReportOrderDialogComponent, PaymentOrderDialogComponent } from '../../../components';
import { PaymentOrderInterface } from '../../../models/PaymentModel';
import { __handleAddCommasToNumber } from '../../../utils/NumbericUtils';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import ChangeAddressDialogComponent from '../OrderProduct/ChangeAddressDialogComponent';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import ViewProgessOfProductDialog from '../Components/Dialog/ViewProgessOfProduct/ViewProgessOfProductDialog';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';


export interface EstimatedStageInterface {
    estimatedQuantityFinishFirstStage: number;
    estimatedDateFinishFirstStage: string;
    estimatedQuantityFinishSecondStage: number;
    estimatedDateFinishSecondStage: string;
    estimatedQuantityFinishCompleteStage: number;
    estimatedDateFinishCompleteStage: string;
}



const OrderDetailScreen: React.FC = () => {
    // TODO MUTIL LANGUAGE

    // ---------------UseState---------------//


    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [isOpenCancelOrderPolicyDialog, setIsOpenCancelOrderPolicyDialog] = useState<boolean>(false);
    const [isOpenPaymentOrderDialog, setIsOpenPaymentOrderDialog] = useState<boolean>(false);
    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
    const [orderDetail, setOrderDetail] = useState<OrderDetailInterface>();
    const [payment, setPayment] = useState<PaymentOrderInterface[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedAddress, setSelectedAddress] = useState<any>();
    const [isChangeAddressDialogOpen, setIsChangeAddressDialogOpen] = useState<boolean>(false);
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>('');
    const [isOpenReportOrderDialog, setIsOpenReportOrderDialog] = useState<boolean>(false);
    const [isOpenRatingDialog, setIsOpenRatingDialog] = useState<boolean>(false);
    const [isOpenReasonCancelDialog, setIsOpenReasonCancelDialog] = useState<boolean>(false);
    const [selectedStep, setSelectedStep] = useState<{ orderID: any, step: string } | null>(null);
    const [isUploadSampleDialogOpen, setIsUploadSampleDialogOpen] = useState(false);
    const [progressSteps, setProgressStep] = useState<StageInterface[]>();
    const [timeline, setTimeLine] = useState<EstimatedStageInterface>();
    const [isCancelConfirmDialog, setIsCancelConfirmDialog] = useState<boolean>(false);
    const [isOpenReportOrderCanceledDialog, setIsOpenReportOrderCanceledDialog] = useState<boolean>(false);
    const [isOpenViewHistory, setIsOpenViewHistory] = useState<boolean>(false);
    const [selectedStage, setSelectedStage] = useState<string>();


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


    const { id } = useParams();
    const navigate = useNavigate();

    const orderDetails = {
        orderNumber: 'W086438695',
        date: '2021-03-22',
        items: [
            {
                name: 'Distant Mountains Artwork Tee',
                price: '$36.00',
                description: 'You awake in a new, mysterious land. Mist hangs low along the distant mountains. What does it mean?',
                imageUrl: 'https://via.placeholder.com/600',
                status: 'Processing'
            }
        ],
        billingAddress: 'Floyd Miles\n7363 Cynthia Pass\nToronto, ON N3Y 4H8',
        paymentInfo: {
            method: 'Credit Card',
            ending: '4242',
            expires: '02/24'
        },
        shippingUpdates: {
            email: 'tammt@gmail.com',
            phone: '9999999999'
        },
        progressSteps: [
            '0 products',
            '200 products',
            '500 products',
            'Successfull'
        ],
        currentStep: orderDetail?.orderStatus === 'NOT_VERIFY' ? 0 : 1,
        currentStep1: 2,
        progressDate: 'March 24, 2021'
    };
    // ---------------UseEffect---------------//

    useEffect(() => {
        if (orderDetail?.orderStatus === 'SUCESSFULL') {
            setIsOpenRatingDialog(true);
        }
    }, [orderDetail])

    /**
     * Move to Top When scroll down
     */
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };


    }, []);

    useEffect(() => {
        __handleGetOrderDetail();
    }, [])

    // ---------------FunctionHandler---------------//

    //+++++ API +++++//



    const __handleFetchTimeLine = async (parentId: any) => {
        setIsLoading(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderTimeLineByParentId}/${parentId}`);
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

    const calculateProgressWidth = () => {
        if (!progressSteps) return;
        const completedSteps = progressSteps.filter(step => step.status).length;
        return (completedSteps / progressSteps.length) * 150;
    };

    const progressWidth = calculateProgressWidth();


    /**
     * Handle get order detail data
     */
    const __handleGetOrderDetail = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderDetailById}/${id}`);
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                setOrderDetail(response.data);
                setPayment(response.data.paymentList);
                setIsLoading(false);
                await __handleLoadProgressStep(response.data.orderID);
                await __handleFetchTimeLine(response.data.orderID);
            }
            else {
                console.log('detail order: ', response.message);

                navigate('/error404');
            }
        } catch (error) {
            console.log('error: ', error);
            navigate('/error404');
        }
    }

    const __handleCalculateProgressWidth = (status: string) => {
        if (!progressSteps || progressSteps.length === 0) return 0;

        const completedIndex = progressSteps.findIndex(step => step.stage === status);

        if (completedIndex === - 1) return 0;

        return ((completedIndex + 1) / progressSteps.length) * 200;
    };

    /**
     * Close order policy dialog
     */
    const __handleCloseCancelOrderPolicyDilog = () => {
        setIsOpenCancelOrderPolicyDialog(false);
    };

    /**
     * Close order policy dialog
     */
    const __handleClosePaymentOrderDilog = () => {
        setIsOpenPaymentOrderDialog(false);
    };

    /**
     * Scrolls the window to the top smoothly.
     */
    const _handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /**
     * Handle cancel order click
     */
    const _handleCancelOrder = async () => {
        setIsLoading(true);
        try {
            const bodyRequest = {
                orderID: orderDetail?.orderID,
                status: 'CANCEL'
            }
            console.log('bodyRequest: ', bodyRequest);
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest);
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                setIsLoading(false);
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
            navigate('/error404');
        }
    };

    const __handleOpenConfirmCalcelDialog = () => {
        setIsOpenReportOrderCanceledDialog(true);
    }

    /**
 * Handle cancel order click
 */
    const _handlePaymentOrder = () => {

    };

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);


    /**
     * Add selected address
     * @param address 
     */
    const __handleGetSelectedAdress = (address: any) => {
        setSelectedAddress(address);
    }

    /**
     * Open dialog address
     * @param isOpen 
     */
    const __handleOpenChangeAddressDialog = (isOpen: boolean) => {
        setIsChangeAddressDialogOpen(isOpen);
        console.log(isOpen);
    }

    const __handleSubmitRating = () => {
        if (rating !== null) {
            setRating(null);
            setComment('');
        }
    }

    const __handleReorder = () => {
        setIsLoading(true);
        setTimeout(() => {
            navigate(`/design_detail/${orderDetail?.designResponse.designID}`)
            setIsLoading(false);
        }, 1000)
    }

    const __handleOpenReportDialog = () => {
        setIsOpenReportOrderDialog(true);
    }

    const __handleCloseReportDialog = () => {
        setIsOpenReportOrderDialog(false);
    }

    const __handleRatingOrder = () => {
        setIsOpenRatingDialog(false);
    }


    const __handleOpenProcessSampleProductDialog = (orderId: any, step: string) => {
        setIsUploadSampleDialogOpen(true);
        setSelectedStep({ orderID: orderId, step: step });
    };

    const __handleCloseProcessSampleProductDialog = () => {
        setIsUploadSampleDialogOpen(false);
        setSelectedStep(null);
    };

    const __handleOpenViewHistory = (stateId: any) => {
        setIsOpenViewHistory(true);
        setSelectedStage(stateId)

    }

    return (
        <div className={`${style.orderDetail__container}`} >
            <HeaderComponent />
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
            <div className={`${style.orderDetail__container__group}`} style={{ marginTop: '2%', marginBottom: '10%' }}>
                <div className={`${style.orderDetail__container__group__stepper}`}>
                    <VerticalLinearStepperComponent status={orderDetail?.orderStatus}></VerticalLinearStepperComponent>
                </div>
                <div className={`${style.orderDetail__container__detail} px-12 bg-white md:flex-row`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                        <h6 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">{t(codeLanguage + '000191')}</h6>
                        <a href="/order_history" className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200">{t(codeLanguage + '000192')} &rarr;</a>
                    </div>

                    <div className="border-b pb-4 mb-6">
                        <p className="text-sm text-gray-700 flex">
                            <span style={{ fontWeight: "bolder" }}>{orderDetail?.orderID}</span>
                            <span className="ml-auto text-sm text-gray-700 cursor-pointer" onClick={() => __handleOpenReportDialog()}>Report</span>
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-start mb-6">
                        <div className="flex flex-col items-center  mr-3">
                            <img
                                src={orderDetail?.designResponse.imageUrl}
                                alt={orderDetail?.designResponse.imageUrl}
                                className="w-40 h-52 object-cover rounded-md shadow-md mb-4 md:mb-0"
                            />
                            <button onClick={() => navigate(`/design/${orderDetail?.designResponse.designID}`)} className="text-indigo-600 hover:text-indigo-800 transition duration-200 mt-2">Edit design</button>
                        </div>


                        <div className="md:ml-6 w-1/2">
                            <p className="text-sm text-gray-600 mb-1 mt-3 w-full">
                                <span className='font-semibold text-gray-600'>Design: </span>
                                <span style={{ fontWeight: "normal" }}>{orderDetail?.designResponse.titleDesign}</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-1 mt-3 w-full">
                                <span className='font-semibold text-gray-600'>Expert tailoring: </span>
                                <span style={{ fontWeight: "normal" }}>{orderDetail?.designResponse.expertTailoring?.expertTailoringName}</span>
                            </p>

                            <p className="text-sm text-gray-600 mb-1 mt-3 w-full">
                                <span className='font-semibold text-gray-600'>Quantity: </span>
                                <span style={{ fontWeight: "normal" }}>{orderDetail?.quantity}</span>
                            </p>

                            <div className="text-sm text-gray-600 mb-1 mt-3 w-1/2">
                                {orderDetail?.detailList?.map((item, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-0 mb-2">
                                        <div className="font-semibold text-gray-600">
                                            Size: <span className="font-normal">{item?.size?.sizeName}</span>
                                        </div>
                                        <div className="font-semibold text-gray-600">
                                            Quantity: <span className="font-normal">{item?.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mb-1 mt-3 w-full">
                                <span className='font-semibold text-gray-600'>Total price: </span>
                                <span style={{ fontWeight: "bold", fontSize: 17 }}>{orderDetail?.totalPrice && orderDetail?.totalPrice > 0 ? __handleAddCommasToNumber(orderDetail?.totalPrice) + 'VND' : 'Waiting'} </span>
                            </p>

                            {orderDetail?.expectedStartDate && (
                                <p className="text-sm text-gray-600 mb-1 mt-3 w-full">
                                    <span className='font-semibold text-gray-600'>Expected start at: </span>
                                    <span style={{ fontWeight: "normal" }}>{orderDetail?.expectedStartDate}</span>
                                </p>
                            )}

                            <div className="flex flex-col md:flex-row md:space-x-10 mt-4">
                                <div className="md:w-1/2 flex items-center">
                                    <div className={style.orderDetail__orderStatus__tag} style={orderDetail?.orderStatus === 'CANCEL' ? { backgroundColor: redColor } : (orderDetail?.orderStatus === 'COMPLETED' || orderDetail?.orderStatus === 'DELIVERED') ? { backgroundColor: greenColor } : {}}>{orderDetail?.orderStatus}</div>
                                    {orderDetail?.orderStatus === 'CANCEL' && (
                                        <div className="ml-10">
                                            <a onClick={() => setIsOpenReasonCancelDialog(!isOpenReasonCancelDialog)} className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200 cursor-pointer">View reasons</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {orderDetail?.orderStatus !== 'DELIVERY' && (
                            <div className="flex flex-col md:flex-row md:ml-6 w-1/3">
                                <div className="md:w-1/2 mt-4 md:mt-0" style={{ margin: '0 auto' }}>
                                    <p className="font-medium text-gray-600">Buyer</p>
                                    <p className="text-sm text-gray-600">{selectedAddress ? selectedAddress.fullName : orderDetail?.buyerName}</p>
                                    <p className="text-sm text-gray-600">{selectedAddress ? selectedAddress.phoneNumber : orderDetail?.phone}</p>
                                    <button onClick={() => __handleOpenChangeAddressDialog(true)} className="text-indigo-600 hover:text-indigo-800 transition duration-200">Edit</button>
                                </div>
                                <div className="md:w-1/2 md:mt-0 ">
                                    <p className="font-medium text-gray-600">{t(codeLanguage + '000194')}</p>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{selectedAddress ? selectedAddress.address : orderDetail?.address}, {selectedAddress ? selectedAddress.ward : orderDetail?.ward}, {selectedAddress ? selectedAddress.district : orderDetail?.district}, {selectedAddress ? selectedAddress.province : orderDetail?.province}</p>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Progress Bar */}
                    {/* <div className="border-t pt-4 mb-20">
                        <p className="text-sm text-gray-600 mb-1 mt-3 w-full">
                            <span className='font-semibold text-gray-600'>Expected complete at: </span>
                            <span style={{ fontWeight: "normal" }}>{orderDetail?.expectedProductCompletionDate}</span>
                        </p>
                        <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
                            <div className="absolute top-0 left-0 h-2 bg-indigo-600 rounded-full" style={{ width: `${(orderDetails.currentStep / (orderDetails.progressSteps.length - 1)) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                            {orderDetails.progressSteps.map((step, index) => (
                                <>
                                    <p key={index} onClick={() => index <= orderDetails.currentStep ? __handleOpenProcessSampleProductDialog(orderDetail?.orderID, step) : {}} className={`text-center ${index <= orderDetails.currentStep ? 'text-indigo-600' : 'text-gray-400'} cursor-pointer`}>{step}</p>
                                    {selectedStep?.step === step && (
                                    )}
                                </>
                            ))}
                        </div>

                    </div> */}

                    {timeline && progressSteps && orderDetail?.orderStatus !== 'CANCEL' && (



                        <div className="pt-4 mb-20">
                            {/* <p className="text-sm text-gray-600 mb-1 mt-3 w-full">
                            <span className='font-semibold text-gray-600'>Expected complete at: </span>
                            <span style={{ fontWeight: "normal" }}>{orderDetail?.expectedProductCompletionDate}</span>
                        </p> */}
                            <div className="flex justify-between text-sm mb-2">
                                <span className={`text-indigo-600`}>
                                    {timeline?.estimatedDateFinishFirstStage}
                                </span>
                                <span className={`text-indigo-600`}>
                                    {timeline?.estimatedDateFinishSecondStage}
                                </span >
                                <span className={`text-indigo-600`}>
                                    {timeline?.estimatedDateFinishCompleteStage}
                                </span>

                            </div>
                            <div className="relative w-full h-2 bg-gray-200 rounded-full mb-2">
                                <div className="absolute top-0 left-0 h-2 bg-indigo-600 rounded-full" style={{ width: `${progressWidth}%` }}></div>
                            </div>
                            {/* <div className="flex justify-between text-sm">
                                <span className={`text-indigo-600`}>
                                    {timeline?.estimatedQuantityFinishFirstStage} products
                                </span>
                                <span className={`text-indigo-600`}>
                                    {timeline?.estimatedQuantityFinishSecondStage} products
                                </span >
                                <span className={`text-indigo-600`}>
                                    {timeline?.estimatedQuantityFinishCompleteStage} products
                                </span>
                            </div> */}
                            <div className="flex justify-between text-sm">

                                {progressSteps?.map((step, index) => {
                                    const isCurrentStep = step.status;
                                    return (
                                        <>
                                            <p onClick={() => __handleOpenViewHistory(step.stageId)} key={index} className={`text-center ${isCurrentStep ? 'text-indigo-600' : 'text-gray-400'} cursor-pointer`}>
                                                {step.currentQuantity} / {orderDetail?.quantity} products
                                            </p>
                                            {selectedStage === step.stageId && (
                                                <ViewProgessOfProductDialog stageId={step.stageId} orderID={orderDetail?.orderID} isOpen={isOpenViewHistory} onClose={() => setIsOpenViewHistory(false)} ></ViewProgessOfProductDialog>
                                            )}

                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    )}


                    {orderDetail?.paymentList && orderDetail?.paymentList?.length > 0 && orderDetail.orderStatus !== 'CANCEL' && (
                        <>

                            <div className="mt-10 border-t pt-4">
                                <div className="flex flex-col md:flex-row justify-between">
                                    <div className="w-full md:w-2/5 pr-0 md:pr-4 mb-4 md:mb-0">
                                        <p className="font-medium text-gray-600">{t(codeLanguage + '000210')}</p>
                                        <p className="text-gray-600 whitespace-pre-line">{orderDetails.billingAddress}</p>
                                    </div>
                                    <div className="w-full md:w-2/5 pl-0 md:pl-4 mb-4 md:mb-0">
                                        <p className="font-medium text-gray-600">{t(codeLanguage + '000211')}</p>
                                        <div className="flex items-center">
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAfCAMAAACF8f6iAAAAdVBMVEX///8UNMsAJMkAKspca9YALMoAJskAD8cIL8oAIMgAHcioreYAFMextumiqOUAAMaMlN9GV9G+wuxLXNLv8Pp7hdxlctf6+/7Cxu3f4fbm6PiVnOLO0fHV1/PZ3PSco+RWZtU5TdCBit0tRM5vetkfOswnP839FUl8AAAB00lEQVQ4je1TW4KDIAwkIIKIj/q2rda27t7/iJsE63KE/dj5aIlJJiQThPjHn8KjbbcEkQfzjkY7ihZ/ZzS7R+uMf/YLO+chSbbikzlOQ6W1ria2EqnlIGajtSFWk1oAsL5kp1RayySqelUAqqZT5wH8IgoJ9iLEDS0rM6n8Ss4iQxJQ8X1rBbbli6dgn0L0ioi6CkBfiql4GY56UnXw1yjx7vADHdCRYRNvC1nDFexv0Oopjxy/GH1gmpAgPc2HxLD7GbQrJJVHTx+0XEJsGtI6XEAjDZXwfRdCsH27jebo6RQlhfTGTfmOLT3g10tKwzCPTwhyf2GFOHFxSCduR8KgQbIAiad5uI3OOHk30n39HGc6mrNlLQT9u9Db9E0SONyOxoHqBQklizgxwSI5qvcmWbG3ajwcJVJSWxcLab6uNJ0+TsQkOLQQTRYIAlBTlHamQaXOYVjkQ8xBJElnXAdibXhdSHa1U/qJ8zYMzevEGuGtqI/WfO2vXWHDZiFlrSHIs/8DO1F61swATw5DtCI+/xJlWF4RplPGiYWR0vHmL5WUuJzXKsPHoJWj6lkmTXh4c3WEfdCVeV6yQiueaEZdU+/JXtNzu5Lz2CA85uIffws/lusXjWNFJpAAAAAASUVORK5CYII=" alt="Visa" className="inline-block mr-2" />
                                            <div>
                                                <p className="text-gray-600">Ending with {orderDetails.paymentInfo.ending}</p>
                                                <p className="text-gray-600">Expires {orderDetails.paymentInfo.expires}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-3/5 mt-6 md:mt-0">
                                        <div className="flex flex-col space-y-4">

                                            <div className="flex justify-between border-b pb-2">
                                                {payment && payment[0].paymentType === 'DEPOSIT' && (
                                                    <p className="text-gray-600">Deposit price</p>
                                                )}
                                                {payment && payment[0].paymentType === 'STAGE_1' && (
                                                    <p className="text-gray-600">Stage 1 price</p>
                                                )}
                                                {payment && payment[0].paymentType === 'STAGE_2' && (
                                                    <p className="text-gray-600">Stage 2 price</p>
                                                )}
                                                <p className="text-gray-600">{payment?.map((item) => {
                                                    if (true) return __handleAddCommasToNumber(item.payOSResponse.data.amount)
                                                })} VND</p>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <p className="text-gray-600">Discount</p>
                                                <p className="text-gray-600">0</p>
                                            </div>
                                            <div className="flex justify-between font-semibold text-gray-900">
                                                <p>{t(codeLanguage + '000206')}</p>
                                                <p>{payment?.map((item) => {
                                                    if (true) return __handleAddCommasToNumber(item.payOSResponse.data.amount)
                                                })} VND</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cancel Order Button */}
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setIsOpenCancelOrderPolicyDialog(true)}
                                    className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200 mr-4"
                                    style={{ backgroundColor: redColor }}
                                >
                                    {t(codeLanguage + '000205')}
                                </button>

                                <button
                                    onClick={() => setIsOpenPaymentOrderDialog(true)}
                                    className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200"
                                    style={{ backgroundColor: greenColor }}
                                >
                                    Payment
                                </button>

                            </div>
                        </>
                    )}
                    {/* Billing and Payment Information Section */}
                    {orderDetail?.orderStatus === 'CANCEL' && (
                        <div >

                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => __handleOpenReportDialog()}
                                    className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200 mr-4"
                                    style={{ backgroundColor: redColor }}
                                >
                                    Report
                                </button>
                                <button
                                    onClick={() => __handleReorder()}
                                    className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200"
                                    style={{ backgroundColor: greenColor }}
                                >
                                    Reorder
                                </button>

                            </div>


                        </div>
                    )}


                    {showScrollButton && (
                        <IconButton
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 100,
                                backgroundColor: primaryColor,
                                color: "white"
                            }}
                            onClick={_handleScrollToTop}
                        >
                            <ArrowUpward />
                        </IconButton>
                    )}
                </div>
            </div>

            {/* DIALOG */}
            <CancelOrderPolicyDialogComponent onClick={__handleOpenConfirmCalcelDialog} onClose={__handleCloseCancelOrderPolicyDilog} isOpen={isOpenCancelOrderPolicyDialog}></CancelOrderPolicyDialogComponent>
            <PaymentOrderDialogComponent paymentData={payment} onClick={_handlePaymentOrder} onClose={__handleClosePaymentOrderDilog} isOpen={isOpenPaymentOrderDialog}></PaymentOrderDialogComponent>
            <ChangeAddressDialogComponent
                onSelectedAddressData={(address) => __handleGetSelectedAdress(address)}
                isOpen={isChangeAddressDialogOpen} onClose={() => __handleOpenChangeAddressDialog(false)}
            ></ChangeAddressDialogComponent>

            <CustomerReportOrderDialogComponent
                isCancelOrder={false}
                orderID={orderDetail?.orderID}
                onClose={__handleCloseReportDialog}
                isOpen={isOpenReportOrderDialog}
            ></CustomerReportOrderDialogComponent>

            <CustomerReportOrderDialogComponent
                isCancelOrder={true}
                orderID={orderDetail?.orderID}
                onClose={() => setIsOpenReportOrderCanceledDialog(false)}
                isOpen={isOpenReportOrderCanceledDialog}
                onClickReportAndCancel={_handleCancelOrder}
            ></CustomerReportOrderDialogComponent>

            <Dialog open={isOpenRatingDialog}>
                <DialogTitle>
                    <h2 className="text-md font-semibold mb-4 ">Rating</h2>
                </DialogTitle>

                <DialogContent style={{ textAlign: 'center' }} >
                    <form onSubmit={__handleSubmitRating} className='flex items-center mt-0 px-12'>
                        <div className="flex items-center mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`text-2xl mr-1 ${rating && rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                    </form>

                    <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white"
                        onClick={__handleRatingOrder}
                        style={{
                            border: `1px solid ${primaryColor}`,
                            borderRadius: 4,
                            color: whiteColor,
                            marginBottom: 10,
                            marginRight: 10,
                            backgroundColor: primaryColor,
                            margin: '0 auto'
                        }}
                    >
                        Submit
                    </button>
                </DialogContent>
            </Dialog>

            {/* Cancel reason dialog */}

            <Dialog open={isOpenReasonCancelDialog} onClose={() => setIsOpenReasonCancelDialog(false)}>
                <DialogTitle>
                    <h2 className="text-md font-semibold mb-4 ">Reason</h2>
                    <IoMdCloseCircleOutline
                        cursor="pointer"
                        size={20}
                        color={redColor}
                        onClick={() => setIsOpenReasonCancelDialog(false)}
                        style={{ position: 'absolute', right: 20, top: 20 }}
                    />
                </DialogTitle>

                <DialogContent >
                    <Typography variant="body1" className={style.content__section}>
                        <strong>General Provisions</strong><br />
                        <li>This order cancellation policy applies to all custom orders placed through our platform.</li>
                        <li>Customers must agree to the terms and conditions of this cancellation policy when placing an order.</li>
                    </Typography>
                    <Typography variant="body1" className={style.content__section}>
                        <strong>Order Cancellation Period</strong><br />
                        <li>Customers can cancel their order within X hours from the time the order is created.</li>
                        <li>After X hours, the order will be considered non-cancellable without incurring compensation costs.</li>
                    </Typography>
                    <Typography variant="body1" className={style.content__section}>
                        <strong>Order Cancellation Procedure</strong><br />
                        <li>To cancel an order, customers must submit a cancellation request through our website or contact our customer service directly.</li>
                        <li>The cancellation notice must include the order number and the reason for cancellation.</li>
                    </Typography>
                </DialogContent>
            </Dialog>

            <Dialog open={isCancelConfirmDialog} aria-labelledby="popup-dialog-title" maxWidth="xs" fullWidth>
                <DialogTitle id="popup-dialog-title">
                    Confirm cancel order
                    <IoMdCloseCircleOutline
                        cursor="pointer"
                        size={20}
                        color={redColor}
                        onClick={() => setIsCancelConfirmDialog(false)}
                        style={{ position: 'absolute', right: 20, top: 20 }}
                    />
                </DialogTitle>
                <DialogContent >
                    <div>
                        You still want to cancel this order?
                    </div>
                </DialogContent>
                <DialogActions>

                    <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white"
                        onClick={_handleCancelOrder}
                        style={{
                            borderRadius: 4,
                            color: whiteColor,
                            backgroundColor: redColor,
                        }}
                    >
                        Cancel
                    </button>
                </DialogActions>




            </Dialog>

            <FooterComponent />

        </div>
    );
};

export default OrderDetailScreen;
