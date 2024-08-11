import React, { useState } from 'react';
import { Button, TextField, Box, Typography, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ExcelData } from '../../../../../models/BrandMaterialExcelModel';

interface EditMultipleMaterialInExcelTableProps {
    open: boolean;
    onClose: () => void;
    data: ExcelData;
    index: number;
    updateData: (editedData: ExcelData, index: number) => void;
}

const EditMultipleMaterialInExcelTable: React.FC<EditMultipleMaterialInExcelTableProps> = ({ open, onClose, data, index, updateData }) => {
    const [editedData, setEditedData] = useState<any>(data);

    const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

    const _handleSave = () => {
        updateData(editedData, index);
        onClose();
    };


    return (

        <Box style={{ height: '500px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                Edit Material
            </Typography>
            <IconButton
                style={{ position: "absolute", top: 0, right: 0 }}
                onClick={onClose}
            >
                <CloseIcon />
            </IconButton>
            <Box height={50} />
            <Grid container spacing={4}>
                <Grid item xs={11}>
                    <TextField name="Category_Name" label="Category Name" value={editedData?.Category_Name} fullWidth />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="Material_Name" label="Material Name" value={editedData?.Material_Name} fullWidth />

                </Grid>
                <Grid item xs={11}>
                    <TextField name="Price" label="Price" value={editedData?.Price} type='number' onChange={_handleChange} fullWidth />

                </Grid>
                <Grid item xs={11}>
                    <TextField name="unit" label="Unit" value={editedData?.Unit} fullWidth />

                </Grid>
            </Grid>
            <div onClick={onClose} style={{ textAlign: "center", alignItems: "center", marginTop: "3rem" }}>
                <Button onClick={_handleSave} style={{ backgroundColor: "#EC6208", width: "60%", borderRadius: "8px", marginLeft: "-10%", marginRight: "10%", color: "#FFFFFF" }}>Update</Button>
                <Button style={{ borderRadius: "8px", border: "1px solid black", color: "black" }}>Cancel</Button>

            </div>
        </Box>
    );
};

export default EditMultipleMaterialInExcelTable;
