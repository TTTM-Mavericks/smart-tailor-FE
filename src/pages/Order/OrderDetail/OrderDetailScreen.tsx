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
import { __handleAddCommasToNumber, __handleRoundToThreeDecimalPlaces } from '../../../utils/NumbericUtils';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import ChangeAddressDialogComponent from '../OrderProduct/ChangeAddressDialogComponent';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import ViewProgessOfProductDialog from '../Components/Dialog/ViewProgessOfProduct/ViewProgessOfProductDialog';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import { UserInterface } from '../../../models/UserModel';
import Cookies from 'js-cookie';
import { Report } from '../../../models/EmployeeManageReportModel';
import { ghtkLogo } from '../../../assets';
import { height } from '@mui/system';
import CustomerUpgradeDialog from '../../../components/Dialog/UpgradeDialog/CustomerUpgradeDialog';
import { __getToken, __getUserLogined } from '../../../App';
import { __handleSendNotification } from '../../../utils/NotificationUtils';
import MaterialDetailTableComponent from '../Components/Table/MaterialDetailTableComponent';
import ViewFinalCheckingProductsDialogComponent from '../Components/Dialog/ViewFinalCheckingProductsDialog/ViewFinalCheckingProductsDialogComponent';
import RefunctionRequestDialogComponent from '../../../components/Dialog/RefunctionRequestDialog/RefunctionRequestDialogComponent';
import PartOfClothAndPriceDetailTableComponent from '../Components/Table/PartOfClothAndPriceDetailComponent';



export interface EstimatedStageInterface {
    estimatedQuantityFinishFirstStage: number;
    estimatedDateFinishFirstStage: string;
    estimatedQuantityFinishSecondStage: number;
    estimatedDateFinishSecondStage: string;
    estimatedQuantityFinishCompleteStage: number;
    estimatedDateFinishCompleteStage: string;
    estimatedDateStartDepositStage: string
}

interface BrandDetailPriceResponseInterface {
    brandID: string;
    subOrderID: string;
    brandPriceDeposit: string;
    brandPriceFirstStage: string;
    brandPriceSecondStage: string;
}

interface OrderPriceDetailInterface {
    totalPriceOfParentOrder: string;
    customerPriceDeposit: string;
    customerPriceFirstStage: string;
    customerSecondStage: string;
    customerShippingFee: string | number | undefined;
    brandDetailPriceResponseList: BrandDetailPriceResponseInterface[];
    customerCommissionFee: string;
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
    const [userAuth, setUserAuth] = useState<UserInterface>();
    const [reportReason, setReportReason] = useState<Report[]>([]);
    const [referencePrice, setReferencePrice] = useState<OrderPriceDetailInterface>();
    const [isOpenSystemShippingPriceDialog, setIsOpenSystemShippingPriceDialog] = useState<boolean>(false);
    const [token, setToken] = useState<string>();
    const [isOpenSuspendedDialog, setIsOpenSuspendedDialog] = useState<boolean>(false);
    const [isOpenFinalProductsDialog, setIsOpenFinalProductsDialog] = useState<boolean>(false);
    const [isOpenMaterialDetailDialog, setIsOpenMaterialDetailDialog] = useState<boolean>(false);
    const [isOpenRefundRequestDialog, setIsOpenRefundRequestDialog] = useState<boolean>(false);
    const [totalPrices, setTotalPrices] = useState<{ min: number, max: number }>({ min: 0, max: 0 });






    // const customSortOrder = [
    //     'START_PRODUCING',
    //     'FINISH_FIRST_STAGE',
    //     'FINISH_SECOND_STAGE',
    //     'COMPLETED'
    // ];

    const customSortOrder = ["DEPOSIT", "PROCESSING", "COMPLETED"];

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

        if (orderDetail?.designMaterialDetailResponseList) {
            const calculateTotalPrices = () => {
                let totalMin = 0;
                let totalMax = 0;

                orderDetail?.designMaterialDetailResponseList?.forEach(item => {
                    // Ensure minPriceMaterial and maxPriceMaterial are defined and parsed as numbers
                    if (item.minPriceMaterial) {
                        totalMin += parseFloat(item.minPriceMaterial);
                    }
                    if (item.maxPriceMaterial) {
                        totalMax += parseFloat(item.maxPriceMaterial);
                    }
                });

                return { min: totalMin, max: totalMax };
            };

            setTotalPrices(calculateTotalPrices());
        }

    }, [orderDetail])


    useEffect(() => {
        if (orderDetail?.orderStatus === 'RECEIVED') {
            setIsOpenRatingDialog(true);
        }

        if (orderDetail?.orderStatus === 'SUSPENDED') {
            setIsOpenSuspendedDialog(true);
        }
    }, [orderDetail])

    /**
     * Move to Top When scroll down
     */
    useEffect(() => {
        __handleGetOrderDetail();

        const userStorage = Cookies.get('userAuth');
        if (userStorage) {
            const userParse: UserInterface = JSON.parse(userStorage);
            setUserAuth(userParse);
        }
        const tokenStorage = Cookies.get('token');
        if (tokenStorage) {
            console.log('tokenStorage: ', tokenStorage);
            setToken(tokenStorage);
        }



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

    }, [])

    // ---------------FunctionHandler---------------//

    //+++++ API +++++//


    const __handleReferencePrice = async (parentId: any) => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.designDetail + functionEndpoints.designDetail.getTotalPriceByParentOrderId}/${parentId}`, null, __getToken());
            if (response.status === 200) {
                setReferencePrice(response.data)
            }
            else {
                console.log('detail error: ', response.message);
            }
        } catch (error) {
            console.log('error: ', error);
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
                // toast.error(`${response.message}`, { autoClose: 4000 });
            }
        } catch (error) {
            console.log('error: ', error);
            // toast.error(`${error}`, { autoClose: 4000 });
        }

    }

    const __handleLoadProgressStep = async (subOrderId: any) => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderStageById}/${subOrderId}`, null, __getToken());
            if (response.status === 200) {
                setIsLoading(false);
                const sortedData = sortStages(response.data);
                setProgressStep(sortedData);
            }
            else {
                console.log('detail error: ', response.message);
                // toast.error(`${response.message}`, { autoClose: 4000 });
            }
        } catch (error) {
            console.log('error: ', error);
            // toast.error(`${error}`, { autoClose: 4000 });
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
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderDetailById}/${id}`, null, __getToken());
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                setOrderDetail(response.data);
                setPayment(response.data.paymentList);
                setIsLoading(false);
                await __handleLoadProgressStep(response.data.orderID);
                await __handleFetchTimeLine(response.data.orderID);
                await __handleReferencePrice(response.data.orderID);
            }
            else {
                console.log('detail order: ', response.message);
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
    const _handleChangeOrderStatus = async (status: any) => {
        setIsLoading(true);
        try {
            const bodyRequest = {
                orderID: orderDetail?.orderID,
                status: status
            }
            console.log('bodyRequest: ', bodyRequest);
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest, __getToken());
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                setIsLoading(false);
                toast.success(`${response.message}`, { autoClose: 4000 });

                const user: UserInterface = __getUserLogined();
                const bodyRequest = {
                    senderID: user.userID,
                    recipientID: orderDetail?.employeeID,
                    action: "CANCEL",
                    type: "ORDER",
                    targetID: orderDetail?.orderID,
                    message: `Some reason make customer ${user.userID} want to cancel this order`
                }
                console.log(bodyRequest);
                __handleSendNotification(bodyRequest);

                setTimeout(() => {
                    window.location.reload();
                }, 4000);
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

    const __handleSubmitRating = async () => {
        setIsLoading(true);

        try {
            const bodyRequest = {
                userID: userAuth?.userID,
                parentOrderID: orderDetail?.orderID,
                rating: rating,

            }
            console.log('bodyRequest: ', bodyRequest);

            const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.ratingOrder}`, bodyRequest, __getToken());
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                toast.success(`${response.message}`, { autoClose: 4000 });
                window.location.reload();

            }
            else {
                console.log('detail error: ', response.message);
                toast.error(`${response.message}`, { autoClose: 4000 });
            }
            setIsOpenRatingDialog(false);

        } catch (error) {
            console.log(error);
            toast.error(`${error}`, { autoClose: 4000 });
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
        __handleSubmitRating();
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

    const __handleGetCancelReasonDetail = async () => {
        setIsOpenReasonCancelDialog(true)
        setIsLoading(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.report + functionEndpoints.report.getReportByOrderID}/${orderDetail?.orderID}`, null, __getToken());
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                setReportReason(response.data);
                setIsLoading(false);

            }
            else {
                console.log('detail order: ', response.message);
                setIsLoading(false);

            }
        } catch (error) {
            console.log('error: ', error);
            setIsLoading(false);

        }
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
                            <div className='flex items-center'>
                                <p style={{ fontWeight: "bolder" }}>{orderDetail?.orderID}</p>
                                <div className="flex items-center ml-5">
                                    {orderDetail?.rating && orderDetail?.rating > 0 && (
                                        <>
                                            {/* Loop to create full stars */}
                                            {Array.from({ length: Math.floor(orderDetail.rating) }).map((_, index) => (
                                                <span key={index} className="text-yellow-500 text-xl">★</span> // Full star
                                            ))}

                                            {/* Check for half star */}
                                            {orderDetail.rating % 1 !== 0 && (
                                                <span className="text-yellow-500 text-xl">★</span> // Half star
                                            )}

                                            {/* Loop to create empty stars */}
                                            {Array.from({ length: 5 - Math.ceil(orderDetail.rating) }).map((_, index) => (
                                                <span key={index} className="text-gray-300 text-xl">★</span> // Empty star
                                            ))}

                                            {/* Display the rating number */}
                                            <span className="ml-2 font-bold">{orderDetail.rating}/5</span>
                                        </>
                                    )}
                                </div>


                            </div>
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
                            {/* <button onClick={() => navigate(`/design/${orderDetail?.designResponse.designID}`)} className="text-indigo-600 hover:text-indigo-800 transition duration-200 mt-2">Edit design</button> */}
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
                                <span className='font-semibold text-gray-600'>Material details: </span>
                                <span style={{ fontWeight: "500", color: secondaryColor, cursor: 'pointer' }} onClick={() => setIsOpenMaterialDetailDialog(true)}>View</span>
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
                            {/* <p className="text-sm text-gray-600 mb-1 mt-3 w-full">
                                <span className='font-semibold text-gray-600'>Total price: </span>
                                <span style={{ fontWeight: "bold", fontSize: 17 }}>{orderDetail?.totalPrice && orderDetail?.totalPrice > 0 ? __handleAddCommasToNumber(orderDetail?.totalPrice) + 'VND' : 'Waiting'} </span>
                            </p> */}

                            {orderDetail?.expectedStartDate && (
                                <p className="text-sm text-gray-600 mb-1 mt-3 w-full">
                                    <span className='font-semibold text-gray-600'>Expected start at: </span>
                                    <span style={{ fontWeight: "normal" }}>{orderDetail?.expectedStartDate}</span>
                                </p>
                            )}

                            <div className="flex mt-4">
                                <div className="w-52 flex items-center">
                                    <div className={style.orderDetail__orderStatus__tag} style={orderDetail?.orderStatus === 'CANCEL' ? { backgroundColor: redColor } : (['COMPLETED', 'DELIVERED', 'RECEIVED'].includes(orderDetail?.orderStatus || '')) ? { backgroundColor: greenColor } : {}}>{orderDetail?.orderStatus}</div>
                                    {orderDetail?.orderStatus === 'CANCEL' && (
                                        <div className="ml-5">
                                            <a onClick={() => __handleGetCancelReasonDetail()} className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200 cursor-pointer">View reasons</a>
                                        </div>
                                    )}
                                    {orderDetail?.orderStatus === 'SUSPENDED' && (
                                        <div className="ml-2">
                                            <a onClick={() => setIsOpenSuspendedDialog(true)} className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200 cursor-pointer">View reasons</a>
                                        </div>
                                    )}
                                </div>
                                {orderDetail?.orderStatus === 'FINAL_CHECKING' && (
                                    <div className="-ml-2" style={{ width: 200 }}>
                                        <a onClick={() => setIsOpenFinalProductsDialog(true)} className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200 cursor-pointer">View products</a>
                                    </div>
                                )}
                                {isOpenFinalProductsDialog && (
                                    <ViewFinalCheckingProductsDialogComponent order={orderDetail} onClose={() => setIsOpenFinalProductsDialog(false)} ></ViewFinalCheckingProductsDialogComponent>
                                )}
                            </div>
                        </div>

                        {orderDetail?.orderStatus !== 'DELIVERED' && (
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

                    {timeline && progressSteps && (orderDetail?.orderStatus !== 'CANCEL' && orderDetail?.orderStatus !== 'NOT_VERIFY') && (



                        <div className="pt-4 mb-10">
                            {/* <p className="text-sm text-gray-600 mb-1 mt-3 w-full">
                            <span className='font-semibold text-gray-600'>Expected complete at: </span>
                            <span style={{ fontWeight: "normal" }}>{orderDetail?.expectedProductCompletionDate}</span>
                        </p> */}
                            <div className="flex justify-between text-sm mb-2">
                                <p className='flex'>
                                    <span>Start: </span>
                                    {timeline?.estimatedDateFinishFirstStage ? (

                                        <span className={`text-indigo-600 ml-1`}>
                                            {timeline?.estimatedDateFinishFirstStage}
                                        </span>
                                    ) : (
                                        <span className={`text-indigo-600 ml-1`}>
                                            {orderDetail?.expectedStartDate}
                                        </span>
                                    )}
                                </p>
                                {timeline?.estimatedDateFinishSecondStage && (

                                    <p className='flex'>
                                        <span>Stage: 1-2: </span>
                                        <span className={`text-indigo-600 ml-1`}>
                                            {timeline?.estimatedDateFinishSecondStage}
                                        </span >
                                    </p>
                                )}
                                <p className='flex'>
                                    <span>Completed: </span>
                                    <span className={`text-indigo-600 ml-1`}>
                                        {timeline?.estimatedDateFinishCompleteStage}
                                    </span>
                                </p>


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
                                        <div key={index}>
                                            {step.currentQuantity > 0 && (

                                                <p onClick={() => __handleOpenViewHistory(step.stageId)} key={index} className={`text-center ${isCurrentStep ? 'text-indigo-600' : 'text-gray-400'} cursor-pointer`}>
                                                    {step.currentQuantity} / {orderDetail?.quantity} products
                                                </p>
                                            )}
                                            {selectedStage === step.stageId && (
                                                <ViewProgessOfProductDialog key={index} stageId={step.stageId} orderID={orderDetail?.orderID} isOpen={isOpenViewHistory} onClose={() => setIsOpenViewHistory(false)} ></ViewProgessOfProductDialog>
                                            )}

                                        </div>
                                    );
                                })}
                            </div>

                        </div>

                    )}



                    {orderDetail?.orderStatus !== 'CANCEL' && orderDetail?.orderStatus !== 'NOT_VERIFY' && (
                        <div className="mt-0 border-t pt-4 flex">
                            <div className={`w-full md:w-2/5 mt-6 md:mt-0 ${orderDetail?.paymentList && orderDetail?.paymentList?.length <= 0 && 'ml-auto'}`}>
                                <div className="flex flex-col space-y-4">
                                    {referencePrice?.customerCommissionFee !== '-1' && (
                                        <div className="flex justify-between border-b pb-2">
                                            <p className="text-gray-600 text-sm">Commission fee</p>
                                            <p className="text-gray-600 text-sm">{referencePrice?.customerCommissionFee ? __handleAddCommasToNumber(referencePrice?.customerCommissionFee) : 'Loading'} VND</p>

                                        </div>
                                    )}

                                    {referencePrice?.customerPriceDeposit !== '-1' && (
                                        <div className="flex justify-between border-b pb-2">
                                            <p className="text-gray-600 text-sm">Deposit</p>
                                            <p className="text-gray-600 text-sm">{referencePrice?.customerPriceDeposit ? __handleAddCommasToNumber(referencePrice?.customerPriceDeposit) : 'Loading'} VND</p>
                                        </div>
                                    )}

                                    {referencePrice?.customerPriceFirstStage !== '-1' && (
                                        <div className="flex justify-between border-b pb-2">
                                            <p className="text-gray-600 text-sm">Stage 1</p>
                                            <p className="text-gray-600 text-sm">{referencePrice?.customerPriceFirstStage ? __handleAddCommasToNumber(referencePrice?.customerPriceFirstStage) : 'Loading'} VND</p>
                                        </div>
                                    )}
                                    {referencePrice?.customerSecondStage !== '-1' && (
                                        <div className="flex justify-between border-b pb-2">
                                            <p className="text-gray-600 text-sm">Stage 2</p>
                                            <p className="text-gray-600 text-sm">{referencePrice?.customerSecondStage ? __handleAddCommasToNumber(referencePrice?.customerSecondStage) : 'Loading'} VND</p>

                                        </div>
                                    )}

                                    <div className="flex justify-between border-b pb-2">
                                        <p className="text-gray-600 text-sm">Shipping (Pay later)</p>
                                        {referencePrice?.customerShippingFee !== '-1' ? (
                                            <div className="text-gray-600 text-sm flex items-center justify-center">
                                                <img src={ghtkLogo} style={{ width: 100, height: 15, marginRight: 20 }}></img>
                                                <p className="text-gray-600 text-sm">
                                                    {referencePrice?.customerShippingFee ? __handleAddCommasToNumber(referencePrice?.customerShippingFee) : 'Loading'} VND</p>
                                            </div>

                                        ) : (
                                            <div className="text-gray-600 text-sm flex items-center justify-center">
                                                <p className={`mr-2 flex items-center justify-center rounded-md bg-yellow-50 px-2 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10`}>
                                                    Over weight delivery service
                                                </p>
                                                <span onClick={() => setIsOpenSystemShippingPriceDialog(true)} style={{ cursor: 'pointer', textDecorationLine: 'underline', color: secondaryColor }}>View</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between border-b pb-2" style={{ fontWeight: 'bold' }}>
                                        <p className="text-gray-600 text-sm">Order Total</p>
                                        <p className="text-gray-600 text-sm">{referencePrice?.totalPriceOfParentOrder ? __handleAddCommasToNumber(referencePrice?.totalPriceOfParentOrder) : 'Loading'} VND</p>

                                    </div>
                                    <div className="flex justify-between font-semibold text-gray-900">

                                    </div>
                                </div>
                                {orderDetail?.paymentList && orderDetail?.paymentList.length === 0 &&
                                    (orderDetail?.orderStatus !== 'DELIVERED' && orderDetail?.orderStatus !== 'COMPLETED' && orderDetail?.orderStatus !== 'RECEIVED') && (
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={() => __handleOpenConfirmCalcelDialog()}
                                                className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200 mr-4"
                                                style={{ backgroundColor: redColor }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}

                            </div>



                            {orderDetail?.paymentList && orderDetail?.paymentList?.length > 0 && orderDetail.orderStatus !== 'CANCEL' && orderDetail.orderStatus !== 'REFUND_REQUEST' && (

                                <div className="w-full md:w-2/5 mt-6 md:mt-0 ml-auto">
                                    <div className="flex flex-col space-y-4">

                                        <div className="flex justify-between border-b pb-2">
                                            {payment && payment[0].paymentType === 'DEPOSIT' && (
                                                <p className="text-gray-600 text-sm">Deposit price</p>
                                            )}
                                            {payment && payment[0].paymentType === 'STAGE_1' && (
                                                <p className="text-gray-600 text-sm">Stage 1 price</p>
                                            )}
                                            {payment && payment[0].paymentType === 'STAGE_2' && (
                                                <p className="text-gray-600 text-sm">Stage 2 price</p>
                                            )}
                                            {payment && payment[0].paymentType === 'COMPLETED_ORDER' && (
                                                <p className="text-gray-600 text-sm">Stage 2 price</p>
                                            )}
                                            <p className="text-gray-600 text-sm">{payment?.map((item) => {
                                                if (true) return __handleAddCommasToNumber(item?.payOSData?.amount)
                                            })} VND</p>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <p className="text-gray-600 text-sm">Discount</p>
                                            <p className="text-gray-600 text-sm">0</p>
                                        </div>

                                        <div className="flex justify-between font-semibold text-gray-900">
                                            <p className="text-gray-600 text-sm">Total</p>
                                            <p className="text-gray-600 text-sm">{payment?.map((item) => {
                                                if (true) return __handleAddCommasToNumber(item?.payOSData?.amount)
                                            })} VND</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={() => setIsOpenCancelOrderPolicyDialog(true)}
                                            className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200 mr-4"
                                            style={{ backgroundColor: redColor }}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={() => setIsOpenPaymentOrderDialog(true)}
                                            className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200"
                                            style={{ backgroundColor: greenColor }}
                                        >
                                            Payment
                                        </button>
                                    </div>
                                </div>

                            )}
                        </div>
                    )}
                    {/* Billing and Payment Information Section */}
                    {orderDetail?.orderStatus === 'CANCEL' || orderDetail?.orderStatus === 'RECEIVED' && (
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

                    {orderDetail?.orderStatus === 'DELIVERED' && (
                        <div >

                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setIsOpenRefundRequestDialog(true)}
                                    className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200 mr-4"
                                    style={{ backgroundColor: redColor }}

                                >
                                    Refund request
                                </button>
                                <button
                                    onClick={() => _handleChangeOrderStatus('RECEIVED')}
                                    className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200"
                                    style={{ backgroundColor: greenColor }}

                                >
                                    Recieved
                                </button>


                            </div>


                        </div>
                    )}

                    {['NOT_VERIFY'].includes(orderDetail?.orderStatus || '') && (
                        <div className="mt-0 border-t pt-4 flex">
                            <div className={`w-full md:w-2/5 mt-6 md:mt-0`}>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex justify-between border-b pb-2">
                                        <p className="text-gray-600 text-sm">Min price</p>
                                        <p className="text-gray-600 text-sm">
                                            {totalPrices.min !== undefined
                                                ? __handleAddCommasToNumber(totalPrices.min * (orderDetail?.quantity ?? 0))
                                                : 'Loading'} VND
                                        </p>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <p className="text-gray-600 text-sm">Max price</p>
                                        <p className="text-gray-600 text-sm">
                                            {totalPrices.max !== undefined
                                                ? __handleAddCommasToNumber(totalPrices.max * (orderDetail?.quantity ?? 0))
                                                : 'Loading'} VND
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* {orderDetail?.orderStatus === 'PENDING' && (
                        <div className="mt-0 border-t pt-4 flex">
                            <div className={`w-full md:w-2/5 mt-6 md:mt-0`}>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex justify-between border-b pb-2">
                                        <p className="text-gray-600 text-sm">Min price</p>
                                        <p className="text-gray-600 text-sm">{totalPrices.min ? __handleAddCommasToNumber(totalPrices.min * orderDetail.quantity) : 'Loading'} VND</p>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <p className="text-gray-600 text-sm">Max price</p>
                                        <p className="text-gray-600 text-sm">{totalPrices.max ? __handleAddCommasToNumber(totalPrices.max * orderDetail.quantity) : 'Loading'} VND</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}




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

            <Dialog open={isOpenSystemShippingPriceDialog} onClose={() => setIsOpenSystemShippingPriceDialog(false)}>
                <DialogTitle>
                    <h2 className="text-md font-semibold mb-4 ">System shipping price</h2>
                    <IoMdCloseCircleOutline
                        cursor="pointer"
                        size={20}
                        color={redColor}
                        onClick={() => setIsOpenSystemShippingPriceDialog(false)}
                        style={{ position: 'absolute', right: 20, top: 20 }}
                    />
                </DialogTitle>
                <DialogContent >
                    <img src='https://res.cloudinary.com/dby2saqmn/image/upload/v1723104960/size_information/e9abdgvmekwyiffcvuxf.png' style={{}}>
                    </img>
                </DialogContent>
            </Dialog>

            <CustomerReportOrderDialogComponent
                isCancelOrder={false}
                orderID={orderDetail?.orderID}
                onClose={__handleCloseReportDialog}
                isOpen={isOpenReportOrderDialog}
                order={orderDetail}
            ></CustomerReportOrderDialogComponent>

            <CustomerReportOrderDialogComponent
                isCancelOrder={true}
                orderID={orderDetail?.orderID}
                onClose={() => setIsOpenReportOrderCanceledDialog(false)}
                isOpen={isOpenReportOrderCanceledDialog}
                onClickReportAndCancel={() => _handleChangeOrderStatus('CANCEL')}
            ></CustomerReportOrderDialogComponent>

            {
                orderDetail?.orderStatus === 'RECEIVED' && !orderDetail?.rating && (

                    <Dialog open={isOpenRatingDialog} onClose={() => setIsOpenRatingDialog(false)}>
                        <DialogTitle>
                            <h2 className="text-md font-semibold mb-4 ">Rating</h2>
                        </DialogTitle>

                        <DialogContent style={{ textAlign: 'center' }} >
                            <form className='flex items-center mt-0 px-12'>
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
                                onClick={__handleSubmitRating}
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
                )
            }

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

                    {reportReason.map((report) => (

                        <div className="p-4 border-b border-gray-200">
                            <strong>Reason for Cancellation</strong>
                            <p>{report.content}</p>
                        </div>
                    ))}
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
                        onClick={() => _handleChangeOrderStatus('CANCEL')}
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


            <Dialog open={isOpenSuspendedDialog} aria-labelledby="popup-dialog-title" maxWidth="xs" fullWidth onClose={() => setIsOpenSuspendedDialog(false)}>
                <DialogTitle id="popup-dialog-title">
                    Suspended status
                    <IoMdCloseCircleOutline
                        cursor="pointer"
                        size={20}
                        color={redColor}
                        onClick={() => setIsOpenSuspendedDialog(false)}
                        style={{ position: 'absolute', right: 20, top: 20 }}
                    />
                </DialogTitle>
                <DialogContent >
                    <div className='mt-0 text-sm'>
                        Sorry! Some stage of processing be delayed, Do you still want to extend time to success this order?
                    </div>
                    <div className='mt-2 text-sm'>
                        If you do not want to extend, We will refund this order in the next time.
                    </div>
                </DialogContent>
                <DialogActions>

                    <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white"
                        onClick={() => _handleChangeOrderStatus('CANCEL')}
                        style={{
                            borderRadius: 4,
                            color: whiteColor,
                            backgroundColor: redColor,
                        }}
                    >
                        Cancel Order
                    </button>

                    <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white"
                        onClick={() => _handleChangeOrderStatus('SUSPENDED')}
                        style={{
                            borderRadius: 4,
                            color: whiteColor,
                            backgroundColor: greenColor,
                        }}
                    >
                        Extend time
                    </button>


                </DialogActions>

            </Dialog>

            <Dialog open={isOpenMaterialDetailDialog} aria-labelledby="popup-dialog-title" maxWidth="lg" fullWidth onClose={() => setIsOpenMaterialDetailDialog(false)}>
                <DialogTitle id="popup-dialog-title">
                    Material detail
                    <IoMdCloseCircleOutline
                        cursor="pointer"
                        size={20}
                        color={redColor}
                        onClick={() => setIsOpenMaterialDetailDialog(false)}
                        style={{ position: 'absolute', right: 20, top: 20 }}
                    />
                </DialogTitle>
                <DialogContent >
                    <div className='mb-5'>
                        <MaterialDetailTableComponent materialDetailData={orderDetail?.designResponse.materialDetail}></MaterialDetailTableComponent>
                    </div>
                    <div>
                        <PartOfClothAndPriceDetailTableComponent designMaterialDetailData={orderDetail?.designMaterialDetailResponseList}></PartOfClothAndPriceDetailTableComponent>
                    </div>
                </DialogContent>


            </Dialog>

            <RefunctionRequestDialogComponent
                isOpen={isOpenRefundRequestDialog}
                onClickReportAndCancel={() => _handleChangeOrderStatus('REFUND_REQUEST')}
                onClose={() => setIsOpenRefundRequestDialog(false)}
                order={orderDetail}
                orderID={orderDetail?.orderID}
            />


            {orderDetail?.orderStatus === 'DEPOSIT' && !orderDetail.paymentList && (
                <Dialog open={true}>
                    <DialogTitle>Payment service error</DialogTitle>
                    <DialogContent>
                        Sorry, somthing wrong with payment service! You can reorder!
                    </DialogContent>
                    <DialogActions>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium text-white"
                            onClick={() => window.history.back()}
                            style={{
                                borderRadius: 4,
                                color: whiteColor,
                                backgroundColor: greenColor,
                            }}
                        >
                            Reorder
                        </button>
                    </DialogActions>
                </Dialog>
            )}


            <FooterComponent />

        </div >
    );
};

export default OrderDetailScreen;
