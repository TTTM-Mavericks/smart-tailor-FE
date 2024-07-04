import React from 'react';
import { Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { ItemMaskInterface, PartOfDesignInterface } from '../../../models/DesignModel';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { redColor } from '../../../root/ColorSystem';

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
            <DialogContent dividers>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" className="text-teal-700"><strong>Part Name:</strong> {part?.partOfDesignName}</Typography>
                        <Typography variant="body1" className="text-teal-700"><strong>Material ID:</strong> {part?.materialID}</Typography>
                        {part?.imgUrl && <img src={part.imgUrl} alt="Part Image" style={{width: 300, height: 350, marginTop: 20}} />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* Display Item Masks */}
                        <Typography variant="h6" className="text-teal-800 font-semibold mb-2">Item Masks</Typography>
                        {part?.itemMasks && part.itemMasks.map((mask: ItemMaskInterface) => (
                            <Grid container spacing={4} key={mask.itemMaskID} className="mb-4 p-4 bg-gray-50 rounded shadow-md">
                                <Grid item xs={12} sm={6}>
                                    {mask.imageUrl && <img src={mask.imageUrl} alt="Mask Image" style={{width: 150, height: 150}} />}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography style={{fontSize: 13}} className="text-teal-600"><strong>Item Mask Name:</strong> {mask.itemMaskName}</Typography>
                                    <Typography style={{fontSize: 13}} className="text-teal-600"><strong>Type:</strong> {mask.typeOfItem}</Typography>
                                    <Typography style={{fontSize: 13}} className="text-teal-600"><strong>Position:</strong> X: {mask.positionX}, Y: {mask.positionY}</Typography>
                                    <Typography style={{fontSize: 13}} className="text-teal-600"><strong>Scale:</strong> X: {mask.scaleX}, Y: {mask.scaleY}</Typography>
                                    {/* Material Details */}
                                    {mask.itemMaterial && (
                                        <Typography style={{fontSize: 13}} className="text-teal-600"><strong>Material ID:</strong> {mask.itemMaterial.materialID}</Typography>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default PartOfDesignInformationDialogComponent;
