import React, { useEffect, useState } from 'react';
import { Dialog, Tabs, Tab } from '@mui/material';
import { FaTimes, FaClipboardCheck, FaUser, FaBuilding, FaCalendar, FaCalendarCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api, { versionEndpoints, featuresEndpoints, functionEndpoints } from '../../../../../api/ApiConfig';
import { toast } from 'react-toastify';
import { SampleModelInterface } from '../../../../../models/OrderModel';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { __getToken } from '../../../../../App';

type Props = {
    isOpen: boolean;
    onClose?: () => void;
    orderID?: string;
    brandID?: any;
};

const ViewSampleUpdateDialog: React.FC<Props> = ({ isOpen, onClose, orderID }) => {
    const [sampleProductData, setSampleProductData] = useState<SampleModelInterface[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [groupedData, setGroupedData] = useState<{ [key: string]: SampleModelInterface[] }>({});

    useEffect(() => {
        if (!isOpen) return;
        __handleFetchOrderData();
    }, [isOpen]);

    useEffect(() => {
        // Group the data by stage whenever sampleProductData changes
        const grouped = sampleProductData.reduce((acc: any, item) => {
            const stage = item.stage || 'Unknown';
            if (!acc[stage]) acc[stage] = [];
            acc[stage].push(item);
            return acc;
        }, {});
        setGroupedData(grouped);
    }, [sampleProductData]);

    const __handleFetchOrderData = async () => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.SampleProduct + functionEndpoints.SampleProduct.getSamplePriductByParentOrderID}/${orderID}`);
            if (response.status === 200) {
                console.log(response.data);
                setSampleProductData(response.data);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            toast.error(`${error}`, { autoClose: 4000 });
            console.log(error);
        }
    };

    const __handleSchangeStatusOfSampleProduct = async (childID: any, itemSample: SampleModelInterface) => {
        console.log('itemSample', itemSample);
        try {
            const bodyRequest = {
                orderStageID: itemSample.orderStageID,
                orderID: childID,
                brandID: itemSample.brandID,
                description: itemSample.description || '',
                imageUrl: itemSample.imageUrl || '',
                video: itemSample.video || '',
                status: true,
            };

            console.log('bodyRequest: ', bodyRequest);

            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.SampleProduct + functionEndpoints.SampleProduct.updateSampleProductStatus}/${itemSample.sampleModelID}`, bodyRequest, __getToken());
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                console.log(response.message);
                await __handelUpdateOrderState(childID, itemSample);
                // setGroupedData((prevGroupedData) => {
                //     const updatedGroup = prevGroupedData[childID].map((sample) =>
                //         sample.sampleModelID === itemSample.sampleModelID ? { ...sample, status: true } : sample
                //     );
                //     return { ...prevGroupedData, [childID]: updatedGroup };
                // });

            }
            else {
                console.log('detail error: ', response.message);
                toast.error(`${response.message}`, { autoClose: 4000 });
            }
        } catch (error) {
            console.log(error);
            toast.error(`${error}`, { autoClose: 4000 });
        }
    };

    const __handelUpdateOrderState = async (orderParentID: any, itemData: SampleModelInterface) => {
        try {
            const bodyRequest = {
                orderID: orderParentID,
                status: itemData.stage
            };
            console.log('bodyRequest 2: ', bodyRequest);
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.changeOrderStatus}`, bodyRequest, __getToken());
            if (response.status === 200) {
                console.log('detail order: ', response.data);
                toast.success(`${response.message}`, { autoClose: 4000 });
            } else {
                console.log('detail error: ', response.message);
                toast.error(`${response.message}`, { autoClose: 4000 });
            }
        } catch (error) {
            console.log('error: ', error);
            toast.error(`${error}`, { autoClose: 4000 });
        }
    };

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
                            <p className="text-sm font-bold text-indigo-700 ml-2">{orderID}</p>
                        </div>
                    </div>

                    {Object.keys(groupedData).length > 0 ? (
                        <>
                            <Tabs
                                value={activeTab}
                                onChange={(_: any, newValue: any) => setActiveTab(newValue)}
                                variant="scrollable"
                                scrollButtons="auto"
                                className="mb-6"
                            >
                                {Object.keys(groupedData).map((stage, index) => (
                                    <Tab key={stage} label={stage} />
                                ))}
                            </Tabs>

                            {Object.entries(groupedData).map(([stage, items], index) => (
                                <TabPanel key={stage} value={activeTab} index={index}>
                                    {items.map((item) => (
                                        <SampleCard key={item.sampleModelID} item={item} onAccept={() => __handleSchangeStatusOfSampleProduct(item.orderID, item)} onReject={onClose} />
                                    ))}
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

const SampleCard: React.FC<{ item: SampleModelInterface; onAccept: (item: SampleModelInterface) => void; onReject?: () => void }> = ({ item, onAccept, onReject }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
            <h3 className="text-sm font-semibold text-indigo-700 mb-4">Sample Model ID: {item.sampleModelID}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                    { icon: FaUser, label: 'Stage', value: item.stage },
                    { icon: FaBuilding, label: 'Brand', value: item.brandName },
                    { icon: FaCalendar, label: 'Create Date', value: item.createDate },
                    { icon: FaCalendarCheck, label: 'Last Modified Date', value: item.lastModifiedDate || 'N/A' },
                ].map((detail, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 flex items-center mb-1">
                            <detail.icon className="mr-2 text-indigo-500" size={16} />
                            <span className="text-sm font-semibold">{detail.label}:</span>
                        </p>
                        <p className="text-sm font-bold text-gray-800">{detail.value}</p>
                    </div>
                ))}
            </div>

            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">
                    {item.description}
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                {item.imageUrl && (
                    <div className="flex-1">
                        <h4 className="text-md font-semibold text-gray-700 mb-2">Sample Image</h4>
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
                        <h4 className="text-md font-semibold text-gray-700 mb-2">Sample Video</h4>
                        <video
                            src={item.video}
                            controls
                            className="w-full h-64 object-cover rounded-lg shadow-md"
                            style={{ width: 400, height: 450, margin: '0 auto' }}
                        />
                    </div>
                )}
            </div>

            {!item.status && (
                <div className="flex justify-center items-center space-x-4 mt-6">
                    <button
                        onClick={() => onAccept(item)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                    >
                        <FaClipboardCheck />
                        <span>Accept</span>
                    </button>

                    <button
                        onClick={onReject}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                    >
                        <FaTimes />
                        <span>Reject</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ViewSampleUpdateDialog;
