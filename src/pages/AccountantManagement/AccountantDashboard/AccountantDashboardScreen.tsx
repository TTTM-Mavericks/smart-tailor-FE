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

// Data types for charts
interface LineChartData {
    name: string;
    value: number;
}

interface PieChartData {
    name: string;
    value: number;
    color: string;
}

const AccountantDashboard: React.FC = () => {
    // Loading And Error
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Order Status
    const [orderStatusDetails, setOrderStatusDetails] = useState<PieChartData[]>([]);
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
                const data = response.data.data.orderStatusDetailList.map((item: any, index: number) => ({
                    name: item.first,
                    value: item.second,
                    color: getColor(index)
                }));
                setOrderStatusDetails(data);
            } catch (error) {
                console.error('Error fetching order status details:', error);
                setError('Failed to load order status details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStatusDetails();
    }, []);

    //Order Growth
    const [orderGrowthPercentage, setOrderGrowthPercentage] = useState<number>(0);

    useEffect(() => {
        const fetchOrderGrowthPercentage = async () => {
            try {
                const response = await axios.get(
                    `${baseURL + versionEndpoints.v1 + '/order' + functionEndpoints.chart.calculateOrderGrowthPercentageMonth}`,
                    {
                        headers: {
                            Authorization: `Bearer ${__getToken()}`,
                        },
                    }
                );
                setOrderGrowthPercentage(response.data.data);
            } catch (error) {
                console.error('Error fetching order growth percentage:', error);
                setError('Failed to load order growth percentage');
            }
        };

        fetchOrderGrowthPercentage();
    }, []);

    //User Growth
    const [userGrowthPercentage, setUserGrowthPercentage] = useState<number>(0);

    useEffect(() => {
        const fetchOrderGrowthPercentage = async () => {
            try {
                const response = await axios.get(
                    `${baseURL + versionEndpoints.v1 + '/user' + functionEndpoints.chart.calculateUserGrowthPercentageMonth}`,
                    {
                        headers: {
                            Authorization: `Bearer ${__getToken()}`,
                        },
                    }
                );
                setUserGrowthPercentage(response.data.data);
            } catch (error) {
                console.error('Error fetching order growth percentage:', error);
                setError('Failed to load order growth percentage');
            }
        };

        fetchOrderGrowthPercentage();
    }, []);

    //Customer Growth
    const [customerGrowthPercentage, setCustomerGrowthPercentage] = useState<number>(0);

    useEffect(() => {
        const fetchOrderGrowthPercentage = async () => {
            try {
                const response = await axios.get(
                    `${baseURL + versionEndpoints.v1 + '/user' + functionEndpoints.chart.calculateCustomerGrowthPercentageMonth}`,
                    {
                        headers: {
                            Authorization: `Bearer ${__getToken()}`,
                        },
                    }
                );
                setCustomerGrowthPercentage(response.data.data);
            } catch (error) {
                console.error('Error fetching order growth percentage:', error);
                setError('Failed to load order growth percentage');
            }
        };

        fetchOrderGrowthPercentage();
    }, []);

    //Payment Growth
    const [paymentGrowthPercentage, setPaymentGrowthPercentage] = useState<number>(0);

    useEffect(() => {
        const fetchOrderGrowthPercentage = async () => {
            try {
                const response = await axios.get(
                    `${baseURL + versionEndpoints.v1 + '/payment' + functionEndpoints.chart.calculatePaymentGrowthPercentageMonth}`,
                    {
                        headers: {
                            Authorization: `Bearer ${__getToken()}`,
                        },
                    }
                );
                setPaymentGrowthPercentage(response.data.data);
            } catch (error) {
                console.error('Error fetching order growth percentage:', error);
                setError('Failed to load order growth percentage');
            }
        };

        fetchOrderGrowthPercentage();
    }, []);

    // Total Invoice 
    const [totalInvoice, setTotalInvoice] = useState<any>([]);

    useEffect(() => {
        const fetchOrderGrowthPercentage = async () => {
            try {
                const response = await axios.get(
                    `${baseURL + versionEndpoints.v1 + '/payment' + functionEndpoints.chart.getTotalForEachMonth}`,
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

    const lineChartData: LineChartData[] = [
        { name: 'Apr', value: 1000 },
        { name: 'May', value: 2000 },
        { name: 'Jun', value: 3000 },
        { name: 'Jul', value: 4000 },
        { name: 'Aug', value: 4500 },
        { name: 'Sep', value: 5000 },
    ];

    // Function to return a color based on the index
    const getColor = (index: number) => {
        const colors = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF0000', '#800080'];
        return colors[index % colors.length];
    };

    return (
        <div>
            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard title="Order Growth" value="1,450" change={orderGrowthPercentage} />
                <StatCard title="User Growth" value="2,580" change={userGrowthPercentage} />
                <StatCard title="Customer Growth" value="1,273" change={customerGrowthPercentage} />
                <StatCard title="Payment Growth" value="1,960" change={paymentGrowthPercentage} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <ChartCard title="Total Income">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={totalInvoice}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="first" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={['dataMin', 'dataMax']} />
                            <Tooltip />
                            <Area type="monotone" dataKey="second" stroke="#00C49F" fill="url(#colorUv)" strokeWidth={2} dot={{ r: 4 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Order Report" subtitle="July/2023">
                    <div className="flex">
                        <ResponsiveContainer width="50%" height={200}>
                            <PieChart>
                                <Pie
                                    data={orderStatusDetails}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {orderStatusDetails.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col justify-center space-y-2">
                            {orderStatusDetails.map((item, index) => (
                                <LegendItem key={index} color={item.color} label={item.name} value={`${item.value}`} />
                            ))}
                        </div>
                    </div>
                </ChartCard>
            </div>

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
