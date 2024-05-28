import { Box, IconButton, Modal } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import * as React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";
import EditCustomerPopUpScreens from "./EditOrderPopUpScreen";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

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

const EmployeeManageOrder: React.FC = () => {
    const navigate = useNavigate();

    const handleCellClick = (params: any) => {
        const rowData = params.row;
        navigate('/row-details', { state: rowData });
    };

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<User[]>([]);

    const [formId, setFormId] = React.useState<User | null>(null);
    const [editopen, setEditOpen] = React.useState(false);
    const _handleEditOpen = () => setEditOpen(true);
    const _handleEditClose = () => setEditOpen(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();
    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

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

    const _handleAddUser = (newUser: User) => {
        setData(prevData => [...prevData, newUser]);
    }

    const _handleUpdateUser = (updatedUser: User) => {
        setData(prevData => prevData.map(user => user.id === updatedUser.id ? updatedUser : user));
    }

    const _handleEditClick = (id: number, registrarId: string, name: string, age: number, phone: string, email: string, address: string, city: string, zipCode: string) => {
        const userDataToEdit: User = {
            id: id,
            registrarId: registrarId,
            name: name,
            age: age,
            phone: phone,
            email: email,
            address: address,
            city: city,
            zipCode: zipCode
        }
        setFormId(userDataToEdit);
        _handleEditOpen();
    };

    const _handleDeleteClick = async (id: number) => {
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

    const confirmDelete = async (id: number) => {
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
                setData(prevData => prevData.filter(user => user.id !== id));
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
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "registrarId", headerName: "Registrar ID" },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "age", headerName: "Age", type: "number", headerAlign: "left", align: "left" },
        { field: "phone", headerName: "Phone Number", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "address", headerName: "Address", flex: 1 },
        { field: "city", headerName: "City", flex: 1 },
        { field: "zipCode", headerName: "Zip Code", flex: 1 },
        // {
        //     field: "actions",
        //     headerName: "Actions",
        //     flex: 1,
        //     sortable: false,
        //     renderCell: (params) => (
        //         <Box>
        //             <IconButton onClick={() => _handleEditClick(params.row.id, params.row.registrarId, params.row.name, params.row.age, params.row.email, params.row.phone, params.row.address, params.row.city, params.row.zipCode)}>
        //                 <EditIcon />
        //             </IconButton>
        //             <IconButton onClick={() => confirmDelete(params.row.id)}>
        //                 <DeleteIcon htmlColor={colors.primary[300]} />
        //             </IconButton>
        //         </Box>
        //     )
        // }
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
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .MuiDataGrid-cell": { borderBottom: "none" },
                    "& .name-column--cell": { color: colors.primary[300] },
                    "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.primary[300], borderBottom: "none" },
                    "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[100] },
                    "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.primary[100] },
                    "& .MuiCheckbox-root": { color: `${colors.primary[100]} !important` },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.primary[200]} !important` },
                    "& .MuiBadge-badge": { display: "none !important" }
                }}
            >
                <DataGrid
                    rows={data}
                    columns={columns}
                    slots={{ toolbar: GridToolbar }}
                    disableRowSelectionOnClick
                    getRowId={getRowId}
                    onCellClick={handleCellClick}
                />
                <Modal
                    open={editopen}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {formId !== null && (
                            <EditCustomerPopUpScreens
                                editClose={_handleEditClose}
                                fid={formId}
                                updateUser={_handleUpdateUser}
                            />
                        )}
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default EmployeeManageOrder;
