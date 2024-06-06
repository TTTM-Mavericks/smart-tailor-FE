import * as React from 'react';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { AgricultureOutlined, Cancel, CheckCircleRounded, Close, ErrorOutline } from '@mui/icons-material';
import * as XLSX from "xlsx-js-style";
import Swal from 'sweetalert2';
import { tokens } from '../../../../../theme';
import { useTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditMultipleMaterialInExcelTable from '../EditMaterialInExcelTable/EditMultipleUsersInExcelTable';
import AddMaterialModalInExcelTable from '../AddMaterialInExcelTable/AddMaterialInExcelTable';
const ADDUSERWITHFILEEXCELS = 'https://smart-tailor-fe.pages.dev/Add_New_Users_Sample_Files.xlsx';
import { useTranslation } from 'react-i18next';

interface ExcelData {
    id: number,
    category_name: string,
    material_name: string,
    price: number,
    unit: string,
    error: boolean
}

const brand_name = "LV"

interface AddMaterialWithMultipleExcelFormProps {
    closeMultipleCard: () => void;
    addNewMaterial: (addNewMaterial: ExcelData) => void
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

interface DuplicateCheckResponse {
    hasDuplicates: boolean;
    duplicates: ExcelData[];
}

const AddMultipleMaterialWithExcel: React.FC<AddMaterialWithMultipleExcelFormProps> = ({ closeMultipleCard, addNewMaterial }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [excelData, setExcelData] = React.useState<ExcelData[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');

    const _handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    if (event.target && event.target.result) {
                        const data = new Uint8Array(event.target.result as ArrayBuffer);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json<ExcelData>(sheet);

                        // Tạo mảng để lưu dữ liệu trùng lặp
                        const duplicateData: ExcelData[] = [];

                        // Filter out duplicates
                        // const uniqueData = jsonData.filter((item, index, self) => {
                        //     const isDuplicate = self.findIndex((t) => (
                        //         t.category_name === item.category_name && t.material_name === item.material_name && t.price === item.price && t.unit === item.unit
                        //     )) !== index;

                        //     // Nếu mục dữ liệu là trùng lặp, thêm vào mảng dữ liệu trùng lặp
                        //     if (isDuplicate) {
                        //         duplicateData.push(item);
                        //     }

                        //     return !isDuplicate;
                        // });

                        // Update error property for duplicate entries
                        const updatedData = jsonData.map(item => {
                            const isDuplicate = duplicateData.some(d => d.material_name === item.material_name);
                            const hasNullName = !item.material_name;
                            return { ...item, error: isDuplicate || hasNullName };
                        });

                        setExcelData(updatedData);
                        console.log(updatedData);
                    }
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                    setError('Error parsing Excel file');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    // Get All Data in API
    const fetchAllData = async (): Promise<ExcelData[]> => {
        try {
            const response = await fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_CHART');
            if (!response.ok) {
                throw new Error('Failed to fetch existing data');
            }
            const data: ExcelData[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching existing data:', error);
            setError('Error fetching existing data');
            return [];
        }
    };


    // Check Dupplicate
    const checkForDuplicates = (apiData: ExcelData[], excelData: ExcelData[]): DuplicateCheckResponse => {
        // const categoryNameSet = new Set();
        const materialNameSet = new Set();
        // const priceSet = new Set();
        // const unitSet = new Set();
        const duplicates: ExcelData[] = [];

        // Loop through API data to populate sets for each field
        apiData.forEach(item => {
            // categoryNameSet.add(item.category_name);
            materialNameSet.add(item.material_name);
            // priceSet.add(item.price);
            // unitSet.add(item.unit);
        });

        // Loop through Excel data to check for duplicates in each field
        excelData.forEach(item => {
            // // Check for duplicates in category name
            // if (categoryNameSet.has(item.category_name)) {
            //     duplicates.push(item);
            //     return;
            // } else {
            //     categoryNameSet.add(item.category_name);
            // }

            // Check for duplicates in material name
            if (materialNameSet.has(item.material_name)) {
                duplicates.push(item);
                return;
            } else {
                materialNameSet.add(item.material_name);
            }

            // // Check for duplicates in price
            // if (priceSet.has(item.price)) {
            //     duplicates.push(item);
            //     return;
            // } else {
            //     priceSet.add(item.price);
            // }

            // // Check for duplicates in unit
            // if (unitSet.has(item.unit)) {
            //     duplicates.push(item);
            //     return;
            // } else {
            //     unitSet.add(item.unit);
            // }
        });

        return { hasDuplicates: duplicates.length > 0, duplicates };
    };


    const _handleConfirm = async () => {
        const uniqueCols = ['material_name'];

        // Check for missing information or duplicate data
        const hasNullValues = excelData.some(data =>
            Object.values(data).some(value => value === null || value === '')
        );

        const isDuplicate = uniqueCols.some(col =>
            !isUnique(excelData, (item: any) => item[col])
        );

        // Fetch existing data from API
        const apiDataOfFetching = await fetchAllData();

        // Check for duplicates with API data
        const duplicateCheckResult = checkForDuplicates(apiDataOfFetching, excelData);

        // Combine all error conditions
        const hasErrors =
            hasNullValues ||
            isDuplicate ||
            duplicateCheckResult.hasDuplicates ||
            excelData.some(
                data =>
                    !data.category_name ||
                    !data.material_name ||
                    !data.price ||
                    !data.unit ||
                    data.error
            );

        // Custom validation checks
        const hasSpecialChars = excelData.some(data =>
            /[!@#$%^&*(),.?":{}|<>]/.test(data.category_name) ||
            /[0-9]/.test(data.category_name) ||
            /[!@#$%^&*(),.?":{}|<>]/.test(data.material_name) ||
            /[0-9]/.test(data.material_name) ||
            /[!@#$%^&*(),.?":{}|<>]/.test(data.unit)
        );

        const invalidUnit = excelData.some(data =>
            !/^(m|kg|l|mg)$/.test(data.unit)
        );

        const priceLessThan10000 = excelData.some(data => data.price <= 10000);

        if (excelData.length > 0 && !hasErrors && !hasSpecialChars && !priceLessThan10000 && !invalidUnit) {
            uploadData(excelData);
            for (const data of excelData) {
                addNewMaterial(data);
            }
            setExcelData([]);
            setLoading(false);
            setError('');
            closeMultipleCard();
            Swal.fire('Add Success!', 'User has been updated!', 'success');
        } else {
            let errorMessage = '';
            if (hasNullValues) errorMessage = 'Missing Information!';
            if (isDuplicate) errorMessage = 'Duplicate Data!';
            if (duplicateCheckResult.hasDuplicates) errorMessage = 'Duplicate Data!';
            if (hasSpecialChars) errorMessage = 'Category Name, Material Name, Unit, and Price should not contain special characters!';
            if (priceLessThan10000) errorMessage = 'Price should be more than 10000!';
            if (invalidUnit) errorMessage = 'Unit should only contain "m", "kg", "l", or "mg"!';

            setError(errorMessage);
        }
    };


    // Hàm kiểm tra tính duy nhất của một trường
    function isUnique(arr: any, selector: any) {
        const uniqueValues = new Set();
        for (const item of arr) {
            const uniqueValue = selector(item);
            if (uniqueValues.has(uniqueValue)) {
                return false;
            }
            uniqueValues.add(uniqueValue);
        }
        return true;
    }

    const uploadData = async (data: ExcelData[]) => {
        setLoading(true);
        const uploadPromises = [];
        for (const item of data) {
            const promise = fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_CHART', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...item, brand_name }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to upload data');
                    }
                    return response.json();
                });
            uploadPromises.push(promise);
        }

        Promise.all(uploadPromises)
            .then(responses => {
                console.log('Data uploaded successfully:', responses);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error uploading data:', error);
                setError('Error uploading data');
                setLoading(false);
            });
    };

    const _handleDownloadFullData = () => {
        // Convert modified data to XLSX format
        const ws = XLSX.utils.json_to_sheet(excelData, { header: Object.keys(excelData[0] || {}) });

        // Define the error cell style
        const errorCellStyle = {
            fill: { fgColor: { rgb: "FFFF00" } } // Yellow fill color
        };

        // Get the range of the worksheet
        const range = XLSX.utils.decode_range(ws['!ref'] || "A1:A1");

        const uniqueCols = ['material_name'];

        // Iterate through the range and apply style to error cells
        for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
                const cell = ws[cellRef];
                const columnKey = Object.keys(excelData[0])[col]; // Lấy tên cột tương ứng

                // Check if cell is null or empty
                if (cell === null || cell === undefined || cell.v === null || cell.v === '') {
                    ws[cellRef] = {
                        v: '', // Set cell value to empty string
                        s: errorCellStyle // Apply error cell style
                    };
                }
                // Check for duplicate values in specific columns
                else if (uniqueCols.includes(columnKey)) {
                    const isDuplicate = excelData.filter((item: any) => item[columnKey] === cell.v).length > 1;
                    if (isDuplicate) {
                        ws[cellRef] = {
                            v: cell.v, // Keep the original cell value
                            s: errorCellStyle // Apply error cell style
                        };
                    }
                }
            }
        }

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Error Data To Edit");

        // Convert the workbook to a binary string
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Trigger file download
        function saveAs(blob: any, fileName: any) {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }

        const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        saveAs(blob, "ErrorDataToEdit.xlsx");
    };

    function s2ab(s: any) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    // Function To CRUD

    const [editingData, setEditingData] = React.useState<ExcelData | null>(null);
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

    const [editOpen, setEditOpen] = React.useState<boolean>(false);
    const _handleEditOpen = () => setEditOpen(true);
    const _handleEditClose = () => setEditOpen(false);

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

    // Thêm một state để theo dõi trạng thái của modal
    const [openAddMaterialModal, setOpenAddMaterialModal] = React.useState<boolean>(false);

    // Hàm để mở modal
    const _handleOpenAddMaterialModal = () => {
        setOpenAddMaterialModal(true);
    };

    // Hàm để đóng modal
    const _handleCloseAddUserModal = () => {
        setOpenAddMaterialModal(false);
    };

    // Hàm để thêm người dùng mới
    const _handleAddMaterial = (materialData: any) => {
        const newData = [...excelData];
        newData.push(materialData);
        setExcelData(newData);
        setOpenAddMaterialModal(false);
    };

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
            {
                excelData.length > 0 && !editingData && (
                    <>
                        <Button onClick={_handleOpenAddMaterialModal}>Add User</Button>
                        <AddMaterialModalInExcelTable open={openAddMaterialModal} onClose={_handleCloseAddUserModal} onAddMaterial={_handleAddMaterial} />
                    </>
                )
            }

            <div style={{ display: "flex" }}>
                <input
                    type="file"
                    onChange={_handleFileInputChange}
                    style={{ marginBottom: '20px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginRight: "20px" }}
                />
                {
                    error && (
                        <div>
                            <p style={{ color: 'red' }}>{error}</p>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={_handleDownloadFullData}
                                style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', backgroundColor: '#E96208' }}
                            >
                                {t(codeLanguage + '000054')}
                            </Button>
                        </div>
                    )
                }
            </div>

            {
                excelData.length > 0 && (
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: colors.primary[100] }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category Name</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Material Name</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Unit</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Brand Name</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Error Check</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map((data, index) => (
                                    <tr key={data.id}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.category_name ? colors.primary[200] : 'red' }}>{data.category_name || 'Null Category Name'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.material_name ? colors.primary[200] : 'red' }}>{data.material_name || 'Null Material Name'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.price ? colors.primary[200] : 'red' }}>{data.price || 'Null Price'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.unit ? colors.primary[200] : 'red' }}>{data.unit || 'Null Unit'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: brand_name ? colors.primary[200] : 'red' }}>{brand_name || 'Null Brand Name'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            {(() => {
                                                const hasNullValues = Object.values(data).some(value => value === null || value === '');
                                                // const isCategoryNameDuplicate = excelData.some((item, i) => i !== index && item.category_name === data.category_name);
                                                const isMaterialNameDuplicate = excelData.some((item, i) => i !== index && item.material_name === data.material_name);
                                                // const isPriceDuplicate = excelData.some((item, i) => i !== index && item.price === data.price);
                                                // const isUnitDuplicate = excelData.some((item, i) => i !== index && item.unit === data.unit);


                                                if (hasNullValues || isMaterialNameDuplicate) {
                                                    const errorMessage = [];
                                                    if (hasNullValues) errorMessage.push('Null Values');
                                                    // if (isCategoryNameDuplicate) errorMessage.push('Duplicate Category Name');
                                                    if (isMaterialNameDuplicate) errorMessage.push('Duplicate Material Phone');
                                                    // if (isPriceDuplicate) errorMessage.push('Duplicate Price Email');
                                                    // if (isUnitDuplicate) errorMessage.push('Duplicate Unit Email');

                                                    return (
                                                        <div style={{ color: 'red' }}>
                                                            <ErrorOutline style={{ color: 'red' }} />
                                                        </div>
                                                    );
                                                } else {
                                                    return <AgricultureOutlined style={{ color: 'green' }} />;
                                                }
                                            })()}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            {/* {editingData ? (
                                                <EditMultipleUsersInExcelTable data={editingData} index={editingIndex} updateData={updateData} onClose={cancelEdit} />
                                            ) : ( */}
                                            <div style={{ display: "flex" }}>
                                                <EditIcon style={{ color: "blue", cursor: "pointer" }} onClick={() => confirmEdit(index)} />
                                                <DeleteIcon style={{ color: "red", cursor: "pointer" }} onClick={() => confirmDelete(index)} />
                                            </div>
                                            {/* )} */}
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

export default AddMultipleMaterialWithExcel;
