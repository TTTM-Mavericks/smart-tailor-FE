import React, { useEffect, useState } from 'react';
import { Typography, Grid, IconButton, Divider, Autocomplete, TextField, styled, FormControlLabel, Checkbox } from '@mui/material';
import { OrderInterface } from '../../../models/OrderModel';
import { DesignDetailInterface, DesignInterface, ExpertTailoringSizeInterface, PartOfDesignInterface } from '../../../models/DesignModel';
import PartOfDesignInformationDialogComponent from './PartOfDesignInformationDialogComponent';
import { MdOutlineViewCozy } from "react-icons/md";
import { greenColor, primaryColor, redColor, whiteColor } from '../../../root/ColorSystem';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import style from './OrderRequestStyle.module.scss'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';

interface OrderDetailsProps {
    order: OrderInterface;
    design: DesignInterface,
    designDetail: DesignDetailInterface[]
}


interface SizeQuantity {
    sizeID?: any;
    size?: string;
    quantity: number;
    width?: number;
    height?: number;
    ring1?: number;
    ring2?: number;
    ring3?: number;
    expertTailoringID?: string;
    expertTailoringName?: string;
    sizeName?: string;
    minFabric?: number;
    maxFabric?: number;
    unit?: string;
    createDate?: string;
    lastModifiedDate?: null;
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
        marginTop: '-10px'
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: primaryColor, // Label color when focused
        marginTop: '0px'
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

const OrderRequestDetailsComponent: React.FC<OrderDetailsProps> = ({ order, design, designDetail }) => {

    // TODO MUTIL LANGUAGE

    const [expandedPartIds, setExpandedPartIds] = useState<string[]>([]);
    const [selectedPart, setSelectedPart] = useState<PartOfDesignInterface | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [size, setSize] = useState<string | null>('L');
    const [quantity, setQuantity] = useState<number | null>(100);
    const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity[]>([{ size: 'L', quantity: 1, sizeID: 'dsfsdfds' }]);
    const [isChecked, setIsChecked] = useState(false);
    const [sizes, setSizes] = useState<ExpertTailoringSizeInterface[]>();
    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);


    useEffect(() => {
        console.log('designDetail: ', designDetail);

        const extractedSizes = designDetail.map((item: any) => (
            {
                ...item.size,
                sizeID: item.size.sizeID,
                sizeName: item.size.sizeName,
                quantity: item.quantity
            }
        ));
        console.log('extractedSizes: ', extractedSizes);
        setSizes(extractedSizes);

    }, [designDetail])

    useEffect(() => {
        console.log('aaaaaa: ', sizes);

    }, [sizes])


    /**
     * Handle fetch expert tailoring size
     */
    const __handleGetExpertTailoringSize = async (designID: any) => {
        setIsLoadingPage(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.designDetail + functionEndpoints.designDetail.getAllInforOrderDetail}/${designID}`);
            if (response.status === 200) {
                console.log('size: ', response.data);
                const extractedSizes = response.data.map((item: any) => (
                    {
                        ...item.size,
                        sizeID: item.size.sizeID,
                        sizeName: item.size.sizeName,
                        quantity: item.quantity
                    }
                ));
                console.log(extractedSizes);
                setSize(extractedSizes);
            }
            else {
                return;
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }


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
    const __handleSizeChange = (index: number, newSizeID: string, nameSize: string) => {
        if (!newSizeID || !nameSize) return;
        const updatedSizeQuantities = [...sizeQuantities];
        updatedSizeQuantities[index] = { ...updatedSizeQuantities[index], sizeID: newSizeID, size: nameSize };
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
        setSizeQuantities([...sizeQuantities, { size: '', quantity: 1 }]);
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
            <Typography variant="h4" style={{ fontSize: 20, fontWeight: 'bold' }}>Order Details</Typography>

            {/* Order Information */}
            {design ? (
                <>
                    <div className="p-6 mb-6 shadow-md rounded-lg">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={2}>
                                <img src={design?.imageUrl} alt="Design Image" style={{ width: 170, height: 210, borderRadius: 5 }} />
                            </Grid>
                            <Grid item xs={12} sm={7} >
                                <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Order ID:</strong> {order.orderID}</Typography>
                                <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Expected Completion Date:</strong> {order.expectedProductCompletionDate}</Typography>
                                <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Title:</strong> {design.titleDesign}</Typography>
                                <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Type:</strong> {design.typeOfDesign}</Typography>
                                <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Color:</strong> {design.color}</Typography>
                                <div style={{ position: 'relative', marginTop: 30 }}>
                                    {sizeQuantities.map((sq, index) => {
                                        const selectedSize = sizes?.find(size => size.sizeID === sq.sizeID) || null;

                                        // Filter out selected sizes
                                        const filteredSizes = sizes ? sizes.filter(size => !sizeQuantities.some(sq => sq.sizeID === size.sizeID)) : [];

                                        return (
                                            <div key={index} style={{ display: 'flex', margin: 10 }}>
                                                <Grid item>
                                                    <Autocomplete
                                                        options={filteredSizes}
                                                        getOptionLabel={(option) => `${option.sizeName} (${option.quantity})`}
                                                        value={selectedSize}
                                                        onChange={(event, newValue) => {
                                                            if (newValue) {
                                                                __handleSizeChange(index, newValue.sizeID, newValue.sizeName);
                                                            }
                                                        }}
                                                        renderInput={(params) => <CustomTextField {...params} label="Size" variant="outlined" sx={{ paddingTop: -20 }} />}
                                                    />
                                                </Grid>
                                                <Grid className={`${style.orderProduct__container__detail__sizeDetail__quantity}`} style={{ position: 'relative' }} item>
                                                    <CustomTextFieldQuantity
                                                        fullWidth
                                                        type="number"
                                                        label="Quantity"
                                                        value={sq.quantity}
                                                        onChange={(e) => __handleQuantityChange(index, Number(e.target.value))}
                                                        inputProps={{ min: 1 }}
                                                        style={{ marginLeft: 20, marginRight: 10 }}
                                                    />
                                                    <FaMinusCircle size={20} color={primaryColor} onClick={() => __handleRemoveSizeQuantity(index)} style={{ display: sizeQuantities.length === 1 ? 'none' : 'flex', cursor: 'pointer', position: 'absolute', right: -20, top: 5 }}>
                                                    </FaMinusCircle>
                                                </Grid>
                                            </div>
                                        );
                                    })}

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
                        <Typography variant="h6" style={{ fontSize: 15, fontWeight: 'bold', padding: 10 }}>Part of Designs</Typography>
                        {design.partOfDesign && design.partOfDesign.map((part) => (
                            <Grid container key={part.partOfDesignID} className="mb-6 p-4 bg-white rounded shadow-md">
                                <Grid item xs={12} sm={1}>
                                    <IconButton onClick={() => handleOpenDialog(part)}>
                                        <img src={part.imageUrl} alt="Part Image" style={{ width: 50, height: 70 }} />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} sm={10} className=" justify-between items-center">
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Part name:</strong> {part.partOfDesignName}</Typography>
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>Material name:</strong> {part.material?.materialName}</Typography>
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy}`}><strong>HS code:</strong> {part.material?.hsCode}</Typography>

                                </Grid>
                                {part?.itemMasks && part?.itemMasks?.length > 0 && (
                                    <Grid item xs={12} sm={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconButton onClick={() => handleOpenDialog(part)} style={{ float: 'right' }}>
                                            <MdOutlineViewCozy color={primaryColor} size={30} />
                                        </IconButton>
                                    </Grid>
                                )}
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
