import * as React from "react";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import { UpdateMaterial } from "../../../../../models/BrandMaterialExcelModel";

interface EditMaterialPopUpScreenFormProps {
    fid: {
        id: number,
        brandName: string,
        categoryName: string,
        materialName: string,
        hsCode: number,
        unit: string,
        basePrice: number,
        brandPrice: number
    };
    editClose: () => void;
    updateMaterial: (updatedMaterial: UpdateMaterial) => void;
}

const EditMaterialPopUpScreens: React.FC<EditMaterialPopUpScreenFormProps> = ({ fid, editClose, updateMaterial }) => {


    const [categoryName, setCategoryName] = React.useState("");
    const [materialName, setMaterialName] = React.useState("");
    const [price, setPrice] = React.useState(0);
    const [unit, setUnit] = React.useState("");

    React.useEffect(() => {
        setCategoryName(fid.categoryName);
        setMaterialName(fid.materialName);
        setPrice(fid.basePrice);
        setUnit(fid.unit)
        // setUnit(fid.hsCode)
        // setUnit(fid.brandName)
        // setUnit(fid.unit)
        // setUnit(fid.unit)
    }, [fid]);

    const _handleCategoryNamehange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
    }

    const _handleMaterialNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaterialName(e.target.value);
    }

    const _handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnit(e.target.value);
    }

    const _handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = parseInt(e.target.value)
        setPrice((newPrice))
    }


    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    const _handleSubmit = () => {
        const obj = {
            category_name: categoryName,
            material_name: materialName,
            price: price,
            unit: unit
        };
        const id = fid.id;

        fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_CHART/' + id, {
            method: 'PUT',
            body: JSON.stringify({
                ...obj, id
            }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                console.log('Response:', res);
                if (!res) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                updateMaterial(data);
                sessionStorage.setItem("obj", JSON.stringify(obj));
                Swal.fire(
                    `${t(codeLanguage + '000069')}`,
                    `${t(codeLanguage + '000070')}`,
                    'success'
                );
            })
            .catch((err) => {
                console.error('Update Error:', err);
                Swal.fire(
                    `${t(codeLanguage + '000071')}`,
                    `${t(codeLanguage + '000072')}`,
                    'error'
                );
            });
    }

    return (
        <Box style={{ height: '500px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                {t(codeLanguage + '000068')}
            </Typography>
            <IconButton
                style={{ position: "absolute", top: 0, right: 0 }}
                onClick={editClose}
            >
                <CloseIcon />
            </IconButton>
            <Box height={50} />
            <Grid container spacing={4}>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Category Name" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={categoryName} onChange={_handleCategoryNamehange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Material Name" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={materialName} onChange={_handleMaterialNameChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Price" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={price} onChange={_handlePriceChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Unit" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={unit} onChange={_handleUnitChange} />
                </Grid>
            </Grid>
            <div onClick={editClose} style={{ textAlign: "center", alignItems: "center", marginTop: "3rem" }}>
                <Button onClick={_handleSubmit} style={{ backgroundColor: "#5858FA", width: "60%", borderRadius: "8px", marginLeft: "-10%", marginRight: "10%", color: "#FFFFFF" }}>{t(codeLanguage + '000060')}</Button>
                <Button style={{ borderRadius: "8px", border: "1px solid black", color: "black" }}>{t(codeLanguage + '000055')}</Button>
            </div>
        </Box>
    );
}

export default EditMaterialPopUpScreens;
