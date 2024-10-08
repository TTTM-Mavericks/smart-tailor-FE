import * as React from 'react';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { Cancel, CancelOutlined, CheckCircleRounded, Close } from '@mui/icons-material';
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
import { greenColor, redColor } from '../../../../../root/ColorSystem';
import { __getToken } from '../../../../../App';

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
                        const jsonData = XLSX.utils.sheet_to_json<ExcelData>(sheet, { range: 2 });

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
            const response = await axios.post(
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_material + functionEndpoints.brand.addExcel}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${__getToken()}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
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
                    toast.error(errorMessage);
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
        const workBook = new ExcelJS.Workbook();
        const worksheet = workBook.addWorksheet('Brand Material');

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
        worksheet.insertRow(1, ['BRAND PRICE MATERIAL ERRORS']);
        worksheet.insertRow(2, [`
            Explanation:
• Category_Name: Only values from the predefined list of categories in the Smart Tailor application are allowed.
• Base_Price: Only positive integer values are allowed, and the currency unit is VND.
• HS_Code: Only positive integer values are allowed.
• Brand_Price: Only positive integer values are allowed, and the currency unit is VND.Brand_Price must be between 92.0 % and 108.0 % of Base_Price.
If the brand does not have a material for this entry, the field may be left blank.'`]);

        // Merge cells for the custom header row
        worksheet.mergeCells('A1:F1');
        worksheet.mergeCells('A2:F2');
        worksheet.autoFilter = 'A3:F3';  // Apply filter to the actual header row

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

        // Custom row 2
        const customHeaderRow2 = worksheet.getRow(2);
        customHeaderRow2.height = 120;
        customHeaderRow2.eachCell(cell => {
            cell.alignment = { wrapText: true, vertical: 'top' };  // Enable text wrapping for row 2
        });

        // Set styles for column header row
        worksheet.getRow(3).eachCell(cell => {
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
        // Create a set to store the row numbers with "Brand Material is existed" error
        const existingBrandMaterialRows = new Set();

        const allColumns = ['Category_Name', 'Material_Name', 'HS_Code', 'Unit', 'Base_Price', 'Brand_Price'];

        errorCheckGet.forEach((error: any) => {
            error.errorMessage.forEach((message: any) => {
                if (message.includes("Brand Material is existed at row Index")) {
                    const rowIndexMatch = message.match(/at row Index (\d+)/);
                    if (rowIndexMatch) {
                        const rowIndex = parseInt(rowIndexMatch[1], 10);
                        const actualRowIndex = rowIndex + 1; // Adjust row index to match Excel rows
                        existingBrandMaterialRows.add(actualRowIndex);
                        errorRows.add(actualRowIndex);
                    }
                } else {
                    const match = message.match(/(Category_Name|Material_Name|HS_Code|Unit|Base_Price|Brand_Price) at row Index (\d+) (.*)/);
                    if (match) {
                        const [_, column, rowIndex, errorDetail] = match;
                        const actualRowIndex = parseInt(rowIndex, 10) + 1; // Adjust row index to match Excel rows
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
            if (errorRows.has(rowIndex + 5)) {  // Check if this row is in the errorRows set
                const row = worksheet.addRow(rowData);

                // Apply error formatting to cells with errors
                worksheet.columns.forEach((column, colIndex) => {
                    const cell = row.getCell(colIndex + 1);
                    const errorKey = `${rowIndex + 5}-${column.key}`;  // Adjust rowIndex to match error messages

                    // Handle null values
                    if (cell.value === null) {
                        cell.value = 'NULL';
                        cell.font = { color: { argb: 'FF808080' } };  // Gray color for NULL values
                    }

                    if (existingBrandMaterialRows.has(rowIndex + 5)) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFFFF00' },  // Yellow fill for entire row
                        };

                        cell.value = {
                            richText: [
                                { text: `${cell.value || ''}\n`, font: { color: { argb: '000000' } } },
                                { text: `Error: Brand Material already exists`, font: { color: { argb: 'FFFF0000' } } }
                            ]
                        };
                    } else if (errorMap.has(errorKey)) {
                        const errors = errorMap.get(errorKey);
                        cell.value = {
                            richText: [
                                { text: `${cell.value || ''}\n`, font: { color: { argb: '000000' } } },
                                { text: `Error: ${errors.join('\n')}`, font: { color: { argb: 'FFFF0000' } } }  // Red text for errors
                            ]
                        };
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFFFF00' },  // Yellow fill for errors
                        };
                    }
                    cell.alignment = { wrapText: true, vertical: 'top' };  // Enable text wrapping and align to top for all cells
                });
            }
        });

        const buf = await workBook.xlsx.writeBuffer();
        const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "Brand_Material_Errors.xlsx");
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
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${__getToken()}`,  // Add the Bearer token here
            }
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
                Add Brand Price By Excel
            </Typography>
            <IconButton
                aria-label="close"
                onClick={closeMultipleCard}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    color: '#EC6208',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                }}
            >
                <CancelOutlined />
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
                                backgroundColor: `${redColor}`,
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
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map((data, index) => {
                                    const getBrandPriceError = () => {
                                        if (data.Brand_Price == null) return 'Null';
                                        if (isNaN(data.Brand_Price)) return 'Not a number';
                                        if (data.Brand_Price < 0) return 'Negative value';
                                        return null;
                                    };
                                    const getBasePriceError = () => {
                                        if (data.Base_Price == null) return 'Null';
                                        if (isNaN(data.Base_Price)) return 'Not a number';
                                        if (data.Base_Price < 0) return 'Negative value';
                                        return null;
                                    };
                                    const brandPriceError = getBrandPriceError();
                                    const basePriceError = getBasePriceError();
                                    const hsCodeError = isNaN(Number(data.HS_Code)) ? 'Not a number' : null;
                                    const unitError = typeof data.Unit !== 'string' ? 'Not a string' : null;

                                    return (
                                        <tr key={data.id}>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Category_Name ? colors.primary[200] : 'red' }}>
                                                {data.Category_Name || 'Null Category Name'}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', color: data.Material_Name ? colors.primary[200] : 'red' }}>
                                                {data.Material_Name || 'Null Material Name'}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', color: hsCodeError ? 'red' : colors.primary[200] }}>
                                                {hsCodeError ? `${data.HS_Code} (${hsCodeError})` : data.HS_Code}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', color: unitError ? 'red' : colors.primary[200] }}>
                                                {unitError ? `${data.Unit} (${unitError})` : data.Unit}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', color: basePriceError ? 'red' : colors.primary[200] }}>
                                                {basePriceError ? `${data.Base_Price} (${basePriceError})` : data.Base_Price}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', color: brandPriceError ? 'red' : colors.primary[200] }}>
                                                {brandPriceError ? `${data.Brand_Price} (${brandPriceError})` : data.Brand_Price}
                                            </td>
                                        </tr>
                                    );
                                })}
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
                        style={{ backgroundColor: `${redColor}`, color: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
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
                        style={{ backgroundColor: `${greenColor}`, color: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
                    >
                        {t(codeLanguage + '000056')}
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default AddMultipleMaterialWithExcel;
