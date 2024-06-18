import * as React from 'react';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { Cancel, CheckCircleRounded, Close, ErrorOutline } from '@mui/icons-material';
import * as XLSX from "xlsx-js-style";
import { tokens } from '../../../../theme';
import { useTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditMultipleUsersInExcelTable from './CRUDWithExcelTable/EditMultipleMaterialInExcelTable';
import AddUserModalInExcelTable from './CRUDWithExcelTable/AddMaterialInExcelTable';
const ADDUSERWITHFILEEXCELS = 'http://localhost:3000/Import_Brand_Material.xlsx';
import { useTranslation } from 'react-i18next';
import { ExcelData } from '../../../../models/AdminMaterialExcelModel';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import ExcelJS from 'exceljs';
import { toast, ToastContainer } from 'react-toastify';

interface AddMaterialWithMultipleExcelFormProps {
    closeMultipleCard: () => void;
    addNewMaterial: (addedNewMaterial: ExcelData) => void
}


// Make Style of popup
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: "20px"
};

const AddMultipleComponentWithExcel: React.FC<AddMaterialWithMultipleExcelFormProps> = ({ closeMultipleCard, addNewMaterial }) => {

    // ---------------UseState Variable---------------//
    const [error, setError] = React.useState<string>('');
    const [excelData, setExcelData] = React.useState<ExcelData[]>([]);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [originalData, setOriginalData] = React.useState<ExcelData[]>([]);
    const [editingData, setEditingData] = React.useState<ExcelData | null>(null);
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
    const [editOpen, setEditOpen] = React.useState<boolean>(false);
    const [openAddUserModal, setOpenAddUserModal] = React.useState<boolean>(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loading, setLoading] = React.useState<boolean>(false);

    // ---------------Usable Variable---------------//
    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();

    const hasDataChanged = () => {
        if (JSON.stringify(originalData) !== JSON.stringify(excelData)) {
            return false;
        }
        return true;
    };

    const confirmDelete = (index: number) => {
        const result = window.confirm('Are you sure? Do you want to delete this user?');
        if (result) {
            const newData = [...excelData];
            newData.splice(index, 1);
            setExcelData(newData);
            window.alert('User has been deleted.');
        }
    };

    // Hàm xác nhận chỉnh sửa dữ liệu
    const confirmEdit = (index: number) => {
        setEditingIndex(index);
        setEditingData(excelData[index]);
        _handleEditOpen();
    };

    // Hàm để cập nhật dữ liệu sau khi chỉnh sửa
    const updateData = (updatedData: ExcelData, index: number) => {
        const newData = [...excelData];
        newData[index] = updatedData;
        setExcelData(newData);
        setEditingData(null);
        setEditingIndex(null);
    };

    // Hàm để hủy chỉnh sửa dữ liệu
    const cancelEdit = () => {
        setEditingData(null);
        setEditingIndex(null);
        _handleEditClose()
    };

    // ---------------UseEffect---------------//
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    // ---------------FunctionHandler---------------//

    /**
    * 
    * @param e 
    * @returns 
    * Check Validate With The File
    * If file not excel then show error
    */
    const _handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
                file.type !== 'application/vnd.ms-excel') {
                toast.error('Only .xlsx and .xls file types are allowed.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    if (event.target && event.target.result) {
                        const data = new Uint8Array(event.target.result as ArrayBuffer);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json<ExcelData>(sheet);

                        // Update error property for duplicate entries
                        const updatedData = jsonData.map(item => {
                            const hasNullName = !item.materialName;
                            return { ...item, error: hasNullName };
                        });

                        setSelectedFile(file);
                        setExcelData(updatedData)
                        setOriginalData(updatedData);
                        updatedData.forEach(item => {
                            console.log(`Category: ${item.Category_Name}, Material Name: ${item.Material_Name}, Unit: ${item.Unit}`);
                        });
                        console.log(updatedData);
                    }
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                    toast.error('Error parsing Excel file');
                }
            };
            reader.readAsArrayBuffer(file);

        }
    };

    /**
     * Upload The File and Brand Name to Back End
     * If one field Error or dupplicate then it throw error
     */
    const _handleUploadData = async () => {
        if (!selectedFile) {
            console.error('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('brandName', 'LA LA LISA BRAND');

        // Log information about the file
        console.log('File name:', selectedFile.name);
        console.log('File size:', selectedFile.size);
        console.log('File type:', selectedFile.type);

        try {
            const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0YW1tdHNlMTYxMDg3QGZwdC5lZHUudm4iLCJpYXQiOjE3MTgyODUyMTMsImV4cCI6MTcxODM3MTYxM30.UUpy2s9SwYGF_TyIru6VASQ-ZzGTOqx7mkWkcSR2__0'; // Replace with the actual bearer token
            const response = await axios.post(`${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_material + functionEndpoints.brand.addExcel}`, formData,

                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Handle successful response
            console.log('Data uploaded successfully:', response);
        } catch (error: any) {
            // Check for specific error status codes
            if (error.response) {
                if (error.response.status === 400) {
                    console.error('Failed to upload data: Bad Request');
                } else if (error.response.status === 401) {
                    console.error('Failed to upload data: Unauthorized');
                } else {
                    console.error('Failed to upload data: Unknown Error');
                }
            } else {
                console.error('Error uploading data:', error.message);
            }
            setError('An error occurred while uploading data');
        }
    };

    /**
     * When User click on Ok Button It will check
     * Check the data change (update or delete)
     * Check if categoryName and materialName are duplicate
     * Check if categoryName, materialName, hscode, basePrice, and unit are null
     * If there are validation errors, download the error data
     * If not, upload data
     */
    const _handleConfirm = async () => {
        // Check if there are duplicate entries or missing values
        const duplicates = checkForDuplicates(excelData, ['Category_Name', 'Material_Name']);
        const invalidEntries = excelData.some(item =>
            !item.Category_Name || !item.Material_Name || !item.HS_Code || item.Base_Price === null || !item.Unit
        );

        if (invalidEntries || duplicates.size > 0) {
            setError('The value is dupplicate or null!')
        } else {
            await _handleUploadData();
            closeMultipleCard();
        }
    };

    // ---------------Handle Modal---------------//

    // Open Modal
    const _handleEditOpen = () => setEditOpen(true);

    // Close Modal
    const _handleEditClose = () => setEditOpen(false);

    // Handle Open Add User Modal
    const _handleAddUserOpen = () => setOpenAddUserModal(true);

    // Handle Close Add User Modal
    const _handleAddUserClose = () => setOpenAddUserModal(false);

    // Define a custom type for your data structure
    interface ExcelRowData {
        [key: string]: any;
    }

    // Function to check for duplicate values in specific columns
    const checkForDuplicates = (data: ExcelRowData[], columns: string[]) => {
        const duplicates: Set<string> = new Set();
        const seen: Set<string> = new Set();

        data.forEach(row => {
            const key = columns.map(column => row[column]).join('|');
            if (seen.has(key)) {
                duplicates.add(key);
            } else {
                seen.add(key);
            }
        });

        return duplicates;
    };

    const checkDuplicatesForUI = (data: ExcelRowData[], columns: string[]) => {
        const seen = new Set<string>();
        const result: ExcelRowData[] = [];

        for (const row of data) {
            const key = columns.map(column => row[column]).join('|');
            if (seen.has(key)) {
                result.push({ ...row, duplicate: true });
            } else {
                seen.add(key);
                result.push({ ...row, duplicate: false });
            }
        }

        return result;
    };

    const isNameAndCategoryDuplicate = (data: ExcelData, index: number) => {
        return excelData.some((item, i) => i !== index && item.Category_Name === data.Category_Name && item.Material_Name === data.Material_Name);
    };


    const _handleDownloadErrorData = async () => {
        const workBook = new ExcelJS.Workbook();
        const worksheet = workBook.addWorksheet('Error Data');

        worksheet.columns = [
            { header: 'Category_Name', key: 'Category_Name', width: 25 },
            { header: 'Material_Name', key: 'Material_Name', width: 25 },
            { header: 'HS_Code', key: 'HS_Code', width: 20 },
            { header: 'Base_Price', key: 'Base_Price', width: 20 },
            { header: 'Unit', key: 'Unit', width: 20 },
        ];

        const rows = excelData.map(item => ({
            Category_Name: item.Category_Name,
            Material_Name: item.Material_Name,
            HS_Code: item.HS_Code,
            Base_Price: item.Base_Price,
            Unit: item.Unit,
            error: item.error
        }));

        // Identify and sort rows with errors
        const rowsWithError = rows.filter(row => {
            const hasNullValues = Object.values(row).some(value => value === null || value === '' || value === undefined);
            const isCategoryNameNull = row.Category_Name === null || row.Category_Name === undefined;
            const isMaterialNameNull = row.Material_Name === null || row.Material_Name === undefined;
            const isHsCodeNull = row.HS_Code === null || row.HS_Code === undefined;
            const isBasePriceNull = row.Base_Price === null || row.Base_Price === undefined;

            return hasNullValues || isCategoryNameNull || isMaterialNameNull || isHsCodeNull || isBasePriceNull;
        });

        const rowsWithoutError = rows.filter(row => !rowsWithError.includes(row));

        // Concatenate rows with errors first
        const sortedRows = [...rowsWithError, ...rowsWithoutError];

        // Add rows to the worksheet
        worksheet.addRows(sortedRows);

        // Set styles for header row
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Apply validation and coloring for errors
        const duplicates = checkForDuplicates(sortedRows, ['Category_Name', 'Material_Name']);

        sortedRows.forEach((row, rowIndex) => {
            const excelRow = worksheet.getRow(rowIndex + 2); // +2 to account for header row and 1-based index
            excelRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const columnName = worksheet.getColumn(colNumber).key as string;
                const value = row[columnName];

                if (columnName === 'Category_Name' || columnName === 'Material_Name') {
                    if (duplicates.has(`${row.Category_Name}|${row.Material_Name}`)) {
                        const duplicateRowNumber = sortedRows.findIndex(r => r.Category_Name === row.Category_Name && r.Material_Name === row.Material_Name && r !== row) + 2;
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFF00' }, // Yellow fill for errors
                        };
                        cell.value = `${value} #Duplicate with row ${duplicateRowNumber}`;
                    } else if (!value) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFF00' }, // Yellow fill for errors
                        };
                        cell.value = 'Null Value';
                    }
                } else if (columnName === 'HS_Code' || columnName === 'Base_Price' || columnName === 'Unit') {
                    if (!value) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFF00' }, // Yellow fill for errors
                        };
                        cell.value = 'null value';
                    }
                }
            });
        });

        const buf = await workBook.xlsx.writeBuffer();

        const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "ErrorData.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', maxHeight: '80vh', overflowY: 'auto', position: "relative" }}>
            <Typography variant="h5" align="center" marginBottom={"20px"}>
                {t(codeLanguage + '000052')}
            </Typography>
            <IconButton
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#E96208',
                    borderRadius: '50%',
                    padding: '5px',
                    color: "white"
                }}
                onClick={closeMultipleCard}
            >
                <Close />
            </IconButton>
            <Button
                variant="contained"
                color="primary"
                href={ADDUSERWITHFILEEXCELS}
                download
                endIcon={<DownloadIcon />}
                style={{
                    color: 'white',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#E96208'
                }}
            >
                {t(codeLanguage + '000053')}
            </Button>
            {/* {
                excelData.length > 0 && !editingData && (
                    <>
                        <Button onClick={_handleOpenAddUserModal}>Add User</Button>
                        <AddUserModalInExcelTable open={openAddUserModal} onClose={_handleCloseAddUserModal} onAddUser={_handleAddUser} />
                    </>
                )
            } */}

            <div style={{ display: "flex" }}>
                <input
                    type="file"
                    onChange={_handleFileInputChange}
                    accept=".xlsx, .xls"
                    style={{ marginBottom: '20px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginRight: "20px" }}
                />
                <ToastContainer />
            </div>

            {
                (excelData.length > 0 || error) && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
                        <div>
                            <p style={{ color: 'red', textAlign: "center" }}>{error}</p>
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<DownloadIcon />}
                            style={{
                                color: 'white',
                                marginBottom: '20px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                backgroundColor: '#E96208',
                                marginLeft: "20px"
                            }}
                            onClick={_handleDownloadErrorData}
                        >
                            Download Data
                        </Button>
                    </div>
                )
            }

            {
                excelData.length > 0 && (
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: colors.primary[100] }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category Name</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Material Name</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>HS CODE</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Unit</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Base Price</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Error Check</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map((data, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Category_Name ? colors.primary[200] : 'red' }} >{data.Category_Name || 'Null Category Name'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Material_Name ? colors.primary[200] : 'red' }}>{data.Material_Name || 'Null Material Name'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.HS_Code ? colors.primary[200] : 'red' }}>{data.HS_Code || 'Null Hs Code'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Unit ? colors.primary[200] : 'red' }}>{data.Unit || 'Null Unit'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Base_Price ? colors.primary[200] : 'red' }}>{data.Base_Price || 'Null Base Price'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.error ? 'red' : 'green' }}>
                                            {(() => {
                                                const hasNullValues = Object.values(data).some(value => value === null || value === undefined);
                                                const isCategoryNameNull = data.Category_Name === null || data.Category_Name === undefined;
                                                const isMaterialNameNull = data.Material_Name === null || data.Material_Name === undefined;
                                                const isHsCodeNull = data.HS_Code === null || data.HS_Code === undefined;
                                                const isBasePriceNull = data.Base_Price === null || data.Base_Price === undefined;
                                                const isUnit = data.Unit === null || data.Unit === undefined;
                                                const isDuplicate = excelData.some((item, i) => {
                                                    if (i !== index) {
                                                        return item.Category_Name === data.Category_Name && item.Material_Name === data.Material_Name;
                                                    }
                                                    return false;
                                                });

                                                if (hasNullValues || isCategoryNameNull || isMaterialNameNull || isHsCodeNull || isBasePriceNull || isDuplicate) {
                                                    const errorMessage = [];
                                                    if (hasNullValues) errorMessage.push('Null Values');
                                                    if (isCategoryNameNull) errorMessage.push('Category Name Is Null');
                                                    if (isBasePriceNull) errorMessage.push('Base Price Is Null');
                                                    if (isMaterialNameNull) errorMessage.push('Material Name Is Null');
                                                    if (isUnit) errorMessage.push('Unit Is Null');
                                                    if (isDuplicate) errorMessage.push('Duplicate Entry');

                                                    return (
                                                        <div style={{ color: 'red' }}>
                                                            <ErrorOutline style={{ color: 'red' }} />
                                                            {errorMessage.join(', ')}
                                                        </div>
                                                    );
                                                } else {
                                                    return <CheckCircleRounded style={{ color: 'green' }} />;
                                                }
                                            })()}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            <div style={{ display: "flex" }}>
                                                <EditIcon style={{ color: "blue", cursor: "pointer" }} onClick={() => confirmEdit(index)} />
                                                <DeleteIcon style={{ color: "red", cursor: "pointer" }} onClick={() => confirmDelete(index)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }

            <Modal
                open={editOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {editingData !== null && (
                        <EditMultipleUsersInExcelTable
                            data={editingData} index={editingIndex} updateData={updateData} onClose={cancelEdit}
                        />
                    )}
                </Box>
            </Modal>

            <div style={{ display: "flex", justifyContent: 'center', marginTop: '20px' }}>
                <div style={{ marginRight: '10px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={closeMultipleCard}
                        endIcon={<Cancel />}
                        style={{ backgroundColor: '#088FE9', color: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
                    >
                        {t(codeLanguage + '000055')}
                    </Button>
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={_handleConfirm}
                        endIcon={<CheckCircleRounded />}
                        style={{ backgroundColor: '#E96208', color: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
                    >
                        {t(codeLanguage + '000056')}
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default AddMultipleComponentWithExcel;
