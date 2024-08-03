import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab } from '@mui/material';
import { IoMdCloseCircleOutline, IoMdTrash } from 'react-icons/io';
import style from './ViewProgessOfProductDialogStyle.module.scss';
import { greenColor, primaryColor, redColor, whiteColor } from '../../../../../root/ColorSystem';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { toast } from 'react-toastify';
import { SampleModelInterface } from '../../../../../models/OrderModel';
import { FaBuilding, FaCalendar, FaCalendarCheck, FaClipboardCheck, FaTimes, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion'
type Props = {
    isOpen: boolean;
    onClose?: () => void;
    orderID?: string;
    brandID?: any,
    stageId?: any
};

const ViewProgessOfProductDialog: React.FC<Props> = ({ isOpen, onClose, orderID, brandID, stageId }) => {
    const [description, setDescription] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [imageError, setImageError] = useState<string>('');
    const [videoError, setVideoError] = useState<string>('');
    const [sampleProductData, setSampleProductData] = useState<SampleModelInterface[]>();
    const [activeTab, setActiveTab] = useState(0);


    useEffect(() => {
        if (!isOpen) return
        __handleViewHistory(orderID, stageId)
    }, [isOpen])


    const __handleViewHistory = async (orderId: any, stageId: any) => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.SampleProduct + functionEndpoints.SampleProduct.getsampleProductDataByParentOrderId}/${orderId}/${stageId}`);
            if (response.status === 200) {
                setSampleProductData(response.data)
            }
            else {
                console.log('detail error: ', response.message);
            }
        } catch (error) {
            console.log('error: ', error);
            toast.error(`${error}`, { autoClose: 4000 });
        }

    }



    return (
        <Dialog open={isOpen} maxWidth="lg" fullWidth>
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
                    className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
                    onClick={(e: any) => e.stopPropagation()}
                >
                    {/* <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-150"
                        aria-label="Close modal"
                    >
                        <FaTimes size={24} />
                    </button> */}
                    <IoMdCloseCircleOutline
                        cursor="pointer"
                        size={20}
                        color="red"
                        onClick={onClose}
                        style={{ position: 'absolute', right: 20, top: 20 }}
                    />
                    <h2 className="text-lg font-bold text-indigo-700 mb-6 shadow-text">View Sample Data</h2>

                    <div className="flex justify-between items-center mb-6 bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <FaClipboardCheck className="text-indigo-500 mr-2" size={20} />
                            <span className="text-sm font-semibold text-gray-700">Order ID:</span>
                            <span className="text-sm ml-2 font-bold text-indigo-700">{orderID}</span>
                        </div>
                    </div>

                    {sampleProductData && sampleProductData.length > 0 ? (
                        <>
                            <Tabs
                                value={activeTab}
                                onChange={(_: any, newValue: any) => setActiveTab(newValue)}
                                variant="scrollable"
                                scrollButtons="auto"
                                className="text-sm ml-2 font-bold text-indigo-700"

                            >
                                {sampleProductData.map((item, index) => (
                                    <Tab key={item.sampleModelID} label={`Sample ${index + 1}`} />
                                ))}
                            </Tabs>

                            {sampleProductData.map((item, index) => (
                                <TabPanel key={item.sampleModelID} value={activeTab} index={index}>
                                    <SampleCard item={item} />
                                </TabPanel>
                            ))}
                        </>
                    ) : (
                        <p className="text-center text-gray-600">No sample product data available.</p>
                    )}
                </motion.div>
            </motion.div>
        </Dialog>
    );
};

const TabPanel: React.FC<{ children: React.ReactNode; value: number; index: number }> = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && children}
        </div>
    );
};

const SampleCard: React.FC<{ item: SampleModelInterface; onAccept?: () => void; onReject?: () => void }> = ({ item, onAccept, onReject }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                    { icon: FaCalendar, label: 'Create Date', value: item.createDate },
                    { icon: FaCalendarCheck, label: 'Last Modified Date', value: item.lastModifiedDate || 'N/A' },
                ].map((detail, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 flex items-center mb-1">
                            <detail.icon className="mr-2 text-indigo-500" size={16} />
                            <span className=" text-sm font-semibold">{detail.label}:</span>
                            <p className="ml-2 text-sm font-bold text-gray-800">{detail.value}</p>
                        </p>
                    </div>
                ))}
            </div>

            <h4 className="text-lg font-semibold text-gray-700 mb-2">Sample Image</h4>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                {item.imageUrl && (
                    <div className="flex items-center justify-center">
                        <img
                            src={item.imageUrl}
                            alt="Sample"
                            className="object-cover rounded-lg shadow-md"
                            style={{ width: 400, height: 450, margin: '0 auto' }}
                        />
                    </div>
                )}

                {item.video && (
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Sample Video</h4>
                        <video
                            src={item.video}
                            controls
                            className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                    </div>
                )}
            </div>


        </div>
    );
};

export default ViewProgessOfProductDialog;
