import * as React from 'react';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { AgricultureOutlined, Cancel, Close, ConfirmationNumber, ErrorOutline } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from "xlsx-js-style";
// import "./AddMultipleUsersStyles.module.scss";

const ADDUSERWITHFILEEXCELS = 'http://localhost:5173/Add_New_Users_Sample_Files.xlsx';

interface User {
    id: number;
    registrarId: string;
    name: string;
    age: number;
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
}

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
}

interface AddUserWithMultipleExcelFormProps {
    closeMultipleCard: () => void;
    addNewUser: (addedNewUser: ExcelData) => void
}


const AddMultipleComponentWithExcel: React.FC<AddUserWithMultipleExcelFormProps> = ({ closeMultipleCard, addNewUser }) => {
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
                        setExcelData(jsonData);
                        console.log(jsonData);
                    }
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                    setError('Error parsing Excel file');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

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

    const handleConfirm = () => {
        const hasErrors = excelData.some(data =>
            !data.registrarId ||
            !data.name ||
            !data.age ||
            !data.phone ||
            !data.email ||
            !data.address ||
            !data.city ||
            !data.zipCode
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
        } else {
            setError('Please resolve errors before confirming');
        }
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

        // Iterate through the range and apply style to null cells
        for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
                const cell = ws[cellRef];

                // Check if cell is null
                if (!cell || cell.v === null || cell.v === "") {
                    ws[cellRef] = {
                        v: "", // Set cell value to empty string
                        s: errorCellStyle // Apply error cell style
                    };
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

    return (
        <div>
            <Typography variant="h5" align="center">
                Add New User By Excel
            </Typography>
            <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={closeMultipleCard}>
                <Close />
            </IconButton>
            <Box height={50} />
            <Button
                variant="contained"
                color="primary"
                href={ADDUSERWITHFILEEXCELS}
                download
                endIcon={<DownloadIcon />}
                style={{ backgroundColor: 'black', color: 'white' }}
            >
                Download Excel Sample File
            </Button>
            <h1>Upload Data with Excel</h1>
            <input type="file" onChange={handleFileInputChange} />
            {loading && <p>Loading...</p>}
            {error && (
                <div>
                    <p style={{ color: 'red' }}>{error}</p>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDownloadFullData}
                    >
                        Download Error Data
                    </Button>
                </div>
            )}
            {excelData.length > 0 && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>RegistrarId</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Zip Code</th>
                                <th>Error Check</th>
                            </tr>
                        </thead>
                        <tbody>
                            {excelData.map((data, index) => (
                                <tr key={index}>
                                    <td style={{ color: data.registrarId ? 'black' : 'red' }}>{data.registrarId || 'Error Registrated ID'}</td>
                                    <td style={{ color: data.name ? 'black' : 'red' }}>{data.name || 'Error Name'}</td>
                                    <td style={{ color: data.age ? 'black' : 'red' }}>{data.age || 'Error Age'}</td>
                                    <td style={{ color: data.phone ? 'black' : 'red' }}>{data.phone || 'Error Phone'}</td>
                                    <td style={{ color: data.email ? 'black' : 'red' }}>{data.email || 'Error Email'}</td>
                                    <td style={{ color: data.address ? 'black' : 'red' }}>{data.address || 'Error Address'}</td>
                                    <td style={{ color: data.city ? 'black' : 'red' }}>{data.city || 'Error City'}</td>
                                    <td style={{ color: data.zipCode ? 'black' : 'red' }}>{data.zipCode || 'Error Zip Code'}</td>
                                    <td style={{ color: data.zipCode ? 'black' : 'red' }}>
                                        {data.registrarId && data.name && data.age && data.phone && data.email && data.address && data.city && data.zipCode ? <AgricultureOutlined style={{ color: "green" }} /> : <ErrorOutline style={{ color: 'red' }} />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div style={{ display: "flex" }}>
                <div
                    onClick={closeMultipleCard}
                    style={{ textAlign: 'center', alignItems: 'center', marginTop: '3rem' }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<Cancel />}
                        style={{ backgroundColor: 'black', color: 'white' }}
                    >
                        CANCEL
                    </Button>
                </div>
                <div
                    onClick={handleConfirm}
                    style={{ textAlign: 'center', alignItems: 'center', marginTop: '3rem' }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ConfirmationNumber />}
                        style={{ backgroundColor: 'black', color: 'white' }}
                    >
                        OK
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddMultipleComponentWithExcel;

