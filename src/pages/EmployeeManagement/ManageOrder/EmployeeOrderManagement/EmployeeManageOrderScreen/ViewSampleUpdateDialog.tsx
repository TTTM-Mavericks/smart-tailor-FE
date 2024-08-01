import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { IoMdCloseCircleOutline, IoMdTrash } from 'react-icons/io';
import style from './EmployeeManageOrderStyle.module.scss';
import { greenColor, primaryColor, redColor, whiteColor } from '../../../../../root/ColorSystem';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { toast } from 'react-toastify';
import { SampleModelInterface } from '../../../../../models/OrderModel';

type Props = {
    isOpen: boolean;
    onClose?: () => void;
    orderID?: string;
    brandID?: any
};

const ViewSampleUpdateDialog: React.FC<Props> = ({ isOpen, onClose, orderID, brandID }) => {
    const [description, setDescription] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [imageError, setImageError] = useState<string>('');
    const [videoError, setVideoError] = useState<string>('');
    const [sampleProductData, setSampleProductData] = useState<SampleModelInterface[]>();


    useEffect(() => {
        if (!isOpen) return
            __handleFetchOrderData()
    }, [isOpen])



    const __handleFetchOrderData = async () => {
        // setIsLoading(true)
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.SampleProduct + functionEndpoints.SampleProduct.getSamplePriductByParentOrderID}/${orderID}`);
            if (response.status === 200) {
                console.log(response.data);
                // setOrderDetailList(response.data);
                // setIsLoading(false)
                setSampleProductData(response.data);
            } else {
                toast.error(`${response.message}`, { autoClose: 4000 });
                console.log(response.message);
            }
            console.log(response);
        } catch (error) {
            toast.error(`${error}`, { autoClose: 4000 });
            console.log(error);

        }
    }


    const __handelUpdateOrderState = async (orderID: any) => {
        try {
            const bodyRequest = {
                orderID: orderID,
                status: 'START_PRODUCING'
            }
            console.log('bodyRequest: ', bodyRequest);
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest);
            if (response.status === 200) {
                console.log('detail order: ', response.data);
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
        }
    }

    return (
        <Dialog open={isOpen} aria-labelledby="dialog-title" maxWidth="md" fullWidth>
            <DialogTitle id="dialog-title">
                Sample Product
                <IoMdCloseCircleOutline
                    cursor="pointer"
                    size={20}
                    color="red"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />
            </DialogTitle>
            <DialogContent dividers className={`${style.sampleModel__dialogContent} bg-gray-100`}>
                <div className="p-4 bg-white shadow-md rounded-md">
                    <h2 className="text-lg font-semibold mb-4">Order {orderID}</h2>
                    {sampleProductData && sampleProductData?.length > 0 ? (
                        sampleProductData?.map((item) => (
                            <div key={item.sampleModelID} className="mb-4">
                                <h3 className="text-md font-semibold">Sample Model ID: {item.sampleModelID}</h3>
                                <p><strong>Sub Order ID:</strong> {item.orderID}</p>
                                <p><strong>Brand ID:</strong> {item.brandID}</p>
                                <p><strong>Description:</strong> {item.description}</p>
                                <p><strong>Create Date:</strong> {item.createDate}</p>
                                <p><strong>Last Modified Date:</strong> {item.lastModifiedDate || 'N/A'}</p>
                                {item.imageUrl && (
                                    <div className="mb-10 flex items-center justify-center" >
                                        <img
                                            src={item.imageUrl}
                                            alt="Sample"
                                            className="w-full h-auto rounded-md"
                                            style={{ width: 500, height: 550 }}
                                        />
                                    </div>
                                )}
                                {item.video && (
                                    <div className="mb-2 flex items-center justify-center">
                                        <video
                                            src={item.video}
                                            controls
                                            className="w-full h-auto rounded-md"
                                            style={{ width: 500, height: 550 }}
                                        />
                                    </div>
                                )}
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        className="px-5 py-2.5 text-sm font-medium text-white"
                                        style={{
                                            borderRadius: 4,
                                            color: whiteColor,
                                            backgroundColor: redColor,
                                        }}
                                        onClick={onClose}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        className="px-5 py-2.5 text-sm font-medium text-white"
                                        style={{
                                            borderRadius: 4,
                                            color: whiteColor,
                                            backgroundColor: greenColor,
                                        }}
                                        onClick={() => __handelUpdateOrderState(item.orderID)}
                                    >
                                        Accept
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p>No sample product data available.</p>
                    )}
                    <DialogActions>

                    </DialogActions>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewSampleUpdateDialog;
