import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { errorColor, primaryColor, redColor, whiteColor } from '../../../root/ColorSystem';
import styles from './FinalCheckingProductsDialogStyle.module.scss'
import { IoMdCloseCircleOutline, IoMdTrash } from 'react-icons/io';
import LoadingComponent from '../../Loading/LoadingComponent';
import { OrderDetailInterface } from '../../../models/OrderModel';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { toast } from 'react-toastify';
import { use } from 'i18next';
import Cookies from 'js-cookie';
import { UserInterface } from '../../../models/UserModel';
import { __getToken, __getUserLogined } from '../../../App';
import { __handleSendNotification } from '../../../utils/NotificationUtils';

type Props = {
    isOpen: boolean;
    onClose?: () => void;
    onClickReportAndCancel?: () => Promise<void>;
    orderID?: any;
    isCancelOrder?: boolean;
    order?: OrderDetailInterface | any;
};

const FinalCheckingProductsDialogComponent: React.FC<Props> = ({ order, isOpen, onClose, onClickReportAndCancel, orderID, isCancelOrder }) => {
    // ---------------UseState Variable---------------//
    const [images, setImages] = useState<File[]>([]);
    const [comment, setComment] = useState<string>('');
    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
    const [errorImg, setErrorImg] = useState<string>('');
    const [userAuth, setUserAuth] = useState<UserInterface>();
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const checkBoxOptions = [
        'Ensure quantity',
        'Ensure quality',
        'Ensure raw materials',
        // Add more options as needed
    ];

    useEffect(() => {
        const userStorage = Cookies.get('userAuth');
        if (userStorage) {
            const userParse: UserInterface = JSON.parse(userStorage);
            setUserAuth(userParse);
        }
    }, []);

    const __handleCheckboxChange = (option: string) => {
        setSelectedOptions((prevSelected) => {
            if (prevSelected.includes(option)) {
                return prevSelected.filter((item) => item !== option);
            } else {
                return [...prevSelected, option];
            }
        });
    };

    useEffect(() => {
        setComment(selectedOptions.join(', '));
    }, [selectedOptions]);

    const __handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            if (images.length + fileArray.length <= 5) {
                setImages((prevImages) => [...prevImages, ...fileArray]);
                setErrorImg('');
            } else {
                setErrorImg('You can only upload up to 5 images.');
            }
        }
    };

    const __handleRemoveImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const __handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Images:', images);
        console.log('Comment:', comment);
    };

    const __handleReportOrder = async () => {
        setIsLoadingPage(true);

        const fileToBase64 = (file: File) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
            });
        };

        try {
            const imagePromises = images.map((file) => fileToBase64(file));
            const imageBase64s = await Promise.all(imagePromises);

            const reportImageList = images.map((image, index) => ({
                reportImageName: image.name,
                reportImageUrl: imageBase64s[index],
            }));

            const bodyData = {
                typeOfReport: isCancelOrder ? 'CANCEL_ORDER' : 'REPORT_ORDER',
                orderID,
                userID: userAuth?.userID,
                content: comment,
                reportImageList,
            };

            const response = await api.post(
                `${versionEndpoints.v1 + featuresEndpoints.report + functionEndpoints.report.createOrderReport}`,
                bodyData,
                __getToken()
            );

            if (response.status === 200) {
                toast.success(`${response.message}`, { autoClose: 4000 });
                setTimeout(() => {
                    setIsLoadingPage(false);

                    window.location.reload();
                }, 1000);
                if (isCancelOrder && onClickReportAndCancel) {
                    await onClickReportAndCancel();
                }

                const user: UserInterface = __getUserLogined();
                const bodyRequest = {
                    senderID: user.userID,
                    recipientID: order?.designResponse.userID,
                    action: 'REPORT',
                    type: 'FINAL_CHECKING',
                    targetID: order?.orderID,
                    message: '',
                };
                
                await __handleSendNotification(bodyRequest);

            } else {
            }
        } catch (error) {
            console.log('error: ', error);
            setIsLoadingPage(false);
        }
    };

    return (
        <>
            <LoadingComponent isLoading={isLoadingPage}></LoadingComponent>
            <Dialog open={isOpen} style={{ zIndex: 99 }} maxWidth="md" fullWidth>
                <DialogTitle>
                    Upload final products
                    <IoMdCloseCircleOutline
                        cursor="pointer"
                        size={20}
                        color={redColor}
                        onClick={onClose}
                        style={{ position: 'absolute', right: 20, top: 20 }}
                    />
                </DialogTitle>
                <DialogContent
                    className={`${styles.orderPolicyDialog__content}  bg-gray-100 flex flex-col items-center `}
                >
                    <div className="w-full max-w-3xl bg-white p-6 shadow-md rounded-md mt-6">
                        <h2 className="text-md font-semibold mb-4 ">Order {orderID}</h2>
                        <form onSubmit={__handleSubmit}>
                            {!isCancelOrder && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Upload Images
                                        </label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={__handleImageChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        />
                                        <span style={{ fontSize: 13, color: errorColor }}>
                                            {errorImg}
                                        </span>
                                        <div className="mt-2 flex flex-wrap gap-4">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Upload Preview ${index + 1}`}
                                                        className="w-32 h-36 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => __handleRemoveImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                                                    >
                                                        <IoMdTrash size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Select Options
                                        </label>
                                        <div className="gap-4 mb-4">
                                            {checkBoxOptions.map((option) => (
                                                <div key={option} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={option}
                                                        checked={selectedOptions.includes(option)}
                                                        onChange={() => __handleCheckboxChange(option)}
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor={option}>{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="mb-4">
                                <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">
                                    {isCancelOrder ? 'Reasons' : 'Comments'}
                                </label>
                                <textarea
                                    id="comment"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    placeholder="Write your comments here..."
                                />
                            </div>
                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    {!isLoadingPage && (
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium text-white"
                            style={{
                                border: `1px solid ${primaryColor}`,
                                borderRadius: 4,
                                color: whiteColor,
                                marginBottom: 10,
                                marginRight: 10,
                                backgroundColor: primaryColor,
                            }}
                            onClick={() => __handleReportOrder()}
                        >
                            Submit
                        </button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FinalCheckingProductsDialogComponent;