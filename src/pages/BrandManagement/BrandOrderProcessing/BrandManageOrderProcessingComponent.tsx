import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { greenColor, redColor, secondaryColor } from '../../../root/ColorSystem';
import style from './BrandManageOrderProcessingComponentStyle.module.scss'
import CancelOrderPolicyDialogComponent from '../../../components/Dialog/PolicyDialog/CancelOrderPolicyDialogComponent';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { OrderDetailInterface } from '../../../models/OrderModel';
import { PaymentOrderInterface } from '../../../models/PaymentModel';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { UserInterface } from '../../../models/UserModel';
import Cookies from 'js-cookie';
import { FaCheck } from "react-icons/fa";

const BrandManageOrderProcessingComponent: React.FC = () => {
    // TODO MUTIL LANGUAGE

    // ---------------UseState---------------//


    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [isOpenCancelOrderPolicyDialog, setIsOpenCancelOrderPolicyDialog] = useState<boolean>(false);
    const [isChangeOrderProcessDialog, setIsChangeOrderProcessDialog] = useState<boolean>(false);

    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
    const [orderDetailList, setOrderDetailList] = useState<OrderDetailInterface[]>();
    const [payment, setPayment] = useState<PaymentOrderInterface[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedAddress, setSelectedAddress] = useState<any>();
    const [isChangeAddressDialogOpen, setIsChangeAddressDialogOpen] = useState<boolean>(false);
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>('');
    const [isOpenReportOrderDialog, setIsOpenReportOrderDialog] = useState<boolean>(false);
    const [isOpenRatingDialog, setIsOpenRatingDialog] = useState<boolean>(false);
    const [isOpenReasonCancelDialog, setIsOpenReasonCancelDialog] = useState<boolean>(false);
    const [userAuth, setUserAuth] = useState<UserInterface>();
    const [openOrderDetail, setOpenOrderDetail] = useState<OrderDetailInterface | null>(null);

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

        // currentStep: orderDetail?.orderStatus === 'NOT_VERIFY' ? 0 : 1,
        currentStep1: 2,
        progressDate: 'March 24, 2021'
    };

    const progressSteps = [
        'PENDING',
        'START_PRODUCING',
        'FINISH_FIRST_STAGE',
        'FINISG_SECOND_STAGE',
        'COMPLETED'
    ]
    // ---------------UseEffect---------------//

    // useEffect(() => {
    //     if (orderDetail?.orderStatus === 'SUCESSFULL') {
    //         setIsOpenRatingDialog(true);
    //     }
    // }, [orderDetail])

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
        const userStorage = Cookies.get('userAuth');
        if (userStorage) {
            console.log(userStorage);
            const userParse: UserInterface = JSON.parse(userStorage);
            setUserAuth(userParse);
            __handleGetOrderDetail(userParse.userID);
        }
    }, [])

    useEffect(() => {
        console.log('userAuth: ', userAuth);
    }, [userAuth])

    // ---------------FunctionHandler---------------//

    //+++++ API +++++//
    /**
     * Handle get order detail data
     */
    const __handleGetOrderDetail = async (id: any) => {
        setIsLoading(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderByBrandId}/${id}`);
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                setOrderDetailList(response.data);
                setPayment(response.data.paymentList);
                setIsLoading(false)
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
        setIsChangeOrderProcessDialog(false);
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
    const _handleCancelOrder = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to cancel the order?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!',
            customClass: {
                popup: style.high__zindex,
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Cancelled!',
                    'Your order has been cancelled.',
                    'success'
                )
            }
        })
    };

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
            // navigate(`/design_detail/${orderDetail?.designResponse.designID}`)
            setIsLoading(false);
        }, 1000)
    }

    const __handleOpenReportDialog = () => {
        setIsOpenReportOrderDialog(true);
    }

    const __handleOpenDialog = (orderDetail: OrderDetailInterface) => {
        setOpenOrderDetail(orderDetail);
    };

    const __handleCloseDialog = () => {
        setOpenOrderDetail(null);
    };

    const calculateProgressWidth = (status: string) => {
        const index = progressSteps.indexOf(status);
        return ((index + 1) / progressSteps.length) * 100;
    };

    return (
        <div className={`${style.orderProcessing__container}`} >
            <div className={`${style.orderProcessing__container__group}`} style={{ marginTop: '2%', marginBottom: '10%' }}>
                <div className={`${style.orderProcessing__container__detail} px-12 bg-white md:flex-row`}>
                    {orderDetailList?.map((orderDetail) => (
                        <>
                            <div key={orderDetail.orderID} className="border-b pb-4 mb-6">
                                <p className="text-sm text-gray-700 flex mb-10">
                                    <span style={{ fontWeight: "bolder" }}>#{orderDetail?.orderID}</span>
                                    <span className="ml-auto text-sm text-gray-700 cursor-pointer" onClick={__handleOpenReportDialog}>Report</span>
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span style={{ fontWeight: "normal" }}>{orderDetail?.expectedStartDate}</span>
                                </p>
                                <div className="flex flex-col md:flex-row items-start mb-6">
                                    <img src={orderDetail?.designResponse.imageUrl} alt={orderDetail?.designResponse.imageUrl} className="w-40 h-52 object-cover rounded-md shadow-md mb-4 md:mb-0" />
                                    <div className="md:ml-6 w-1/2" style={{ width: '100%' }}>
                                        <h2 className="text-1xl font-semibold text-gray-900">{orderDetail?.designResponse.titleDesign}</h2>
                                        <p className="text-sm text-gray-700">{orderDetail?.totalPrice}</p>
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
                                        <div className="flex flex-col md:flex-row md:space-x-10 mt-4" style={{ width: '100%' }}>
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center">
                                                    <div className={style.orderProcessing__orderStatus__tag} style={orderDetail?.orderStatus === 'CANCEL' ? { backgroundColor: 'red' } : {}}>{orderDetail?.orderStatus}</div>
                                                    {orderDetail?.orderStatus === 'CANCEL' && (
                                                        <div className="ml-10">
                                                            <a onClick={() => setIsOpenReasonCancelDialog(!isOpenReasonCancelDialog)} className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200 cursor-pointer">View reasons</a>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='text-sm'>
                                                    <button
                                                        onClick={() => __handleOpenDialog(orderDetail)}
                                                        className="px-4 py-2 text-white rounded-md  transition duration-200 ml-auto"
                                                        style={{ backgroundColor: greenColor }}
                                                    >
                                                        Update order
                                                    </button>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                                {/* Progress Bar */}
                                {openOrderDetail && openOrderDetail.orderID === orderDetail.orderID && (
                                    <Dialog open={true} onClose={__handleCloseDialog} aria-labelledby="popup-dialog-title" maxWidth="lg" fullWidth>
                                        <DialogTitle id="popup-dialog-title">Order Progress</DialogTitle>
                                        <IoMdCloseCircleOutline
                                            cursor={'pointer'}
                                            size={20}
                                            color={redColor}
                                            onClick={__handleCloseDialog}
                                            style={{ position: 'absolute', right: 20, top: 20 }}
                                        />
                                        <DialogContent dividers>
                                            <div className="pt-4 mb-20">
                                                <p className="text-sm text-gray-600 mb-2">Progress Date: {orderDetail.productionCompletionDate}</p>
                                                <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
                                                    <div className="absolute top-0 left-0 h-2 bg-indigo-600 rounded-full" style={{ width: `${calculateProgressWidth(orderDetail.orderStatus)}%` }}></div>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    {progressSteps.map((step, index) => {
                                                        const isCompleted = index < progressSteps.indexOf(orderDetail.orderStatus);
                                                        const isCurrent = index === progressSteps.indexOf(orderDetail.orderStatus);
                                                        return (
                                                            <p key={index} className={`text-center ${isCompleted ? 'text-green-600' : isCurrent ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                                <button
                                                                    className=" flex justify-center items-center px-4 py-2 text-white rounded-md transition duration-200 ml-auto"
                                                                    style={{
                                                                        backgroundColor: isCompleted ? '#CBCBCB' : isCurrent ? secondaryColor : '#CBCBCB',
                                                                    }}
                                                                >
                                                                    {isCompleted && (<FaCheck color={greenColor} style={{ marginRight: 10 }} size={12}></FaCheck>)}
                                                                    {step}
                                                                </button>
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}


                                {/* Billing and Payment Information Section */}
                                {orderDetail?.orderStatus === 'CANCEL' && (
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={__handleOpenReportDialog}
                                            className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200 mr-4"
                                            style={{ backgroundColor: 'red' }}
                                        >
                                            Report
                                        </button>
                                        <button
                                            onClick={__handleReorder}
                                            className="px-4 py-2 text-white rounded-md hover:bg-red-700 transition duration-200"
                                            style={{ backgroundColor: 'green' }}
                                        >
                                            Reorder
                                        </button>
                                    </div>
                                )}
                                {showScrollButton && (
                                    <IconButton
                                        style={{
                                            position: 'fixed',
                                            bottom: '20px',
                                            right: '20px',
                                            zIndex: 100,
                                            backgroundColor: 'primaryColor',
                                            color: "white"
                                        }}
                                        onClick={_handleScrollToTop}
                                    >
                                        <ArrowUpward />
                                    </IconButton>
                                )}

                            </div>
                        </>
                    ))}
                </div>
            </div>

            {/* DIALOG */}
            <CancelOrderPolicyDialogComponent onClick={_handleCancelOrder} onClose={__handleCloseCancelOrderPolicyDilog} isOpen={isOpenCancelOrderPolicyDialog}></CancelOrderPolicyDialogComponent>
            {/* <CustomerReportOrderDialogComponent orderID={orderDetail?.orderID} onClose={__handleCloseReportDialog} isOpen={isOpenReportOrderDialog}></CustomerReportOrderDialogComponent> */}



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




        </div>
    );
};

export default BrandManageOrderProcessingComponent;
