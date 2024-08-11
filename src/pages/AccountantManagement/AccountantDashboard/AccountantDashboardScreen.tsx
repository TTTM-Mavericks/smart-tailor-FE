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
    const lineChartData: LineChartData[] = [
        { name: 'Apr', value: 1000 },
        { name: 'May', value: 2000 },
        { name: 'Jun', value: 3000 },
        { name: 'Jul', value: 4000 },
        { name: 'Aug', value: 4500 },
        { name: 'Sep', value: 5000 },
    ];

    const pieChartData: PieChartData[] = [
        { name: 'Income', value: 55, color: '#00C49F' },
        { name: 'Tax', value: 35, color: '#000000' },
        { name: 'Expenses', value: 10, color: '#E0F2F1' },
    ];

    return (
        <div className="p-6 bg-gray-100">
            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard title="Customer" value="1,450" change={20} />
                <StatCard title="Sales" value="2,580" change={25} />
                <StatCard title="Payables" value="1,273" change={-15} />
                <StatCard title="Receivables" value="1,960" change={-15} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <ChartCard title="Total Income">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={lineChartData}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={['dataMin', 'dataMax']} />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#00C49F" fill="url(#colorUv)" strokeWidth={2} dot={{ r: 4 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Transaction Analysis" subtitle="July/2023">
                    <div className="flex">
                        <ResponsiveContainer width="50%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col justify-center space-y-2">
                            {pieChartData.map((item, index) => (
                                <LegendItem key={index} color={item.color} label={item.name} value={`${item.value}%`} />
                            ))}
                        </div>
                    </div>
                </ChartCard>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Transactions</h3>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">July,2023</span>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b text-sm text-gray-500">
                            <th className="pb-2 font-medium">Category</th>
                            <th className="pb-2 font-medium">Name</th>
                            <th className="pb-2 font-medium">Date</th>
                            <th className="pb-2 font-medium">Amount Due</th>
                            <th className="pb-2 font-medium">Amount Paid</th>
                            <th className="pb-2 font-medium">Status</th>
                            <th className="pb-2 font-medium">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TransactionRow
                            category="Receivables"
                            name="Morrison"
                            date="Jul 22,2023"
                            amountDue="£10,000"
                            amountPaid="£8,000"
                            status="Overdue"
                        />
                        <TransactionRow
                            category="Payables"
                            name="Haywhy"
                            date="Jul 23,2023"
                            amountDue="£8,000"
                            amountPaid="£8,000"
                            status="Paid"
                        />
                        <TransactionRow
                            category="Invoices"
                            name="Morrison"
                            date="Jul 23,2023"
                            amountDue="£2,000"
                            amountPaid="£2,000"
                            status="Overdue"
                        />
                    </tbody>
                </table>
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

// TransactionRow Component
interface TransactionRowProps {
    category: string;
    name: string;
    date: string;
    amountDue: string;
    amountPaid: string;
    status: string;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ category, name, date, amountDue, amountPaid, status }) => (
    <tr className="text-sm text-gray-700 border-b">
        <td className="py-2">{category}</td>
        <td className="py-2">{name}</td>
        <td className="py-2">{date}</td>
        <td className="py-2">{amountDue}</td>
        <td className="py-2">{amountPaid}</td>
        <td className="py-2">
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${status === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {status}
            </span>
        </td>
        <td className="py-2">
            <button className="text-blue-500 hover:text-blue-700">Edit</button>
        </td>
    </tr>
);

export default AccountantDashboard;
