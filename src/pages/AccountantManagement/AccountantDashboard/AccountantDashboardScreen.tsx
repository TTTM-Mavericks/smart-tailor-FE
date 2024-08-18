import { useEffect, useState } from 'react';
import {
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { baseURL, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import axios from 'axios';
import { __getToken } from '../../../App';

const AccountantDashboard: React.FC = () => {
    // Loading And Error
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Total Income 
    const [totalInvoice, setTotalInvoice] = useState<any>([]);

    useEffect(() => {
        const fetchOrderGrowthPercentage = async () => {
            try {
                const response = await axios.get(
                    `${baseURL + versionEndpoints.v1 + '/payment' + functionEndpoints.chart.getTotalIncomeForEachMonth}`,
                    {
                        headers: {
                            Authorization: `Bearer ${__getToken()}`,
                        },
                    }
                );

                console.log('API Response:', response.data);
                setTotalInvoice(response.data.data);
            } catch (error) {
                console.error('Error fetching order growth percentage:', error);
                setError('Failed to load order growth percentage');
            }
        };

        fetchOrderGrowthPercentage();
    }, []);


    // Total Refund
    const [totalRefund, setTotalRefund] = useState<any>([]);

    useEffect(() => {
        const fetchOrderGrowthPercentage = async () => {
            try {
                const response = await axios.get(
                    `${baseURL + versionEndpoints.v1 + '/payment' + functionEndpoints.chart.getTotalRefundForEachMonth}`,
                    {
                        headers: {
                            Authorization: `Bearer ${__getToken()}`,
                        },
                    }
                );

                console.log('API Response:', response.data);
                setTotalRefund(response.data.data);
            } catch (error) {
                console.error('Error fetching order growth percentage:', error);
                setError('Failed to load order growth percentage');
            }
        };

        fetchOrderGrowthPercentage();
    }, []);

    // Total Payment
    const [totalPayment, setTotalPayment] = useState<any>([]);

    useEffect(() => {
        const fetchOrderGrowthPercentage = async () => {
            try {
                const response = await axios.get(
                    `${baseURL + versionEndpoints.v1 + '/payment' + functionEndpoints.chart.getTotalPaymentForEachMonth}`,
                    {
                        headers: {
                            Authorization: `Bearer ${__getToken()}`,
                        },
                    }
                );

                console.log('API Response:', response.data);
                setTotalPayment(response.data.data);
            } catch (error) {
                console.error('Error fetching order growth percentage:', error);
                setError('Failed to load order growth percentage');
            }
        };

        fetchOrderGrowthPercentage();
    }, []);

    const [paymentGrowthPercentage, setPaymentGrowthPercentage] = useState<any>([]);
    const [incomeGrowthPercentage, setIncomeGrowthPercentage] = useState<any>([]);
    const [refundGrowthPercentage, setRefundGrowthPercentage] = useState<any>([]);
    // const [newEmployeeGrowthPercentage, setNewEmployeeGrowthPercentage] = useState<any>([]);

    // Fetch functions
    const fetchGrowthPercentage = async (endpoint: string, setter: React.Dispatch<React.SetStateAction<number>>) => {
        try {
            const response = await axios.get(
                `${baseURL + versionEndpoints.v1 + endpoint}`,
                {
                    headers: {
                        Authorization: `Bearer ${__getToken()}`,
                    },
                }
            );
            setter(response.data.data);
        } catch (error) {
            console.error('Error fetching growth percentage:', error);
            setError('Failed to load growth percentage');
        }
    };

    useEffect(() => {
        fetchGrowthPercentage('/payment' + functionEndpoints.chart.calculatePaymentGrowthPercentageWeek, setPaymentGrowthPercentage);
        fetchGrowthPercentage('/payment' + functionEndpoints.chart.calculateIncomeGrowthPercentageWeek, setIncomeGrowthPercentage);
        fetchGrowthPercentage('/payment' + functionEndpoints.chart.calculateRefundGrowthPercentageMonth, setRefundGrowthPercentage);
        // fetchGrowthPercentage('/user' + functionEndpoints.chart.calculateNewUserGrowthPercentageByRoleName + '/employee', setNewEmployeeGrowthPercentage);
    }, []);
    // console.log("newEmployeeGrowthPercentage" + JSON.stringify(newEmployeeGrowthPercentage));

    return (
        <div>
            <div>
                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                                <path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd"></path>
                                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
                            </svg>
                        </div>
                        <div className="p-4 text-right">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Payment Growth</p>
                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{paymentGrowthPercentage.currentData}</h4>
                        </div>
                        <div className="border-t border-blue-gray-50 p-4">
                            <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                <strong className={paymentGrowthPercentage.growthPercentage >= 0 ? "text-green-500" : "text-red-500"}>
                                    {paymentGrowthPercentage.growthPercentage >= 0 ? '+' : '-'}{Math.abs(paymentGrowthPercentage.growthPercentage)}%
                                </strong>
                                &nbsp;than last week
                            </p>
                        </div>
                    </div>
                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div className="p-4 text-right">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Income Growth</p>
                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{incomeGrowthPercentage.currentData}</h4>
                        </div>
                        <div className="border-t border-blue-gray-50 p-4">
                            <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                <strong className={incomeGrowthPercentage.growthPercentage >= 0 ? "text-green-500" : "text-red-500"}>
                                    {incomeGrowthPercentage.growthPercentage >= 0 ? '+' : '-'}{Math.abs(incomeGrowthPercentage.growthPercentage)}%
                                </strong>
                                &nbsp;than last week
                            </p>
                        </div>
                    </div>
                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
                            </svg>
                        </div>
                        <div className="p-4 text-right">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Refund Growth</p>
                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{refundGrowthPercentage.currentData}</h4>
                        </div>
                        <div className="border-t border-blue-gray-50 p-4">
                            <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                <strong className={refundGrowthPercentage.growthPercentage >= 0 ? "text-green-500" : "text-red-500"}>
                                    {refundGrowthPercentage.growthPercentage >= 0 ? '+' : '-'}{Math.abs(refundGrowthPercentage.growthPercentage)}%
                                </strong>
                                &nbsp;than last month
                            </p>
                        </div>
                    </div>
                    {/* <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
                            </svg>
                        </div>
                        <div className="p-4 text-right">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Employee Growth</p>
                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{newEmployeeGrowthPercentage.previousData}{newEmployeeGrowthPercentage.currentData}</h4>
                        </div>
                        <div className="border-t border-blue-gray-50 p-4">
                            <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                <strong className={newEmployeeGrowthPercentage.growthPercentage >= 0 ? "text-green-500" : "text-red-500"}>
                                    {newEmployeeGrowthPercentage.growthPercentage >= 0 ? '+' : '-'}{Math.abs(newEmployeeGrowthPercentage.growthPercentage)}%
                                </strong>
                                &nbsp;than last day
                            </p>
                        </div>
                    </div> */}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <ChartCard title="Total Income Each Month">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={totalInvoice}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="first" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="second" stroke="#00C49F" fill="url(#colorUv)" strokeWidth={2} dot={{ r: 4 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Total Refund Each Month">
                    <div className="flex">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={totalRefund}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="first" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="second" stroke="#00C49F" fill="url(#colorUv)" strokeWidth={2} dot={{ r: 4 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

            </div>
            <ChartCard title="Total Payment Each Month">
                <ResponsiveContainer height={300}>
                    <AreaChart data={totalPayment}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="first" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="second" stroke="#00C49F" fill="url(#colorUv)" strokeWidth={2} dot={{ r: 4 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

        </div>
    );
};

// StatCard Component
interface StatCardProps {
    title: string;
    value: string;
    change: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div>
            <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="flex flex-col items-end">
            <div className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {change >= 0 ? (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
                {Math.abs(change)}%
            </div>
        </div>
        <div className={`w-1 h-16 rounded-full ${change >= 0 ? 'bg-green-500' : 'bg-red-500'} ml-4`}></div>
    </div>
);

// ChartCard Component
interface ChartCardProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children}
    </div>
);

// LegendItem Component
interface LegendItemProps {
    color: string;
    label: string;
    value: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label, value }) => (
    <div className="flex items-center">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
        <p className="ml-2 text-sm">{label}: {value}</p>
    </div>
);


export default AccountantDashboard;
