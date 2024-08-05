import * as React from 'react';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { Cancel, CheckCircleRounded, Close } from '@mui/icons-material';
import * as XLSX from "xlsx-js-style";
import { tokens } from '../../../../../theme';
import { useTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditMultipleMaterialInExcelTable from '../EditMaterialInExcelTable/EditMultipleUsersInExcelTable';
import { useTranslation } from 'react-i18next';
import { AddExcelMultiple, ExcelData } from '../../../../../models/BrandMaterialExcelModel';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import axios from 'axios';
const brand_name = "LA LA LISA BRAND"
import ExcelJS from 'exceljs';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { UserInterface } from '../../../../../models/UserModel';

// const BRANDNAME = localStorage.getItem('brandName')

interface AddMaterialWithMultipleExcelFormProps {
    closeMultipleCard: () => void;
    addNewMaterial: (addNewMaterial: AddExcelMultiple[]) => void
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

const BRANDID = localStorage.getItem('userAuth')
const AddMultipleMaterialWithExcel: React.FC<AddMaterialWithMultipleExcelFormProps> = ({ closeMultipleCard, addNewMaterial }) => {
    // ---------------UseState Variable---------------//
    const [error, setError] = React.useState<string>('');
    const [excelData, setExcelData] = React.useState<ExcelData[]>([]);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [originalData, setOriginalData] = React.useState<ExcelData[]>([]);
    const [editingData, setEditingData] = React.useState<ExcelData | null>(null);
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
    const [editOpen, setEditOpen] = React.useState<boolean>(false);
    const [addData, setAddData] = React.useState<ExcelData[]>([])
    const [errorCheckGet, setErrorCheckGet] = React.useState([])
    // ---------------Usable Variable---------------//
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    let brandAuth: any = null;

    const BRANDROLECHECK = Cookies.get('userAuth');

    if (BRANDROLECHECK) {
        try {
            brandAuth = JSON.parse(BRANDROLECHECK);
            const { userID, email, fullName, language, phoneNumber, roleName, imageUrl, userStatus } = brandAuth;
            // Your code that uses the parsed data
        } catch (error) {
            console.error('Error parsing JSON:', error);
            // Handle the error, perhaps by setting default values or showing an error message
        }
    } else {
        console.error('userAuth cookie is not set');
        // Handle the case when the cookie does not exist
    }


    let brandFromSignUp: any = null
    // Get BrandID from session
    const getBrandFromSingUp = sessionStorage.getItem('userRegister') as string | null;

    if (getBrandFromSingUp) {
        const BRANDFROMSIGNUPPARSE: UserInterface = JSON.parse(getBrandFromSingUp);
        const brandID = BRANDFROMSIGNUPPARSE.userID;
        const brandEmail = BRANDFROMSIGNUPPARSE.email;
        brandFromSignUp = { brandID, brandEmail }
        console.log(brandFromSignUp);

        console.log('Brand ID:', brandID);
        console.log('Brand Email:', brandEmail);
    } else {
        console.error('No user data found in session storage');
    }
    // Get ID When something null
    const getID = () => {
        if (!brandAuth || brandAuth.userID === null || brandAuth.userID === undefined || brandAuth.userID === '') {
            return brandFromSignUp.brandID;
        } else {
            return brandAuth.userID;
        }
    };
    console.log(getID() + " bebe");

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


    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();

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
                        const jsonData = XLSX.utils.sheet_to_json<ExcelData>(sheet, { range: 1 });

                        // Update error property for duplicate entries
                        const updatedData = jsonData.map(item => {
                            const hasNullName = !item.materialName;
                            return { ...item, error: hasNullName };
                        });

                        setSelectedFile(file);
                        setExcelData(updatedData)
                        setOriginalData(updatedData);
                        setAddData(updatedData);
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
        formData.append('brandID', getID());

        // Log information about the file
        console.log('File name:', selectedFile.name);
        console.log('File size:', selectedFile.size);
        console.log('File type:', selectedFile.type);


        const transformedData = addData.map(item => ({
            basePrice: item.Base_Price,
            categoryName: item.Category_Name,
            materialName: item.Material_Name,
            unit: item.Unit,
            hsCode: item.HS_Code,
            brandPrice: item.Brand_Price
        }));

        try {
            // const token = Cookies.get('token');
            const response = await axios.post(`${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_material + functionEndpoints.brand.addExcel}`, formData,
                // {
                //     headers: {
                //         'Authorization': `Bearer ${token}`
                //     }
                // }
            );

            // Handle successful response
            if (response.data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Add Brand Price Success!',
                    text: 'Add Brand Price Success!'
                });
                addNewMaterial(transformedData)
                closeMultipleCard();
            }
        } catch (error: any) {
            // Check for specific error status codes
            if (error.response) {
                const errorMessage = error.response.data.message;
                // Check for specific error messages or status codes
                if (error.response.status === 400) {
                    setErrorCheckGet(error.response.data.errors);
                    toast.error(errorMessage);
                } else {
                    toast.error('Unknown Error');
                }
            } else {
                toast.error('Error uploading data');
            }
        }
    };


    /**
     * When User click on Ok Button It will check
     * Check the data change (update or delete)
     * Chekc the validate of the price (null, undefine, < 0)
     * if have validate then move to _handleDownloadErrorData
     * If not then upload data
     */
    const _handleConfirm = async () => {
        // Check if any price is less than 0 or null
        const invalidPrice = excelData.some(item => item.Brand_Price === null || item.Brand_Price < 0 || item.Brand_Price === undefined);

        if (invalidPrice) {
            setError('Price must be greater than or equal to 0 for all items');
        }
        if (!hasDataChanged()) {
            setError('The data of file excel have change please download and push again!')
        }
        else {
            // Proceed with upload if all prices are valid
            await _handleUploadData();
        }
    };

    /**
     * Download Error Data When One Fields Error or Dupplicate
     * If Error then download all data in CSV and fill color yellow to the fields
     * The columns Material, Category, Hs Code, Unit, Base Price is view only and can not edit
     * Download CSV File for the Brand to save in the local computer
     */
    const _handleDownloadBrandErrorData = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Brand Material');

            // Define the columns and headers
            worksheet.columns = [
                { header: 'Category_Name', key: 'Category_Name', width: 25 },
                { header: 'Material_Name', key: 'Material_Name', width: 25 },
                { header: 'HS_Code', key: 'HS_Code', width: 20 },
                { header: 'Unit', key: 'Unit', width: 20 },
                { header: 'Base_Price', key: 'Base_Price', width: 20 },
                { header: 'Brand_Price', key: 'Brand_Price', width: 20 }
            ];

            // Insert a custom header row above the defined columns
            worksheet.insertRow(1, ['BRAND MATERIAL ERRORS']);

            // Merge cells for the custom header row
            worksheet.mergeCells('A1:F1');
            worksheet.autoFilter = 'A2:F2';  // Apply filter to the actual header row

            // Set styles for the custom header row
            const customHeaderRow = worksheet.getRow(1);
            customHeaderRow.height = 30;
            customHeaderRow.eachCell(cell => {
                cell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF0000' }  // Red background
                };
            });

            // Set styles for column header row
            worksheet.getRow(2).eachCell(cell => {
                cell.font = { bold: true };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD3D3D3' }  // Light grey background
                };
            });

            // Create a map to store error messages for each cell
            const errorMap = new Map();
            // Create a set to store the row numbers with errors
            const errorRows = new Set();

            const allColumns = ['Category_Name', 'Material_Name', 'HS_Code', 'Unit', 'Base_Price', 'Brand_Price'];

            // Assuming errorCheckGet is available in this context
            errorCheckGet.forEach((error: any) => {
                error.errorMessage.forEach((message: any) => {
                    const materialNameMatch = message.match(/Material_Name at row Index (\d+) not found/);
                    if (materialNameMatch) {
                        const rowIndex = parseInt(materialNameMatch[1], 10);
                        const actualRowIndex = rowIndex + 1; // Adjust index to match Excel rows

                        // Mark all columns for this row as erroneous
                        allColumns.forEach(column => {
                            const key = `${actualRowIndex}-${column}`;
                            if (!errorMap.has(key)) {
                                errorMap.set(key, []);
                            }
                            errorMap.get(key).push(message);
                        });
                        errorRows.add(actualRowIndex);
                    } else {
                        const match = message.match(/(Category_Name|Material_Name|HS_Code|Unit|Base_Price|Brand_Price) at row Index (\d+) (.*)!/);
                        if (match) {
                            const [_, column, rowIndex, errorDetail] = match;
                            const actualRowIndex = parseInt(rowIndex, 10) + 1; // Adjust index to match Excel rows
                            const key = `${actualRowIndex}-${column}`;
                            if (!errorMap.has(key)) {
                                errorMap.set(key, []);
                            }
                            errorMap.get(key).push(message);
                            errorRows.add(actualRowIndex);
                        }
                    }
                });
            });

            // Add only error rows to the worksheet
            excelData.forEach((rowData, rowIndex) => {
                if (errorRows.has(rowIndex + 4)) {
                    const row = worksheet.addRow(rowData);

                    worksheet.columns.forEach((column, colIndex) => {
                        const cell = row.getCell(colIndex + 1);
                        const errorKey = `${rowIndex + 4}-${column.key}`;

                        if (cell.value === null) {
                            cell.value = 'NULL';
                            cell.font = { color: { argb: 'FF808080' } };
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFFFFF00' },
                            };
                        }

                        if (errorMap.has(errorKey)) {
                            const errors = errorMap.get(errorKey);
                            cell.value = {
                                richText: [
                                    { text: `${cell.value || ''}\n`, font: { color: { argb: '000000' } } },
                                    { text: `Error: ${errors.join('\n')}`, font: { color: { argb: 'FFFF0000' } } }
                                ]
                            };
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFFFFF00' },
                            };
                        }

                        // Additional check for Brand_Price
                        if (column.key === 'Brand_Price') {
                            const value = cell.value as number | undefined;
                            if (value === undefined || value < 0) {
                                cell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'FFFFFF00' }
                                };
                                cell.value = {
                                    richText: [
                                        { text: `${value}\n`, font: { color: { argb: '000000' } } },
                                        { text: 'Error: Price must be more than 0', font: { color: { argb: 'FFFF0000' } } }
                                    ]
                                };
                            }
                        }

                        cell.alignment = { wrapText: true, vertical: 'top' };
                    });
                }
            });

            // Generate and save the file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(blob, "Brand_Material_Errors.xlsx");
        } catch (error) {
            console.error("Error generating Excel file:", error);
            alert("Error generating Excel file. Please try again.");
        }
    };

    /**
     * Saves the blob as a file with the given fileName.
     * @param blob The Blob data to save.
     * @param fileName The name of the file to save as.
     */
    function saveAs(blob: Blob, fileName: string): void {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    /**
    * Download the sample data
    */
    const _handleDownloadSampleExcelFile = () => {
        const url = `${baseURL + versionEndpoints.v1 + featuresEndpoints.material + functionEndpoints.material.downloadSampleBrandPriceExcelData}`; // Replace with your API endpoint

        axios({
            url: url,
            method: 'GET',
            responseType: 'blob', // Important to handle binary data
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'Brand_Price_Sample_File.xlsx'; // Replace with your desired file name
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('There was an error downloading the file!', error);
            });
    };

    /**
     * 
     * @returns 
     * Open the edit pop up
     */
    const _handleEditOpen = () => setEditOpen(true);

    /**
     * 
     * @returns 
     * Close the Edit Popup
     */
    const _handleEditClose = () => setEditOpen(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', maxHeight: '80vh', overflowY: 'auto', position: "relative" }}>
            <Typography variant="h5" align="center" marginBottom={"20px"}>
                {t(codeLanguage + '000216')}
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
                onClick={_handleDownloadSampleExcelFile}
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

            <div style={{ display: "flex" }}>
                <input
                    type="file"
                    onChange={_handleFileInputChange}
                    accept=".xlsx, .xls"
                    style={{ marginBottom: '20px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginRight: "20px" }}
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
                            onClick={_handleDownloadBrandErrorData}
                        >
                            Download Error Data
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
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Brand Price</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map((data, index) => (
                                    <tr key={data.id}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Category_Name ? colors.primary[200] : 'red' }}>{data.Category_Name || 'Null Category Name'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Material_Name ? colors.primary[200] : 'red' }}>{data.Material_Name || 'Null Material Name'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.HS_Code ? colors.primary[200] : 'red' }}>{data.HS_Code || 'Null'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Unit ? colors.primary[200] : 'red' }}>{data.Unit || 'Null Unit'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Base_Price ? colors.primary[200] : 'red' }}>{data.Base_Price || 'Null Base Price'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Brand_Price ? colors.primary[200] : 'red' }}>{data.Brand_Price || 'Null Price'}</td>
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
                        <EditMultipleMaterialInExcelTable
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
                        style={{ backgroundColor: '#FF3232', color: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
                    >
                        {t(codeLanguage + '000055')}
                    </Button>
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={_handleUploadData}
                        endIcon={<CheckCircleRounded />}
                        style={{ backgroundColor: 'green', color: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
                    >
                        {t(codeLanguage + '000056')}
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default AddMultipleMaterialWithExcel;
