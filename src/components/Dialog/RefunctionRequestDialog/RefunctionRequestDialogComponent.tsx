import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { errorColor, primaryColor, redColor, whiteColor } from '../../../root/ColorSystem';
import styles from './RefunctionRequestDialogComponentStyle.module.scss'
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
import { clothTag } from '../../../assets';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onClickReportAndCancel?: () => Promise<void>;
    orderID?: any;
    order?: OrderDetailInterface
}
const RefunctionRequestDialogComponent: React.FC<Props> = ({ order, isOpen, onClose, onClickReportAndCancel, orderID }) => {

    //TODO MUTIL LANGUAGE

    // ---------------UseState Variable---------------//
    const [images, setImages] = useState<File[]>([]);
    const [comment, setComment] = useState<string>('');
    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
    const [errorImg, setErrorImg] = useState<string>('');
    const [userAuth, setUserAuth] = useState<UserInterface>();




    // ---------------Usable Variable---------------//

    // ---------------UseEffect---------------//

    useEffect(() => {
        const userStorage = Cookies.get('userAuth');
        if (userStorage) {
            const userParse: UserInterface = JSON.parse(userStorage);
            setUserAuth(userParse)

        }
    }, [])

    // ---------------FunctionHandler---------------//


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
                reader.onerror = error => reject(error);
            });
        };

        try {
            const imagePromises = images.map(file => fileToBase64(file));
            const imageBase64s = await Promise.all(imagePromises);

            const reportImageList = images.map((image, index) => ({
                reportImageName: image.name,
                reportImageUrl: imageBase64s[index]
            }));


            const bodyData = {
                typeOfReport: "REFUND_REQUEST",
                orderID,
                userID: userAuth?.userID,
                content: comment,
                reportImageList
            };

            const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.report + functionEndpoints.report.createOrderReport}`, bodyData, __getToken());

            if (response.status === 200) {
                setIsLoadingPage(false);
                toast.success(`${response.message}`, { autoClose: 4000 });
                if (onClickReportAndCancel) {
                    await onClickReportAndCancel()
                }

                const user: UserInterface = __getUserLogined();
                const bodyRequest = {
                    senderID: user.userID,
                    recipientID: order?.employeeID,
                    action: "CREATE",
                    type: "REPORT",
                    targetID: order?.orderID,
                    message: ""
                }
                console.log(bodyRequest);
                __handleSendNotification(bodyRequest);

                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                setIsLoadingPage(false);
            }
        } catch (error) {
            console.log('error: ', error);
            setIsLoadingPage(false);
        }
    };

    const __handleOnclickReportAndCancel = async () => {

    }


    return (
        <>
            <LoadingComponent isLoading={isLoadingPage}></LoadingComponent>
            <Dialog open={isOpen} style={{ zIndex: 99 }} maxWidth='md' fullWidth>
                <DialogTitle>
                    Refund request
                    <IoMdCloseCircleOutline
                        cursor="pointer"
                        size={20}
                        color={redColor}
                        onClick={onClose}
                        style={{ position: 'absolute', right: 20, top: 20 }}
                    />
                </DialogTitle>
                <DialogContent className={`${styles.orderPolicyDialog__content}  bg-gray-100 flex flex-col items-center `}>



                    <div className="w-full max-w-3xl bg-white p-6 shadow-md rounded-md mt-6">
                        <h2 className="text-md font-semibold ">Order {order?.orderID}</h2>

                        <div className='flex items-center justify-center -mt-16'>
                            <div
                                className="w-1/2"
                                style={{
                                    width: 150,  // Swap width and height since it will be rotated
                                    height: 300,
                                    transform: 'rotate(270deg)', // Rotate 90 degrees
                                    margin: '0 auto',
                                    marginLeft: 100
                                }}
                            >
                                <img
                                    src={clothTag}
                                    style={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    alt=""
                                />
                                <p
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%) rotate(90deg)',
                                        fontSize: 10,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        width: '200px'
                                    }}
                                >
                                    [SMT]-{order?.orderID}-#######
                                </p>
                            </div>
                            <div className="p-4 w-1/2">
                                <span className="block mb-2" style={{fontSize: 11}}>* Each product or batch of products comes with a cloth tag.</span>
                                <span className="block mb-2" style={{fontSize: 11}}>* Please take a picture of the product along with the cloth tag.</span>
                                <span className="block mb-2" style={{fontSize: 11}}>* The cloth tag must be clearly visible in the photo.</span>
                                <span className="block mb-2" style={{fontSize: 11}}>* Please take pictures of the products or batches of products that do not meet the requirements or need to be returned.</span>
                                <span className="block mb-2" style={{fontSize: 11}}>*We will not address cases where the cloth tag is not photographed, the photo is unclear, or the defect on the product is not accurately shown.</span>
                            </div>

                        </div>





                        <form onSubmit={__handleSubmit}>

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
                                <span style={{ fontSize: 13, color: errorColor }}>{errorImg}</span>
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
                                <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">
                                    Reasons
                                </label>
                                <textarea
                                    id="comment"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 "
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
                </DialogActions>
            </Dialog>
        </>


    );
};

export default RefunctionRequestDialogComponent;
