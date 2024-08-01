import React, { useEffect, useState } from 'react';
import { Dialog, Tabs, Tab } from '@mui/material';
import { FaTimes, FaClipboardCheck, FaUser, FaBuilding, FaCalendar, FaCalendarCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api, { versionEndpoints, featuresEndpoints, functionEndpoints } from '../../../../../api/ApiConfig';
import { toast } from 'react-toastify';
import { SampleModelInterface } from '../../../../../models/OrderModel';

type Props = {
    isOpen: boolean;
    onClose?: () => void;
    orderID?: string;
    brandID?: any;
};

const ViewSampleUpdateDialog: React.FC<Props> = ({ isOpen, onClose, orderID, brandID }) => {
    const [sampleProductData, setSampleProductData] = useState<SampleModelInterface[]>([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!isOpen) return;
        __handleFetchOrderData();
    }, [isOpen]);

    const __handleFetchOrderData = async () => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.SampleProduct + functionEndpoints.SampleProduct.getSamplePriductByParentOrderID}/${orderID}`);
            if (response.status === 200) {
                console.log(response.data);
                setSampleProductData(response.data);
            } else {
                toast.error(`${response.message}`, { autoClose: 4000 });
                console.log(response.message);
            }
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
            } else {
                console.log('detail error: ', response.message);
                toast.error(`${response.message}`, { autoClose: 4000 });
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
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-150"
                        aria-label="Close modal"
                    >
                        <FaTimes size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-indigo-700 mb-6 shadow-text">View Sample Data</h2>

                    <div className="flex justify-between items-center mb-6 bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <FaClipboardCheck className="text-indigo-500 mr-2" size={20} />
                            <span className="font-semibold text-gray-700">Order ID:</span>
                            <p className="text-xl font-bold text-indigo-700 ml-2">{orderID}</p>
                        </div>
                    </div>

                    {sampleProductData && sampleProductData.length > 0 ? (
                        <>
                            <Tabs
                                value={activeTab}
                                onChange={(_, newValue) => setActiveTab(newValue)}
                                variant="scrollable"
                                scrollButtons="auto"
                                className="mb-6"
                            >
                                {sampleProductData.map((item, index) => (
                                    <Tab key={item.sampleModelID} label={`Sample ${index + 1}`} />
                                ))}
                            </Tabs>

                            {sampleProductData.map((item, index) => (
                                <TabPanel key={item.sampleModelID} value={activeTab} index={index}>
                                    <SampleCard item={item} onAccept={() => __handelUpdateOrderState(item.orderID)} onReject={onClose} />
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

const SampleCard: React.FC<{ item: SampleModelInterface; onAccept: () => void; onReject: () => void }> = ({ item, onAccept, onReject }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">Sample Model ID: {item.sampleModelID}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                    { icon: FaUser, label: 'Sub Order ID', value: item.orderID },
                    { icon: FaBuilding, label: 'Brand ID', value: item.brandID },
                    { icon: FaCalendar, label: 'Create Date', value: item.createDate },
                    { icon: FaCalendarCheck, label: 'Last Modified Date', value: item.lastModifiedDate || 'N/A' },
                ].map((detail, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 flex items-center mb-1">
                            <detail.icon className="mr-2 text-indigo-500" size={16} />
                            <span className="font-semibold">{detail.label}:</span>
                        </p>
                        <p className="text-sm font-bold text-gray-800">{detail.value}</p>
                    </div>
                ))}
            </div>

            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-inner">
                    {item.description}
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                {item.imageUrl && (
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Sample Image</h4>
                        <img
                            src={item.imageUrl}
                            alt="Sample"
                            className="w-full h-64 object-cover rounded-lg shadow-md"
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

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    onClick={onReject}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    Reject
                </button>
                <button
                    onClick={onAccept}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                    Accept
                </button>
            </div>
        </div>
    );
};

export default ViewSampleUpdateDialog;