import React, { useState } from 'react';
import { Typography, Grid, IconButton, Divider, Autocomplete, TextField, styled } from '@mui/material';
import { OrderInterface } from '../../../models/OrderModel';
import { PartOfDesignInterface } from '../../../models/DesignModel';
import PartOfDesignInformationDialogComponent from './PartOfDesignInformationDialogComponent';
import { MdOutlineViewCozy } from "react-icons/md";
import { primaryColor, redColor } from '../../../root/ColorSystem';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import style from './OrderRequestStyle.module.scss'

interface OrderDetailsProps {
    order: OrderInterface;
}

const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const CustomTextFieldQuantity = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '30px',
        width: '140px',
        borderRadius: '4px',
        outline: 'none',
    },
    '& .MuiOutlinedInput-input': {
        fontSize: '12px',
    },
    '& .MuiInputLabel-root': {
        fontSize: '12px',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: primaryColor,
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: `1.5px solid ${primaryColor}`,
        },
        '&:hover fieldset': {
            border: `1.5px solid ${primaryColor}`,
        },
        '&.Mui-focused fieldset': {
            border: `1.5px solid ${primaryColor}`,
        },
    },
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '30px',
        width: '140px',
        borderRadius: '4px',
        outline: 'none',
    },
    '& .MuiOutlinedInput-input': {
        fontSize: '12px',
    },
    '& .MuiInputLabel-root': {
        fontSize: '12px', // Adjust font size of the label
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: primaryColor, // Label color when focused
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: `1.5px solid ${primaryColor}`, // Initial border color
        },
        '&:hover fieldset': {
            border: `1.5px solid ${primaryColor}`, // Border color on hover,
            color: primaryColor
        },
        '&.Mui-focused fieldset': {
            border: `1.5px solid ${primaryColor}`, // Border color when focused
        },
    },
}));

const OrderRequestDetailsComponent: React.FC<OrderDetailsProps> = ({ order }) => {
    const [expandedPartIds, setExpandedPartIds] = useState<string[]>([]);
    const [selectedPart, setSelectedPart] = useState<PartOfDesignInterface | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [size, setSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number | null>(null);

    const handleToggleExpand = (partId: string) => {
        setExpandedPartIds((prev) =>
            prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId]
        );
    };

    const handleOpenDialog = (part: PartOfDesignInterface) => {
        setSelectedPart(part);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setSelectedPart(null);
        setDialogOpen(false);
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <Typography variant="h4" className="text-indigo-800 font-bold mb-6">Order Details</Typography>

            {/* Order Information */}
            {order.design ? (
                <>
                    <div className="p-6 mb-6 shadow-md rounded-lg">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={2}>
                                <img src={order.design.imgUrl} alt="Design Image" style={{ width: 170, height: 210, borderRadius: 5 }} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body2" className="text-indigo-600"><strong>Order ID:</strong> {order.orderID}</Typography>
                                <Typography variant="body2" className="text-indigo-600"><strong>Expected Start Date:</strong> {order.expectedStartDate}</Typography>
                                <Typography variant="body2" className="text-indigo-600"><strong>Expected Completion Date:</strong> {order.expectedProductCompletionDate}</Typography>
                                <Typography variant="body2" className="text-indigo-600"><strong>Created Date:</strong> {order.createDate}</Typography>
                                <Typography variant="body2" className="text-indigo-600"><strong>Last Modified Date:</strong> {order.lastModifiedDate}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Typography variant="body2" className="text-teal-600"><strong>Design ID:</strong> {order.design.designID}</Typography>
                                <Typography variant="body2" className="text-teal-600"><strong>Title:</strong> {order.design.titleDesign}</Typography>
                                <Typography variant="body2" className="text-teal-600"><strong>Type:</strong> {order.design.typeOfDesign}</Typography>
                                <Typography variant="body2" className="text-teal-600"><strong>Color:</strong> {order.design.color}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <div style={{ display: 'flex', margin: 10 }}>
                                    <Grid item>
                                        <Autocomplete
                                            options={sizes}
                                            value={size}
                                            onChange={(event, newValue) => setSize(newValue)}
                                            renderInput={(params) => <CustomTextField {...params} label="Size" variant="outlined" />}
                                            style={{ width: 100 }}
                                        />
                                    </Grid>
                                    <Grid className={`${style.orderRequest__sizeDetail__quantity}`} item>
                                        <CustomTextFieldQuantity
                                            fullWidth
                                            type="number"
                                            label="Quantity"
                                            value={quantity ?? ''}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            inputProps={{ min: 1 }}
                                            style={{ marginLeft: 20, marginRight: 10 }}
                                        />
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    </div>

                    {/* Design Information */}
                    <div className="p-6 mb-6 rounded-lg bg-gray-50">
                        <Divider className="my-6" />

                        {/* Part of Designs */}
                        <Typography variant="h6" className="text-teal-800 font-semibold mb-2">Part of Designs</Typography>
                        {order.design.partOfDesigns && order.design.partOfDesigns.map((part) => (
                            <Grid container key={part.partOfDesignID} className="mb-6 p-4 bg-white rounded shadow-md">
                                <Grid item xs={12} sm={1}>
                                    <IconButton onClick={() => handleOpenDialog(part)}>
                                        <img src={part.imgUrl} alt="Part Image" style={{ width: 50, height: 70 }} />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} sm={10} className=" justify-between items-center">
                                    <Typography variant="body2" className="text-teal-700"><strong>Part Name:</strong> {part.partOfDesignName}</Typography>
                                    <Typography variant="body2" className="text-teal-700"><strong>Material ID:</strong> {part.materialID}</Typography>
                                    <Typography variant="body2" className="text-teal-700"><strong>Created Date:</strong> {part.createDate}</Typography>
                                    <Typography variant="body2" className="text-teal-700"><strong>Last Modified Date:</strong> {part.lastModifiedDate}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconButton onClick={() => handleOpenDialog(part)} style={{ float: 'right' }}>
                                        <MdOutlineViewCozy color={primaryColor} size={30} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </div>
                </>
            ) : (
                <Typography variant="body2" className="text-gray-600">No design information available.</Typography>
            )}
            <PartOfDesignInformationDialogComponent open={dialogOpen} onClose={handleCloseDialog} part={selectedPart} />
        </div>
    );
};

export default OrderRequestDetailsComponent;
