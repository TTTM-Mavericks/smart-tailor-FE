import { Box, Button, CardMedia, Divider, IconButton, Menu, MenuItem, Modal } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import * as React from "react";
import { ViewCompactAltOutlined, GetAppOutlined } from "@mui/icons-material";
import jsPDF from "jspdf";
import { useTranslation } from 'react-i18next';
import autoTable from 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import LogoPDF from '../../../assets/system/smart-tailor_logo.png'
import TestPDF from "./TestPDF";
import { style } from "@mui/system";
import { context } from "@react-three/fiber";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface ExtendedUserOptions extends UserOptions {
    columnWidths?: number[];
}

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

        // set back ground color
        doc.setFillColor(244, 245, 239); // White color
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

        const imgData = LogoPDF;
        const imgWidth = 40;
        const imgHeight = 40;
        doc.addImage(imgData, 'PNG', 15, 10, imgWidth, imgHeight);

        doc.setFontSize(35);
        doc.setFont('Playfair Display', 'bold');

        doc.text("INVOICE", 140, 30).getFont()

        const textOffset = 10;
        const tableStartY = Math.max(imgHeight + textOffset, 50);

        autoTable(doc, {
            startY: tableStartY,
            body: [
                [
                    {
                        content: `Invoice No. ${selectedInvoice.id}` + `\n${selectedInvoice.date}`,
                        styles: {
                            halign: 'left',
                            valign: "middle",
                            fontSize: 10
                        }
                    },
                    {
                        content: `SMART TAILOR, Inc` + `\nLot E2a-7, Street D1, High-Tech Park` + `\nLong Thanh My Ward City` + `\nThu Duc` + `\nHo Chi Minh City.` + `\nViet Nam`,
                        styles: {
                            halign: 'right',
                            valign: "middle",
                            fontSize: 10
                        }
                    }
                ]
            ], theme: 'plain',

        })

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        autoTable(doc, {
            head: [['Item', 'Quantity', 'Unit Price', 'Total']],
            body: [
                ['Tran Hoang Minh', '1', '$123', '$123'],
                ['Nguyen Minh Tu', '1', '$127', '$254'],
                ['Nguyen Hoang Lam Truong', '1', '$123', '$123'],
                ['Mai Thanh Tâm', '10', '$999', '$999'],
                ['Mai Thanh Tâm', '10', '$999', '$999']
            ],
            theme: "plain"
        })

        autoTable(doc, {
            head: [[{ content: "                          ", styles: { halign: 'right' } }, { content: "                         ", styles: { halign: 'center' } }, { content: "Sub Total", styles: { halign: 'center' } }, { content: "$1231321", styles: { halign: 'center' } }]],
            body: [
                [
                    {
                        content: '                           ',
                        styles: {
                            halign: 'right',
                            fontStyle: 'bold'
                        },
                    },
                    {
                        content: '              ',
                        styles: {
                            halign: 'center',
                            fontStyle: 'bold',
                        },
                    },
                    {
                        content: "Tax (0%)",
                        styles: {
                            fontStyle: 'bold',
                            halign: "center"
                        }
                    },
                    {
                        content: "$0",
                        styles: {
                            fontStyle: 'bold',
                            halign: "center"
                        }
                    }
                ],
            ],
            theme: 'plain'
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `                                                                                                               __________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        autoTable(doc, {
            head: [[{ content: "                          ", styles: { halign: 'right' } }, { content: "                         ", styles: { halign: 'center' } }, { content: "TOTAL", styles: { halign: 'center' } }, { content: "$1231321", styles: { halign: 'center' } }]],
            theme: 'plain'
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `                                                                                                               __________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        autoTable(doc, {
            body: [
                [
                    {
                        content: "Thank You!",
                        styles: {
                            halign: 'left',
                            fontSize: 20
                        }
                    }
                ]
            ],
            theme: "plain"
        })

        autoTable(doc, {
            body: [
                [
                    {
                        content: `SMART TAILOR, Inc` + `\nLot E2a-7, Street D1, High-Tech Park` + `\nLong Thanh My Ward City` + `\nThu Duc` + `\nHo Chi Minh City.` + `\nViet Nam`,
                        styles: {
                            halign: 'left',
                            valign: "middle",
                            fontSize: 10
                        }
                    },
                    {
                        content: `${selectedInvoice.name}` + `\n${selectedInvoice.address}`,
                        styles: {
                            halign: 'right',
                            valign: "bottom",
                            fontSize: 12
                        }
                    }
                ]
            ], theme: 'plain',

        })

        doc.save('table.pdf')
    }

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
                        width: "53%",
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
                        {t(codeLanguage + '000057')}
                    </h2>
                    {selectedInvoice && (
                        <div>
                            {/* Image and Title */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <img src={LogoPDF} style={{ height: '150px', marginRight: '20px' }} alt="Logo" />
                                <h1 style={{ fontSize: '50px', fontWeight: 'bolder', marginLeft: 'auto', fontFamily: "cursive", marginRight: "12%" }}>INVOICE</h1>
                            </div>

                            {/* Number of invoice ID */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{ marginTop: "5%" }}>
                                    <p>Invoice No. {selectedInvoice.id}</p>
                                    <p>{selectedInvoice.date.toString()}</p>
                                </div>
                                <div>
                                    <p style={{ textAlign: "right" }}>
                                        SMART TAILOR, Inc<br />
                                        Lot E2a-7, Street D1, High-Tech Park<br />
                                        Long Thanh My Ward City<br />
                                        Thu Duc<br />
                                        Ho Chi Minh City.<br />
                                        Viet Nam
                                    </p>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '3px solid #202020' }} />

                            {/* Table */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '10px', textAlign: "left" }}>Item</th>
                                        <th style={{ padding: '10px', textAlign: "left" }}>Quantity</th>
                                        <th style={{ padding: '10px', textAlign: "left" }}>Unit Price</th>
                                        <th style={{ padding: '10px', textAlign: "left" }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '10px' }}>Tran Hoang Minh</td>
                                        <td style={{ padding: '10px' }}>1</td>
                                        <td style={{ padding: '10px' }}>$123</td>
                                        <td style={{ padding: '10px' }}>$123</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px' }}>Tran Hoang Minh</td>
                                        <td style={{ padding: '10px' }}>1</td>
                                        <td style={{ padding: '10px' }}>$123</td>
                                        <td style={{ padding: '10px' }}>$123</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px' }}>Tran Hoang Minh</td>
                                        <td style={{ padding: '10px' }}>1</td>
                                        <td style={{ padding: '10px' }}>$123</td>
                                        <td style={{ padding: '10px' }}>$123</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px' }}>Tran Hoang Minh</td>
                                        <td style={{ padding: '10px' }}>1</td>
                                        <td style={{ padding: '10px' }}>$123</td>
                                        <td style={{ padding: '10px' }}>$123</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px' }}>Tran Hoang Minh</td>
                                        <td style={{ padding: '10px' }}>1</td>
                                        <td style={{ padding: '10px' }}>$123</td>
                                        <td style={{ padding: '10px' }}>$123</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td colSpan="1" style={{ padding: '10px', fontWeight: "bolder" }}>
                                            Sub Total
                                        </td>
                                        <td style={{ padding: '10px', fontWeight: "bolder" }}>$1231321</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td colSpan="1" style={{ padding: '10px', fontWeight: "bolder" }}>
                                            Tax (0%)
                                        </td>
                                        <td style={{ padding: '10px', fontWeight: "bolder" }}>$0</td>
                                    </tr>
                                    <tr style={{ borderTop: '3px solid #202020', borderBottom: '3px solid #202020' }}>
                                        <td></td>
                                        <td></td>
                                        <td colSpan="1" style={{ padding: '10px', fontWeight: "bolder" }}>
                                            TOTAL
                                        </td>
                                        <td style={{ padding: '10px', fontWeight: "bolder" }}>$1231321</td>
                                    </tr>
                                </tfoot>
                            </table>

                            {/* Thank You! */}
                            <h1 style={{ marginTop: '40px', fontFamily: "cursive", fontWeight: "bolder", fontSize: "30px" }}>Thank You!</h1>

                            {/* Address and name */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <div>
                                    <p>
                                        SMART TAILOR, Inc<br />
                                        Lot E2a-7, Street D1, High-Tech Park<br />
                                        Long Thanh My Ward City<br />
                                        Thu Duc<br />
                                        Ho Chi Minh City.<br />
                                        Viet Nam
                                    </p>
                                </div>
                                <div style={{ marginTop: "10%" }}>
                                    <p>{selectedInvoice.name}</p>
                                    <p>{selectedInvoice.address}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                        <Button onClick={downloadInvoiceAsPDF} startIcon={<GetAppOutlined />} variant="contained" color="primary">
                            {t(codeLanguage + '000058')}
                        </Button>
                        <Button variant="contained" color="primary">
                            Refund Transaction
                        </Button>
                        <Button onClick={handleCloseModal} variant="contained" color="primary">
                            {t(codeLanguage + '000059')}
                        </Button>
                    </div>
                </Box>
            </Modal>

        </Box>
    );
};

export default ManageInvoiceScreen;
