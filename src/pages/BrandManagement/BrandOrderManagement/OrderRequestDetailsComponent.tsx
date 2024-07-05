import React, { useState } from 'react';
import { Typography, Grid, IconButton, Divider, Autocomplete, TextField, styled, FormControlLabel, Checkbox } from '@mui/material';
import { OrderInterface } from '../../../models/OrderModel';
import { PartOfDesignInterface } from '../../../models/DesignModel';
import PartOfDesignInformationDialogComponent from './PartOfDesignInformationDialogComponent';
import { MdOutlineViewCozy } from "react-icons/md";
import { greenColor, primaryColor, redColor, whiteColor } from '../../../root/ColorSystem';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import style from './OrderRequestStyle.module.scss'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

interface OrderDetailsProps {
    order: OrderInterface;
}

interface SizeQuantity {
    size?: string;
    quantity: number;
    width?: number;
    height?: number;
    ring1?: number;
    ring2?: number;
    ring3?: number;
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
    const [size, setSize] = useState<string | null>('L');
    const [quantity, setQuantity] = useState<number | null>(100);
    const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity[]>([{ size: 'L', quantity: 1 }]);
    const [isChecked, setIsChecked] = useState(false);



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

    /**
     * Update state change of size 
     * @param index 
     * @param newSize 
     */
    const __handleSizeChange = (index: number, newSize: string) => {
        const updatedSizeQuantities = [...sizeQuantities];
        updatedSizeQuantities[index].size = newSize;
        setSizeQuantities(updatedSizeQuantities);
    };

    /**
    * Update state change of quantity
    * @param index 
    * @param newQuantity 
    */
    const __handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedSizeQuantities = [...sizeQuantities];
        updatedSizeQuantities[index].quantity = newQuantity;
        setSizeQuantities(updatedSizeQuantities);

    };

    /**
     * Remove out size or quantity 
     * @param index 
     */
    const __handleRemoveSizeQuantity = (index: number) => {
        setSizeQuantities(sizeQuantities.filter((_, i) => i !== index));
    };

    /**
     * Add more size and quantity
     */
    const __handleAddSizeQuantity = () => {
        setSizeQuantities([...sizeQuantities, { size: 'L', quantity: 1 }]);
    };

    /**
     * Hanlde check to accept all size
     * @param event 
     */
    const __handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };


    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <Typography variant="h4" style={{fontSize: 20, fontWeight: 'bold'}}>Order Details</Typography>

            {/* Order Information */}
            {order.design ? (
                <>
                    <div className="p-6 mb-6 shadow-md rounded-lg">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={2}>
                                <img src={order.design.imgUrl} alt="Design Image" style={{ width: 170, height: 210, borderRadius: 5 }} />
                            </Grid>
                            <Grid item xs={12} sm={7} >
                                <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Order ID:</strong> {order.orderID}</Typography>
                                <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Expected Completion Date:</strong> {order.expectedProductCompletionDate}</Typography>
                                <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Title:</strong> {order.design.titleDesign}</Typography>
                                <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Type:</strong> {order.design.typeOfDesign}</Typography>
                                <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Color:</strong> {order.design.color}</Typography>
                                <div style={{ position: 'relative', marginTop: 30 }}>
                                    {sizeQuantities.map((sq, index) => (
                                        <div key={index} style={{ display: 'flex' }}>
                                            <Grid item style={{paddingTop: 10}} >
                                                <Autocomplete
                                                    options={sizes}
                                                    value={sq.size}
                                                    onChange={(event, newValue) => newValue && __handleSizeChange(index, newValue)}
                                                    renderInput={(params) => <CustomTextField {...params} label="Size" variant="outlined" />}
                                                />
                                            </Grid>
                                            <Grid className={`${style.orderRequest__detail__sizeDetail__quantity}`} item>
                                                <CustomTextFieldQuantity
                                                    fullWidth
                                                    type="number"
                                                    label="Quantity"
                                                    value={sq.quantity}
                                                    onChange={(e) => __handleQuantityChange(index, Number(e.target.value))}
                                                    inputProps={{ min: 1 }}
                                                    style={{ marginLeft: 10, marginRight: 0 }}

                                                />
                                                <div style={{display: 'flex', justifyContent:'center', alignItems: 'center', marginLeft: 20}}>
                                                    <FaMinusCircle size={25} color={primaryColor} onClick={() => __handleRemoveSizeQuantity(index)} style={{ display: sizeQuantities.length === 1 ? 'none' : 'flex', cursor: 'pointer', marginLeft: -10 }}>
                                                    </FaMinusCircle>
                                                    <p >Size detail</p>
                                                </div>
                                            </Grid>
                                        </div>
                                    ))}
                                    <div>
                                        <FaPlusCircle size={20} style={{ cursor: 'pointer', marginLeft: 10 }} color={primaryColor} onClick={__handleAddSizeQuantity}>
                                        </FaPlusCircle>
                                    </div>
                                </div>

                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControlLabel
                                    control={<Checkbox color={'error'} checked={isChecked} onChange={__handleCheckboxChange} />}
                                    label={(<span style={{ fontSize: 14 }}>Accept full order</span>)}
                                    style={{ fontSize: '1px', fontWeight: 500 }}
                                    sx={{ fontSize: 12 }}


                                />
                                <div style={{ marginTop: 0 }}>
                                    <button
                                        type="submit"
                                        className={`${style.orderRequest__button__accept} px-5 py-2.5 text-sm font-medium text-white mt-3`}
                                    >
                                        Accept
                                    </button>
                                </div>
                                <div style={{ marginTop: 0 }}>
                                    <button
                                        type="submit"
                                        className={`${style.orderRequest__button__deny} px-5 py-2.5 text-sm font-medium`}
                                    >
                                        Deny
                                    </button>
                                </div>
                            </Grid>

                        </Grid>
                    </div>

                    {/* Design Information */}
                    <div className="p-6 mb-6 rounded-lg bg-gray-50">
                        <Divider className="my-6" />

                        {/* Part of Designs */}
                        <Typography variant="h6" style={{fontSize: 15, fontWeight: 'bold', padding: 10}}>Part of Designs</Typography>
                        {order.design.partOfDesigns && order.design.partOfDesigns.map((part) => (
                            <Grid container key={part.partOfDesignID} className="mb-6 p-4 bg-white rounded shadow-md">
                                <Grid item xs={12} sm={1}>
                                    <IconButton onClick={() => handleOpenDialog(part)}>
                                        <img src={part.imgUrl} alt="Part Image" style={{ width: 50, height: 70 }} />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} sm={10} className=" justify-between items-center">
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Part Name:</strong> {part.partOfDesignName}</Typography>
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Material ID:</strong> {part.materialID}</Typography>
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Created Date:</strong> {part.createDate}</Typography>
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Last Modified Date:</strong> {part.lastModifiedDate}</Typography>
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
