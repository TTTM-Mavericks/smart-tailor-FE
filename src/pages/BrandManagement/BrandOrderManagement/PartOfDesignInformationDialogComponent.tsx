import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { ItemMaskInterface, PartOfDesignInterface } from '../../../models/DesignModel';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { primaryColor, redColor, whiteColor } from '../../../root/ColorSystem';
import style from './OrderRequestStyle.module.scss'

interface PartDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    part: PartOfDesignInterface | null;
}

const PartOfDesignInformationDialogComponent: React.FC<PartDetailsDialogProps> = ({ open, onClose, part }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl">
            <DialogTitle>
                {part?.partOfDesignName}
                <IoMdCloseCircleOutline
                    cursor={'pointer'}
                    size={20}
                    color={redColor}
                    onClick={onClose}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />

            </DialogTitle>
            <DialogContent style={{ maxHeight: 700 }} >
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" style={{ fontSize: 14, fontWeight: 'bold' }} className="text-teal-700">Material ID: {part?.materialID}</Typography>
                        {part?.imgUrl && <img src={part.imgUrl} alt="Part Image" style={{ width: 300, height: 350, marginTop: 20 }} />}
                    </Grid>
                    <Grid item xs={12} sm={6} className={`${style.partOfDesignInfor__dialog__content}`}>
                        {/* Display Item Masks */}
                        <Typography variant="h6" style={{ fontSize: 14, fontWeight: 'bold' }} className="text-teal-800 font-semibold mb-2">Item Masks</Typography>
                        {part?.itemMasks && part.itemMasks.map((mask: ItemMaskInterface) => (
                            <Grid container spacing={4} className={` mb-3 p-4 bg-gray-50 rounded shadow-md`} key={mask.itemMaskID} >
                                <Grid item xs={12} sm={4}>
                                    {mask.imageUrl && <img src={mask.imageUrl} alt="Mask Image" style={{ width: 70, height: 80 }} />}
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy__dialog}`}><strong>Item Mask Name:</strong> {mask.itemMaskName}</Typography>
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy__dialog}`}><strong>Type:</strong> {mask.typeOfItem}</Typography>
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy__dialog}`}><strong>Position:</strong> X: {mask.positionX}, Y: {mask.positionY}</Typography>
                                    <Typography variant="body2" className={`${style.orderRequest__typoraphy__dialog}`}><strong>Scale:</strong> X: {mask.scaleX}, Y: {mask.scaleY}</Typography>
                                    {/* Material Details */}
                                    {mask.itemMaterial && (
                                        <Typography variant="body2" className={`${style.orderRequest__typoraphy__dialog}`}><strong>Material ID:</strong> {mask.itemMaterial.materialID}</Typography>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <DialogActions>
                    <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white"
                        style={
                            {
                                border: `1px solid ${primaryColor}`,
                                borderRadius: 4,
                                marginBottom: 10,
                                marginRight: 10,
                                backgroundColor:  primaryColor, 
                                color: whiteColor
                            }
                        }
                    >
                        Download Material
                    </button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default PartOfDesignInformationDialogComponent;
