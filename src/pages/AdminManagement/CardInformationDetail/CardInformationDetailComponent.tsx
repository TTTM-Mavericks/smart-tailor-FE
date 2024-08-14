import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { baseURL, functionEndpoints, versionEndpoints } from "../../../api/ApiConfig";
import axios from "axios";
import { __getToken } from "../../../App";

const CardInformationDetailComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [orderStatusDetails, setOrderStatusDetails] = useState([]);
    const [loading, setLoading] = useState<any>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchOrderStatusDetails = async () => {
            try {
                const response = await axios.get(
                    `${baseURL + versionEndpoints.v1 + '/order' + functionEndpoints.chart.orderStatusDetail}`,
                    {
                        headers: {
                            Authorization: `Bearer ${__getToken()}`,
                        }
                    }
                );
                setOrderStatusDetails(response.data.data.orderStatusDetailList || []);
            } catch (error) {
                console.error('Error fetching order status details:', error);
                setError('Failed to load order status details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStatusDetails();
    }, []);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    const getCardColor = (status: any) => {
        switch (status) {
            case "Total Parent Order": return "blue";
            case "Total Cancel Order": return "red";
            case "Total Pre Order": return "yellow";
            case "Total Processing Order": return "green";
            case "Total Fully Completed Order": return "purple";
            default: return "gray";
        }
    };

    const getCardIcon = (status: any) => {
        switch (status) {
            case "Total Parent Order": return "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 15 12 15s-3.5-1.57-3.5-3.5S10.07 8 12 8zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 17.82 9.64 17 12 17s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V21z";
            case "Total Cancel Order": return "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z";
            case "Total Pre Order": return "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z";
            case "Total Processing Order": return "M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z";
            case "Total Fully Completed Order": return "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";
            default: return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z";
        }
    };

    return (
        <div>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {orderStatusDetails.slice(0, 4).map((item: any, index: any) => {
                    const cardColor = getCardColor(item.first);
                    const cardIcon = getCardIcon(item.first);
                    return (
                        <div key={index} className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                            <div className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-${cardColor}-600 to-${cardColor}-400 text-white shadow-${cardColor}-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                    <path d={cardIcon}></path>
                                </svg>
                            </div>
                            <div className="p-4 text-right">
                                <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">{item.first}</p>
                                <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{item.second} Orders</h4>
                            </div>
                            <div className="border-t border-blue-gray-50 p-4">
                                <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                    <strong className="text-green-500">+55%</strong>&nbsp;than last week
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CardInformationDetailComponent;