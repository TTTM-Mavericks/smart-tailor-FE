import React, { useEffect, useState } from 'react';
import api, { baseURL, featuresEndpoints, functionEndpoints, isAuthenticated, versionEndpoints } from '../../../../api/ApiConfig';
import axios from 'axios';
import { UserInterface } from '../../../../models/UserModel';
import Cookies from 'js-cookie';
const WaitingProcessComponent: React.FC = () => {
    const dotsAnimation = `
        @keyframes hideUnhide {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
        }
    `;
    let brandAuth: any = null;

    const BRANDROLECHECK = Cookies.get('userAuth');

    if (BRANDROLECHECK) {
        try {
            brandAuth = JSON.parse(BRANDROLECHECK);
            const { userID, email, fullName, language, phoneNumber, roleName, imageUrl, userStatus } = brandAuth;
            // Your code that uses the parsed data
        } catch (error) {
            console.error('Error parsing JSON:', error);
            // Handle the error, perhaps by setting default values or showing an error message
        }
    } else {
        console.error('userAuth cookie is not set');
        // Handle the case when the cookie does not exist
    }


    let brandFromSignUp: any = null
    // Get BrandID from session
    const getBrandFromSingUp = sessionStorage.getItem('userRegister') as string | null;

    if (getBrandFromSingUp) {
        const BRANDFROMSIGNUPPARSE: UserInterface = JSON.parse(getBrandFromSingUp);
        const brandID = BRANDFROMSIGNUPPARSE.userID;
        const brandEmail = BRANDFROMSIGNUPPARSE.email;
        brandFromSignUp = { brandID, brandEmail }
        console.log(brandFromSignUp);

        console.log('Brand ID:', brandID);
        console.log('Brand Email:', brandEmail);
    } else {
        console.error('No user data found in session storage');
    }
    // Get ID When something null
    const getID = () => {
        if (!brandAuth || brandAuth.userID === null || brandAuth.userID === undefined || brandAuth.userID === '') {
            return brandFromSignUp.brandID;
        } else {
            return brandAuth.userID;
        }
    };

    // Get Email When Email Null
    const getEmail = () => {
        if (!brandAuth || brandAuth.email === null || brandAuth.email === undefined || brandAuth.email === '') {
            return brandFromSignUp.brandEmail;
        } else {
            return brandAuth.email;
        }
    };

    const [statusBrandInformation, setStatusBrandInformation] = useState(() => {
        // Initialize state from localStorage or default to 'PENDING'
        return localStorage.getItem('brandStatus') || 'PENDING';
    });

    useEffect(() => {
        // Save status to localStorage whenever it changes
        localStorage.setItem('brandStatus', statusBrandInformation);
    }, [statusBrandInformation]);

    async function fetchBrandInformation() {
        try {
            const response = await axios.get(`${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.getBrandByID}/${getID()}`);
            const brandStatus = response.data.data.brandStatus;
            console.log(brandStatus);

            if (brandStatus === "PENDING") {
                setStatusBrandInformation("PENDING");
                console.log(brandStatus);
            } else if (brandStatus === "ACCEPT") {
                setStatusBrandInformation("ACCEPT");
                window.location.href = "/brand";
                console.log(brandStatus);
            } else if (brandStatus === "REJECT") {
                setStatusBrandInformation("REJECT");
                console.log(brandStatus);
            }
        } catch (error) {
            console.error("Error fetching brand information:", error);
        }
    }

    useEffect(() => {
        fetchBrandInformation();

        const interval = setInterval(async () => {
            await fetchBrandInformation();

            // Stop calling the function if the status is no longer "PENDING"
            if (statusBrandInformation !== "PENDING") {
                clearInterval(interval);
            }
        }, 10000); // 10000 milliseconds = 10 seconds

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, [statusBrandInformation]);

    return (
        <div className="bg-gradient-to-r from-orange-200 to-yellow-100 min-h-screen flex items-center justify-center">
            <style>
                {`
                    ${dotsAnimation}
                    .dot {
                        animation: hideUnhide 1.5s infinite;
                        font-size: 4rem; /* Increased the font size */
                        color: gray;
                    }
                    .dot:nth-child(2) {
                        animation-delay: 0.5s;
                    }
                    .dot:nth-child(3) {
                        animation-delay: 1s;
                    }
                `}
            </style>
            <div className="w-full max-w-4xl p-8 m-4 bg-white shadow-2xl rounded-3xl transform hover:scale-105 transition-transform duration-500 animate-fade-in-up">
                <div className="text-center pt-8">
                    <div className="flex justify-center items-center mb-4">
                        <h4 className="text-5xl font-extrabold animate-bounce" style={{ color: "#E96208" }}>{statusBrandInformation}</h4>
                        <div className="flex space-x-1 ml-2 -mt-8">
                            <p className="dot">.</p>
                            <p className="dot">.</p>
                            <p className="dot">.</p>
                        </div>
                    </div>
                    <p className="text-2xl font-medium py-8 text-gray-700">
                        Your information had been sent to the system
                    </p>
                    <p className="text-2xl pb-8 px-12 font-medium text-gray-600">
                        Waiting for the approval or rejection by the system. We will send the result to your email.
                    </p>
                    <div className="flex justify-center space-x-6">
                        <button
                            style={{
                                background: 'linear-gradient(to right, #E96208, #E96208)',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '9999px',
                                transform: 'scale(1)',
                                transition: 'transform 0.3s',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <a href='/' style={{ color: 'inherit', textDecoration: 'none' }}>HOME</a>
                        </button>
                        <button
                            style={{
                                background: 'linear-gradient(to right, #E96208, #E96208)',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '9999px',
                                transform: 'scale(1)',
                                transition: 'transform 0.3s',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <a href='/' style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</a>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingProcessComponent;
