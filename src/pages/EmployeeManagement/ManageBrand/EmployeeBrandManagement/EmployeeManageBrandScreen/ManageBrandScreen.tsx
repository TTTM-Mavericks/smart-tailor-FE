import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import { useTheme } from "@mui/material";
import * as React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import { Brand } from "../../../../../models/ManagerBrandModel";
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from "../../../../../api/ApiConfig";
import { height } from "@mui/system";

const EmployeeManageBrand: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<Brand[]>([]);

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

    React.useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.user + functionEndpoints.user.getAllBrand}`;
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    setData(responseData.data);
                    console.log("Data received:", responseData);

                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    //DELETE 
    const _handleDeleteClick = async (id: string) => {
        try {
            const response = await fetch(`https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_DATA_TEST/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error deleting user');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }

    }

    // Confirm Delete
    const _handleConfirmDelete = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: `${t(codeLanguage + '000061')}`,
                text: `${t(codeLanguage + '000062')}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `${t(codeLanguage + '000063')}`,
                cancelButtonText: `${t(codeLanguage + '000055')}`
            });
            if (result.isConfirmed) {
                await _handleDeleteClick(id);
                Swal.fire(
                    `${t(codeLanguage + '000064')}`,
                    `${t(codeLanguage + '000065')}`,
                    'success'
                )
                setData(prevData => prevData.filter(user => user.userID !== id));
            } else {
                Swal.fire(
                    `${t(codeLanguage + '000066')}`,
                    `${t(codeLanguage + '000067')}`,
                    'error'
                );
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const columns: GridColDef[] = [
        { field: "email", headerName: "Email", flex: 1, headerAlign: "left" },
        {
            field: "fullName",
            headerAlign: "left",
            headerName: "Brand Name",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    <Box
                        component="img"
                        src={params.row.imageUrl}
                        alt={params.row.fullName}
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            mr: 2
                        }}
                    />
                    {params.row.fullName}
                </Box>
            )
        },
        {
            field: "language",
            headerName: "Language",
            headerAlign: "left",
            align: "left",
        },
        {
            field: "phoneNumber",
            headerName: "Phone Number",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "provider",
            headerName: "Provider",
        },
        {
            field: "userStatus",
            headerName: "User Status",
            renderCell: (params) => (
                <Box
                    sx={{
                        backgroundColor: params.value === 'Active' ? '#ffebee' : '#e8f5e9',
                        color: params.value === 'Active' ? '#f44336' : '#4caf50',
                        borderRadius: '16px',
                        padding: '1px 5px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        height: "50%",
                        marginTop: "20%"
                    }}
                >
                    <Box
                        sx={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: params.value === 'Active' ? '#f44336' : '#4caf50',
                        }}
                    />
                    {params.value}
                </Box>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => _handleConfirmDelete(params.row.id)}>
                        <DeleteIcon htmlColor={colors.primary[300]} />
                    </IconButton>
                </Box>
            )
        }
    ];


    const getRowId = (row: any) => {
        return row.userID;
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
                    "& .MuiBadge-badge": {
                        display: "none !important"
                    }
                }}
            >
                <Box
                    sx={{
                        height: "100%",  // Adjust height as needed
                        width: '100%',  // Adjust width as needed
                        '& .MuiDataGrid-row:nth-of-type(odd)': {
                            backgroundColor: '#D7E7FF !important',  // Change background color to blue for odd rows
                        },
                        '& .MuiDataGrid-row:nth-of-type(even)': {
                            backgroundColor: '#FFFFFF !important',  // Change background color to red for even rows
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bolder',  // Make header text bolder
                        }
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
            </Box>
        </Box>
    );
};

export default EmployeeManageBrand;
