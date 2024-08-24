import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { UserInterface } from '../../../../models/UserModel';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { __getToken } from '../../../../App';
import { FaCog, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ExpertTailoring {
    expertTailoringID: string;
    expertTailoringName: string;
    sizeImageUrl: string;
    modelImageUrl: string;
    status: boolean;
    createDate: string;
    lastModifiedDate: string | null;
}

const ExpertTailoringBrandManagerComponent: React.FC = () => {
    const [userAuth, setUserAuth] = useState<UserInterface | undefined>();
    const [expertTailorings, setExpertTailorings] = useState<ExpertTailoring[]>([]);
    const [brandExpertTailorings, setBrandExpertTailorings] = useState<ExpertTailoring[]>([]);
    const [selectedExpertTailorings, setSelectedExpertTailorings] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [responseErrors, setResponseErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userStorage = Cookies.get('userAuth');
        if (userStorage) {
            const userParse: UserInterface = JSON.parse(userStorage);
            setUserAuth(userParse);
            console.log('User authenticated:', userParse);
        }
        fetchExpertTailorings();
    }, []);

    useEffect(() => {
        if (userAuth) {
            fetchBrandExpertTailorings(userAuth.userID);
        }
    }, [userAuth]);

    useEffect(() => {
        if (expertTailorings.length > 0 && brandExpertTailorings.length > 0) {
            setIsLoading(false);
        }
    }, [expertTailorings, brandExpertTailorings]);

    const fetchExpertTailorings = async () => {
        try {
            const response = await axios.get(`${baseURL}${versionEndpoints.v1}${featuresEndpoints.expertTailoring}${functionEndpoints.expertTailoring.getAllExpertTailoring}`, {
                headers: { Authorization: `Bearer ${__getToken()}` },
            });
            if (response.data.status === 200) {
                setExpertTailorings(response.data.data);
                console.log('Fetched all expert tailorings:', response.data.data);
            }
        } catch (error) {
            console.error('Error fetching expert tailorings:', error);
            setMessage('Failed to fetch expert tailorings. Please try again.');
        }
    };

    const fetchBrandExpertTailorings = async (brandId: string) => {
        try {
            const response = await axios.get(`${baseURL}${versionEndpoints.v1}${featuresEndpoints.brand}${functionEndpoints.brand.getAllExpertTailoringByBrandID}/${brandId}`, {
                headers: { Authorization: `Bearer ${__getToken()}` },
            });
            if (response.data.status === 200) {
                setBrandExpertTailorings(response.data.data);
                console.log('Fetched brand expert tailorings:', response.data.data);
            }
        } catch (error) {
            console.error('Error fetching brand expert tailorings:', error);
            setMessage('Failed to fetch brand expert tailorings. Please try again.');
        }
    };

    const handleExpertTailoringClick = (expertTailoringID: string) => {
        setSelectedExpertTailorings(prevSelected => {
            const newSelection = prevSelected.includes(expertTailoringID)
                ? prevSelected.filter(id => id !== expertTailoringID)
                : [...prevSelected, expertTailoringID];

            console.log('Updated selection:', newSelection);
            return newSelection;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAuth || selectedExpertTailorings.length === 0) {
            console.log('Submission prevented: No user auth or no selections');
            return;
        }

        try {
            console.log('Submitting expert tailorings:', selectedExpertTailorings);
            const response = await axios.post(
                `${baseURL}${versionEndpoints.v1}${featuresEndpoints.brand}${functionEndpoints.brand.addExpertTailoringForBrand}`,
                { brandID: userAuth.userID, expertTailoringIDList: selectedExpertTailorings },
                { headers: { Authorization: `Bearer ${__getToken()}` } }
            );
            console.log('Sending request:', { brandID: userAuth.userID, expertTailoringIDList: selectedExpertTailorings });

            if (response.status === 200 || response.status === 400) {
                console.log('Response received:', response.data);
                setResponseMessage(response.data.message);

                if (response.data.errors) {
                    const errorMessages = response.data.errors.flatMap((error: any) => error.errorMessage);
                    setResponseErrors(errorMessages);
                } else {
                    setResponseErrors([]);
                }

                if (response.status === 200) {
                    toast.success(response.data.message);
                    setSelectedExpertTailorings([]);
                    fetchBrandExpertTailorings(userAuth.userID);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error: any) {
            console.error('Error managing expert tailorings:', error.response?.data || error);
            toast.error('Failed to add expert tailorings. Please try again.');
            setResponseMessage('Failed to add expert tailorings. Please try again.');
            setResponseErrors([]);
        }
    };

    const filteredExpertTailorings = expertTailorings.filter(
        tailoring => !brandExpertTailorings.some(
            brandTailoring => brandTailoring.expertTailoringID === tailoring.expertTailoringID
        )
    );

    console.log('Filtered expert tailorings:', filteredExpertTailorings);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden mt-5">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center mb-8">
                            <FaCog className="text-3xl text-blue-600 mr-4" style={{ color: "#E96208" }} />
                            <h2 className="text-3xl font-bold text-gray-800">Brand Expert Tailoring Manager</h2>
                        </div>
                        {message && (
                            <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-md">
                                {message}
                            </div>
                        )}
                        {responseMessage && (
                            <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-md">
                                {responseMessage}
                            </div>
                        )}
                        {responseErrors.length > 0 && (
                            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                                <h3 className="font-bold mb-2">Errors:</h3>
                                <ul className="list-disc list-inside">
                                    {responseErrors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label htmlFor="brandId" className="block text-sm font-medium text-gray-700">
                                    Brand ID
                                </label>
                                <p className="mt-1 text-sm text-gray-900 bg-gray-100 rounded-md py-2 px-3">{userAuth?.userID}</p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Expert Tailorings</h2>
                                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
                                    {filteredExpertTailorings.map((tailoring) => (
                                        <li
                                            key={tailoring.expertTailoringID}
                                            className={`col-span-1 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer ${selectedExpertTailorings.includes(tailoring.expertTailoringID) ? 'ring-2 ring-indigo-500' : ''
                                                }`}
                                            onClick={() => handleExpertTailoringClick(tailoring.expertTailoringID)}
                                        >
                                            <div className="w-full aspect-w-16 aspect-h-9">
                                                <img
                                                    src={tailoring.modelImageUrl}
                                                    alt={tailoring.expertTailoringName}
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="px-4 py-3">
                                                <p className="text-sm font-medium text-gray-900 truncate">{tailoring.expertTailoringName}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    Selected: {selectedExpertTailorings.length} expert tailoring(s)
                                </p>
                                <button
                                    type="submit"
                                    className="mt-6 ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                    disabled={selectedExpertTailorings.length === 0}
                                >
                                    <FaPlus className="mr-2" /> Add Selected Expert Tailorings to Brand
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertTailoringBrandManagerComponent;