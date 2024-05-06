import { Box, Button, IconButton, Menu, MenuItem, Modal } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import * as React from "react";
import { ViewCompactAltOutlined, GetAppOutlined } from "@mui/icons-material";
import jsPDF from "jspdf";

interface Invoice {
    id: number;
    name: string;
    date: Date;
    total: number;
    status: boolean;
    email: string;
    address: string;
    phone: string;
    city: string;
    zipCode: string;
    registraId: number;
    age: number
}

const ManageInvoiceScreen: React.FC = () => {
    const [data, setData] = React.useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    React.useEffect(() => {
        const apiUrl = 'https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_DATA_TEST';
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData)) {
                    setData(responseData);
                    console.log("Data received:", responseData);

                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
    };

    const handleCloseModal = () => {
        setSelectedInvoice(null);
    };

    const downloadInvoiceAsPDF = () => {
        if (!selectedInvoice) return;

        const doc = new jsPDF();

        // Định dạng ngày thành chuỗi
        const formattedDate = selectedInvoice.date.toString();

        // Chuẩn bị nội dung của hóa đơn
        const content = [
            `Invoice Details`,
            `ID: ${selectedInvoice.id}`,
            `Name: ${selectedInvoice.name}`,
            `Date: ${formattedDate}`,
            `Total: ${selectedInvoice.total}`,
            `Email: ${selectedInvoice.email}`,
            `Phone Number: ${selectedInvoice.phone}`,
            `Address: ${selectedInvoice.address}`,
            `Zip Code: ${selectedInvoice.zipCode}`,
            `City: ${selectedInvoice.city}`,
            `Age: ${selectedInvoice.age}`,
            `Status: ${selectedInvoice.status ? 'Active' : 'Inactive'}`
        ];

        // Đặt vị trí xuất phát của văn bản
        let textY = 10;

        // Thêm nội dung vào tệp PDF
        content.forEach((line) => {
            doc.text(line, 10, textY);
            textY += 10; // Tăng vị trí y cho mỗi dòng
        });

        // Lưu tệp PDF
        doc.save(`Invoice_${selectedInvoice.id}.pdf`);
    };


    const columns: GridColDef[] = [
        { field: "id", headerName: "ID Invoice" },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
        },
        { field: "date", headerName: "Date", flex: 0.5 },
        { field: "total", headerName: "Total" },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <span
                    style={{
                        color: params.value === true ? 'white' : 'white',
                        backgroundColor: params.value === true ? 'lightgreen' : 'lightcoral',
                        fontSize: '16px',
                        borderRadius: '5px',
                        padding: "10px"
                    }}
                >
                    {params.value === true ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleViewInvoice(params.row)}>
                        <ViewCompactAltOutlined />
                    </IconButton>
                </Box>
            )
        }
    ];

    const getRowId = (row: any) => {
        return row.registrarId;
    };

    return (
        <Box m="20px">
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.primary[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.primary[300],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[100],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.primary[100],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.primary[100]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.primary[200]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={data}
                    columns={columns}
                    slots={{ toolbar: GridToolbar }}
                    disableRowSelectionOnClick
                    getRowId={getRowId}
                />
            </Box>

            <Modal
                open={!!selectedInvoice}
                onClose={handleCloseModal}
                aria-labelledby="invoice-details-modal"
                aria-describedby="invoice-details-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: colors.primary[100],
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 8,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: 0,
                            backgroundColor: '#f5f5f5',
                        }
                    }}
                >

                    <h2
                        id="invoice-details-modal"
                        style={{
                            textAlign: 'center',
                            marginBottom: 20,
                        }}
                    >
                        Invoice Details
                    </h2>
                    {selectedInvoice && (
                        <div style={{ height: "90%" }}>
                            <p style={{ marginBottom: 8 }}>ID: {selectedInvoice.id}</p>
                            <p style={{ marginBottom: 8 }}>Name: {selectedInvoice.name}</p>
                            <p style={{ marginBottom: 8 }}>Date: {selectedInvoice.date.toString()}</p>
                            <p style={{ marginBottom: 8 }}>Total: {selectedInvoice.total}</p>
                            <p style={{ marginBottom: 8 }}>Phone: {selectedInvoice.phone}</p>
                            <p style={{ marginBottom: 8 }}>Email: {selectedInvoice.email}</p>
                            <p style={{ marginBottom: 8 }}>Age: {selectedInvoice.age}</p>
                            <p style={{ marginBottom: 8 }}>Registra ID: {selectedInvoice.registraId}</p>
                            <p style={{ marginBottom: 8 }}>City: {selectedInvoice.city}</p>
                            <p style={{ marginBottom: 8 }}>Zip Code: {selectedInvoice.zipCode}</p>
                            <p style={{ marginBottom: 8 }}>Address: {selectedInvoice.address}</p>
                            <p style={{ marginBottom: 8 }}>Status: {selectedInvoice.status ? 'Active' : 'Inactive'}</p>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                        <Button onClick={downloadInvoiceAsPDF} startIcon={<GetAppOutlined />} variant="contained" color="primary">
                            Download PDF
                        </Button>
                        <Button onClick={handleCloseModal} variant="contained" color="primary">
                            Close
                        </Button>
                    </div>
                </Box>
            </Modal>

        </Box>
    );
};

export default ManageInvoiceScreen;
