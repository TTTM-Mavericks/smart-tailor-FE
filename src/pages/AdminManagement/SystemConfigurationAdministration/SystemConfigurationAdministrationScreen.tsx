import React, { useState } from 'react';
import { FaSave, FaCog } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminConfiguration = () => {
    const [config, setConfig] = useState({
        baseFee: 10000,
        minDistance: 2,
        feePerKm: 1000,
        maxOrders: 100,
        deliveryPoints: 3,
        orderProcessingTime: 0,
        autoDeleteTime: 1,
        maxDistance: 5,
        systemStatus: 'active'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConfig(prevConfig => ({ ...prevConfig, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Simulating an API call
        setTimeout(() => {
            console.log('Saving configuration:', config);
            toast.success('Cấu hình đã được lưu thành công!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }, 1000);
    };

    return (
        <div className='-mt-8'>
            <ToastContainer />
            <div className="flex items-center mb-8">
                <FaCog className="text-3xl text-blue-600 mr-4" />
                <h2 className="text-3xl font-bold text-gray-800">Cấu hình hệ thống</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label htmlFor="baseFee" className="block text-sm font-medium text-gray-700">
                            Phí giao hàng khởi điểm (VNĐ)
                        </label>
                        <input
                            type="number"
                            id="baseFee"
                            name="baseFee"
                            value={config.baseFee}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="minDistance" className="block text-sm font-medium text-gray-700">
                            Khoảng cách tối thiểu tính thêm phí giao hàng (km)
                        </label>
                        <input
                            type="number"
                            id="minDistance"
                            name="minDistance"
                            value={config.minDistance}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="feePerKm" className="block text-sm font-medium text-gray-700">
                            Phí cộng thêm mỗi km (VNĐ)
                        </label>
                        <input
                            type="number"
                            id="feePerKm"
                            name="feePerKm"
                            value={config.feePerKm}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="maxOrders" className="block text-sm font-medium text-gray-700">
                            Số đơn hàng chờ xác nhận tối đa
                        </label>
                        <input
                            type="number"
                            id="maxOrders"
                            name="maxOrders"
                            value={config.maxOrders}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="deliveryPoints" className="block text-sm font-medium text-gray-700">
                            Số lượng điểm giao hàng tối đa
                        </label>
                        <input
                            type="number"
                            id="deliveryPoints"
                            name="deliveryPoints"
                            value={config.deliveryPoints}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="orderProcessingTime" className="block text-sm font-medium text-gray-700">
                            Thời gian để hủy đơn hàng (giờ)
                        </label>
                        <input
                            type="number"
                            id="orderProcessingTime"
                            name="orderProcessingTime"
                            value={config.orderProcessingTime}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="autoDeleteTime" className="block text-sm font-medium text-gray-700">
                            Thời gian tự động xóa đơn hàng lỗi thanh toán (giờ)
                        </label>
                        <input
                            type="number"
                            id="autoDeleteTime"
                            name="autoDeleteTime"
                            value={config.autoDeleteTime}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="maxDistance" className="block text-sm font-medium text-gray-700">
                            Giới hạn khoảng cách mỗi phút (m)
                        </label>
                        <input
                            type="number"
                            id="maxDistance"
                            name="maxDistance"
                            value={config.maxDistance}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="systemStatus" className="block text-sm font-medium text-gray-700">
                            Trạng thái hệ thống
                        </label>
                        <select
                            id="systemStatus"
                            name="systemStatus"
                            value={config.systemStatus}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="active">Có thể sử dụng</option>
                            <option value="inactive">Không thể sử dụng</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                    >
                        <FaSave className="mr-2" />
                        Lưu cấu hình
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminConfiguration;