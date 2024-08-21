import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import axios from "axios";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { redColor } from "../../../root/ColorSystem";
import { __getToken, __getUserLogined } from "../../../App";
import { Report } from "../../../models/EmployeeManageReportModel";
import { __handleAddCommasToNumber } from "../../../utils/NumbericUtils";
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from "../../../api/ApiConfig";
import { toast } from "react-toastify";

interface CreateRefundInformationDialogComponentProps {
    isOpen: boolean;
    onClose: () => void;
    order?: any;
    report?: Report
}

const CreateRefundInformationDialogComponent: React.FC<CreateRefundInformationDialogComponentProps> = ({ report, isOpen, onClose, order }) => {
    const [formData, setFormData] = useState({
        paymentSenderID: __getUserLogined().userID,
        paymentSenderName: __getUserLogined().fullName,
        paymentSenderBankCode: "OCB",
        paymentSenderBankNumber: "",
        paymentRecipientID: report?.userResponse?.userID || "",
        paymentRecipientName: report?.userResponse?.fullName || "",
        paymentRecipientBankCode: "",
        paymentRecipientBankNumber: "",
        paymentAmount: parseInt(order?.totalPrice) || 0,
        paymentMethod: "CREDIT_CARD",
        paymentType: "ORDER_REFUND",
        orderID: order?.orderID || ""
    });

    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setIsLoadingPage(true);
        try {
            const bodyRequest = {
                ...formData,
                paymentAmount: formData.paymentAmount,
                orderID: order?.orderID,
            }
            console.log(bodyRequest);
            const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.payment + functionEndpoints.payment.createPayment}`, bodyRequest, __getToken());
            if (response.status === 200) {
                setIsLoadingPage(false);
                toast.success(`${response.message}`, { autoClose: 2000 });
                onClose();
            } else {
                setIsLoadingPage(false);
                toast.error(`${response.message}`, { autoClose: 2000 });
                console.log(response.message);
                // onClose();

            }
        } catch (error: any) {
            console.error("Error creating refund information:", error);
            toast.error(`${error}`, { autoClose: 2000 });
            // onClose();


        }
    };

    const renderTextField = (label: string, name: string, type: string = "text", readOnly: boolean = false) => (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${readOnly ? 'bg-gray-200 cursor-not-allowed' : 'focus:outline-none focus:ring focus:border-blue-300'}`}
                type={type}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleInputChange}
                readOnly={readOnly}
            />
        </div>
    );

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Create Refund Information
                <IoMdCloseCircleOutline
                    cursor="pointer"
                    size={20}
                    color={redColor}
                    onClick={onClose}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />
            </DialogTitle>
            <DialogContent>
                <div className="space-y-6">
                    {/* Order Details Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderTextField("Order ID", "orderID", "text", true)}
                            {renderTextField("Payment Amount", "paymentAmount", "number", true)}
                        </div>
                    </div>

                    {/* Payment Recipient Details Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Payment Recipient Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderTextField("Recipient ID", "paymentRecipientID", "text", true)}
                            {renderTextField("Recipient Name", "paymentRecipientName", "text", true)}
                            {renderTextField("Recipient Bank Code", "paymentRecipientBankCode")}
                            {renderTextField("Recipient Bank Number", "paymentRecipientBankNumber")}
                        </div>
                    </div>

                    {/* Payment Sender Details Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Payment Sender Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderTextField("Sender ID", "paymentSenderID")}
                            {renderTextField("Sender Name", "paymentSenderName")}
                            {renderTextField("Sender Bank Code", "paymentSenderBankCode")}
                            {renderTextField("Sender Bank Number", "paymentSenderBankNumber")}
                        </div>
                    </div>

                    {/* Payment Information Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderTextField("Payment Method", "paymentMethod")}
                            {renderTextField("Payment Type", "paymentType")}
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateRefundInformationDialogComponent;
