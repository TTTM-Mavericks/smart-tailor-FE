import * as React from 'react';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { AgricultureOutlined, Cancel, CheckCircleRounded, Close, ErrorOutline } from '@mui/icons-material';
import * as XLSX from "xlsx-js-style";
import Swal from 'sweetalert2';
import { tokens } from '../../../../theme';
import { useTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditMultipleUsersInExcelTable from './CRUDWithExcelTable/EditMultipleUsersInExcelTable';
import AddUserModalInExcelTable from './CRUDWithExcelTable/AddUserInExcelTable';
const ADDUSERWITHFILEEXCELS = 'http://localhost:3000/Add_New_Users_Sample_Files.xlsx';

interface ExcelData {
    id: number;
    registrarId: string;
    name: string;
    age: number;
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    error: boolean
}

interface AddUserWithMultipleExcelFormProps {
    closeMultipleCard: () => void;
    addNewUser: (addedNewUser: ExcelData) => void
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

const AddMultipleComponentWithExcel: React.FC<AddUserWithMultipleExcelFormProps> = ({ closeMultipleCard, addNewUser }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [excelData, setExcelData] = React.useState<ExcelData[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

                        // Filter out duplicates based on name, phone, and email
                        const uniqueData = jsonData.filter((item, index, self) => {
                            const isDuplicate = self.findIndex((t) => (
                                t.name === item.name && t.phone === item.phone && t.email === item.email
                            )) !== index;

                            // Nếu mục dữ liệu là trùng lặp, thêm vào mảng dữ liệu trùng lặp
                            if (isDuplicate) {
                                duplicateData.push(item);
                            }

                            return !isDuplicate;
                        });

                        // Update error property for duplicate entries
                        const updatedData = jsonData.map(item => {
                            const isDuplicate = duplicateData.some(d => d.name === item.name && d.phone === item.phone && d.email === item.email);
                            const hasNullName = !item.name;
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


    const handleConfirm = () => {
        const uniqueCols = ['name', 'email', 'phone'];

        // Kiểm tra xem có giá trị null không
        const hasNullValues = excelData.some(data =>
            Object.values(data).some(value => value === null || value === '')
        );

        // Kiểm tra xem có trùng lặp trong các cột name, email, phone không
        const isDuplicate = uniqueCols.some(col =>
            !isUnique(excelData, (item: any) => item[col])
        );

        // Kiểm tra xem có lỗi nào không
        const hasErrors =
            hasNullValues ||
            isDuplicate ||
            excelData.some(
                data =>
                    !data.registrarId ||
                    !data.name ||
                    !data.age ||
                    !data.phone ||
                    !data.email ||
                    !data.address ||
                    !data.city ||
                    !data.zipCode ||
                    data.error
            );

        if (excelData.length > 0 && !hasErrors) {
            uploadData(excelData);
            for (const data of excelData) {
                addNewUser(data);
            }
            setExcelData([]);
            setLoading(false);
            setError('');
            closeMultipleCard();
            Swal.fire('Add Success!', 'User has been updated!', 'success');
        } else {
            setError('Please resolve errors before confirming');
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
            const promise = fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_DATA_TEST', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
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

    const handleDownloadFullData = () => {
        // Convert modified data to XLSX format
        const ws = XLSX.utils.json_to_sheet(excelData, { header: Object.keys(excelData[0] || {}) });

        // Define the error cell style
        const errorCellStyle = {
            fill: { fgColor: { rgb: "FFFF00" } } // Yellow fill color
        };

        // Get the range of the worksheet
        const range = XLSX.utils.decode_range(ws['!ref'] || "A1:A1");

        const uniqueCols = ['name', 'email', 'phone']; // Cột không được trùng lặp

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

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);

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
        handleEditOpen();
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
        handleEditClose()
    };

    // Thêm một state để theo dõi trạng thái của modal
    const [openAddUserModal, setOpenAddUserModal] = React.useState(false);

    // Hàm để mở modal
    const handleOpenAddUserModal = () => {
        setOpenAddUserModal(true);
    };

    // Hàm để đóng modal
    const handleCloseAddUserModal = () => {
        setOpenAddUserModal(false);
    };

    // Hàm để thêm người dùng mới
    const handleAddUser = (userData: any) => {
        const newData = [...excelData];
        newData.push(userData);
        setExcelData(newData);
        setOpenAddUserModal(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', maxHeight: '80vh', overflowY: 'auto', position: "relative" }}>
            <Typography variant="h5" align="center" marginBottom={"20px"}>
                Add New User By Excel
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
                Download Excel Sample File
            </Button>
            {
                excelData.length > 0 && !editingData && (
                    <>
                        <Button onClick={handleOpenAddUserModal}>Add User</Button>
                        <AddUserModalInExcelTable open={openAddUserModal} onClose={handleCloseAddUserModal} onAddUser={handleAddUser} />
                    </>
                )
            }

            <div style={{ display: "flex" }}>
                <input
                    type="file"
                    onChange={handleFileInputChange}
                    style={{ marginBottom: '20px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginRight: "20px" }}
                />
                {
                    error && (
                        <div>
                            <p style={{ color: 'red' }}>{error}</p>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDownloadFullData}
                                style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', backgroundColor: '#E96208' }}
                            >
                                Download Error Data
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
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>RegistrarId</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Age</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Phone</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Address</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>City</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Zip Code</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Error Check</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map((data, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.registrarId ? colors.primary[200] : 'red' }}>{data.registrarId || 'Error Registrated ID'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.name ? colors.primary[200] : 'red' }}>{data.name || 'Error Name'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.age ? colors.primary[200] : 'red' }}>{data.age || 'Error Age'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.phone ? colors.primary[200] : 'red' }}>{data.phone || 'Error Phone'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.email ? colors.primary[200] : 'red' }}>{data.email || 'Error Email'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.address ? colors.primary[200] : 'red' }}>{data.address || 'Error Address'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.city ? colors.primary[200] : 'red' }}>{data.city || 'Error City'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.zipCode ? colors.primary[200] : 'red' }}>{data.zipCode || 'Error Zip Code'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', color: data.error ? 'red' : 'green' }}>
                                            {(() => {
                                                const isNameDuplicate = excelData.some((item, i) => i !== index && item.name === data.name);
                                                const isPhoneDuplicate = excelData.some((item, i) => i !== index && item.phone === data.phone);
                                                const isEmailDuplicate = excelData.some((item, i) => i !== index && item.email === data.email);

                                                const hasNullValues = Object.values(data).some(value => value === null || value === '');

                                                if (isNameDuplicate || isPhoneDuplicate || isEmailDuplicate || hasNullValues) {
                                                    const errorMessage = [];
                                                    if (isNameDuplicate) errorMessage.push('Duplicate Name');
                                                    if (isPhoneDuplicate) errorMessage.push('Duplicate Phone');
                                                    if (isEmailDuplicate) errorMessage.push('Duplicate Email');
                                                    if (hasNullValues) errorMessage.push('Null Values');

                                                    return (
                                                        <div style={{ color: 'red' }}>
                                                            <ErrorOutline style={{ color: 'red' }} />
                                                            {errorMessage.join(', ')}
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
                        CANCEL
                    </Button>
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirm}
                        endIcon={<CheckCircleRounded />}
                        style={{ backgroundColor: '#E96208', color: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
                    >
                        OK
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default AddMultipleComponentWithExcel;
