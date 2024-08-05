import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { baseURL, versionEndpoints, featuresEndpoints, functionEndpoints } from '../../../../api/ApiConfig';
import { UserInterface } from '../../../../models/UserModel';

const WaitingProcessComponent: React.FC = () => {
    const [statusBrandInformation, setStatusBrandInformation] = useState(() => {
        return localStorage.getItem('brandStatus') || 'PENDING';
    });

    const [brandInfo, setBrandInfo] = useState<{ userID: string, email: string } | null>(null);

    useEffect(() => {
        const BRANDROLECHECK = Cookies.get('userAuth');
        const getBrandFromSingUp = sessionStorage.getItem('userRegister');

        if (BRANDROLECHECK) {
            try {
                const parsedAuth = JSON.parse(BRANDROLECHECK);
                setBrandInfo({
                    userID: parsedAuth.userID,
                    email: parsedAuth.email
                });
            } catch (error) {
                console.error('Error parsing userAuth cookie:', error);
            }
        } else if (getBrandFromSingUp) {
            try {
                const parsedSignUp: UserInterface = JSON.parse(getBrandFromSingUp);
                setBrandInfo({
                    userID: parsedSignUp.userID,
                    email: parsedSignUp.email
                });
            } catch (error) {
                console.error('Error parsing userRegister from sessionStorage:', error);
            }
        } else {
            console.error('No user data found');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('brandStatus', statusBrandInformation);
    }, [statusBrandInformation]);

    const fetchBrandInformation = useCallback(async () => {
        if (!brandInfo) return;

        try {
            const response = await axios.get(`${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.getBrandByID}/${brandInfo.userID}`);
            const brandStatus = response.data.data.brandStatus;
            setStatusBrandInformation(brandStatus);
            if (brandStatus === "ACCEPT") {
                window.location.href = "/brand";
            }
        } catch (error) {
            console.error("Error fetching brand information:", error);
        }
    }, [brandInfo]);

    useEffect(() => {
        fetchBrandInformation();
        const interval = setInterval(fetchBrandInformation, 10000);
        return () => clearInterval(interval);
    }, [fetchBrandInformation]);

    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        ACCEPT: 'bg-green-100 text-green-700',
        REJECT: 'bg-red-100 text-red-700'
    };

    const steps = [
        { label: 'Application received', completed: true },
        { label: 'Review completed', completed: statusBrandInformation !== 'PENDING' },
        { label: 'Decision made', completed: statusBrandInformation === 'ACCEPT' || statusBrandInformation === 'REJECT' }
    ];

    return (
        <div className="bg-gradient-to-br from-orange-100 to-yellow-50 min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
                <div className="p-8 md:p-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center">
                        Application Status
                    </h2>
                    <motion.div
                        className="flex justify-center items-center mb-8"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className={`text-2xl font-semibold px-6 py-3 rounded-full ${statusColors[statusBrandInformation as keyof typeof statusColors]}`}>
                            {statusBrandInformation}
                        </span>
                    </motion.div>
                    <p className="text-xl text-gray-600 mb-8 text-center">
                        We're currently reviewing your application. We'll update you via email.
                    </p>
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={`w-10 h-10 ${step.completed ? 'bg-orange-500' : 'bg-gray-300'} rounded-full flex items-center justify-center mr-4 transition-colors duration-300`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-lg text-gray-700">{step.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-50 px-8 py-6 flex justify-center space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full transition duration-300 shadow-md"
                    >
                        <a href='/' className="text-inherit no-underline">Home</a>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-full transition duration-300 shadow-md"
                    >
                        <a href='/' className="text-inherit no-underline">Contact Us</a>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default WaitingProcessComponent;