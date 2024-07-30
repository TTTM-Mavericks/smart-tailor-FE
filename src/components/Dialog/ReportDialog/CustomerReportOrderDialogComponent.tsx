import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { errorColor, primaryColor, redColor, whiteColor } from '../../../root/ColorSystem';
import styles from './CustomerReportOrderDialogComponentStyle.module.scss'
import { IoMdCloseCircleOutline, IoMdTrash } from 'react-icons/io';
import LoadingComponent from '../../Loading/LoadingComponent';
import { OrderDetailInterface } from '../../../models/OrderModel';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { toast } from 'react-toastify';
import { use } from 'i18next';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onClick?: () => void;
    orderID?: any;
}
const CustomerReportOrderDialogComponent: React.FC<Props> = ({ isOpen, onClose, onClick, orderID }) => {

    //TODO MUTIL LANGUAGE

    // ---------------UseState Variable---------------//
    const [images, setImages] = useState<File[]>([]);
    const [comment, setComment] = useState<string>('');
    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
    const [errorImg, setErrorImg] = useState<string>('');



    // ---------------Usable Variable---------------//

    // ---------------UseEffect---------------//

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

        const reportImageList = images.map(image => ({
            reportImageName: image.name,
            reportImageUrl: URL.createObjectURL(image)
        }));

        const bodyData = {
            typeOfReport: "Order report",
            orderID,
            content: comment,
            reportImageList
        };

        try {
            const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.report + functionEndpoints.report.createOrderReport}`, bodyData);
            if (response.status === 200) {
                setIsLoadingPage(false);
                toast.success(`${response.message}`, { autoClose: 4000 })
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

    return (
        <>
            <LoadingComponent isLoading={isLoadingPage}></LoadingComponent>
            <Dialog open={isOpen} style={{ zIndex: 99 }} maxWidth='md' fullWidth>
                <DialogTitle>
                    Order report
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
                        <h2 className="text-md font-semibold mb-4 ">Order #{orderID}</h2>
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
                                    Comment
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
                        onClick={__handleReportOrder}
                    >
                        Submit
                    </button>
                </DialogActions>
            </Dialog>
        </>


    );
};

export default CustomerReportOrderDialogComponent;
