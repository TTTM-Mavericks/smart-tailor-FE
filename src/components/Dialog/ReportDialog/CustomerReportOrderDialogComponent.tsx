import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { primaryColor, redColor, whiteColor } from '../../../root/ColorSystem';
import styles from './CustomerReportOrderDialogComponentStyle.module.scss'
import { IoMdCloseCircleOutline, IoMdTrash } from 'react-icons/io';
import LoadingComponent from '../../Loading/LoadingComponent';
import { OrderDetailInterface } from '../../../models/OrderModel';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onClick?: () => void;
    orderID?: any;
}
const CustomerReportOrderDialogComponent: React.FC<Props> = ({ isOpen, onClose, onClick, orderID }) => {

    //TODO MUTIL LANGUAGE

    // ---------------UseState Variable---------------//
    const [isChecked, setIsChecked] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [comment, setComment] = useState<string>('');



    // ---------------Usable Variable---------------//

    // ---------------UseEffect---------------//

    // ---------------FunctionHandler---------------//


    const __handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const __handleButtonClick = () => {
        if (isChecked) {
            // Handle the button click event
            console.log('Button clicked');
        }
    };

    const __handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            setImages((prevImages) => [...prevImages, ...fileArray]);
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

    return (
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
            <DialogContent className={styles.orderPolicyDialog__content}>
                <div className="p-6 bg-gray-100 flex flex-col items-center justify-center">
                    <div className="w-full max-w-3xl bg-white p-6 shadow-md rounded-md">
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
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    placeholder="Write your comments here..."
                                />
                            </div>
                        </form>
                    </div>
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
                    onClick={onClick}
                >
                    Submit
                </button>
            </DialogActions>
        </Dialog>

    );
};

export default CustomerReportOrderDialogComponent;
