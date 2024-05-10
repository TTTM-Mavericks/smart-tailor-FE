import { Box, Button, IconButton, Menu, MenuItem, Modal } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import * as React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";
import EditUserPopUpScreens from "./EditUsersPopUpScreens";
import { Add } from "@mui/icons-material";
import AddEachUsersWithHand from "./AddEachWithHand/AddEachUsersWithHandScreens";
import AddMultipleComponentWithExcel from "./AddMultipleUserWithExcel/AddMultipleUsersComponent";
import styles from './ManageUsersStyle.module.scss'
import { useTranslation } from 'react-i18next';

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

const ManageUsers: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<User[]>([]);

    // set formid to pass it to component edit user
    const [formId, setFormId] = React.useState<User | null>(null);

    // Open Edit PopUp when clicking on the edit icon
    const [editopen, setEditOpen] = React.useState(false);
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);

    // open or close the add modal
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    console.log("anchorEl" + anchorEl);

    // close open pop up
    const [addOpenOrClose, setAddOpenOrClose] = React.useState(false)

    const handleAddOpen = () => {
        setAddOpenOrClose(true);
    }

    const handleAddClose = () => {
        setAddOpenOrClose(false)
    }

    // close open pop up
    const [addMultiple, setAddMultiple] = React.useState(false)

    const handleAddMultipleOpen = () => {
        setAddMultiple(true);
    }

    const handleAddMultipleClose = () => {
        setAddMultiple(false)
    }

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

    // Thêm người dùng mới vào danh sách
    const handleAddUser = (newUser: User) => {
        setData(prevData => [...prevData, newUser]);
    }

    // Cập nhật người dùng trong danh sách
    const handleUpdateUser = (updatedUser: User) => {
        setData(prevData => prevData.map(user => user.id === updatedUser.id ? updatedUser : user));
    }

    // EDIT 
    const handleEditClick = (id: number, registrarId: string, name: string, age: number, phone: string, email: string, address: string, city: string, zipCode: string) => {
        // Handle edit action
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
        handleEditOpen();
    };

    //DELETE OR UPDATE
    const handleDeleteClick = async (id: number) => {
        // Handle delete action
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

    // confirm 
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
                await handleDeleteClick(id);
                Swal.fire(
                    `${t(codeLanguage + '000064')}`,
                    `${t(codeLanguage + '000065')}`,
                    'success'
                )
                // Loại bỏ người dùng khỏi danh sách hiện tại
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
        {
            field: "name",
            headerName: "Name",
            flex: 1,
        },
        {
            field: "age",
            headerName: "Age",
            type: "number",
            headerAlign: "left",
            align: "left",
        },
        {
            field: "phone",
            headerName: "Phone Number",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "address",
            headerName: "Address",
            flex: 1,
        },
        {
            field: "city",
            headerName: "City",
            flex: 1,
        },
        {
            field: "zipCode",
            headerName: "Zip Code",
            flex: 1,
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleEditClick(params.row.id, params.row.registrarId, params.row.name, params.row.age, params.row.email, params.row.phone, params.row.address, params.row.city, params.row.zipCode)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => confirmDelete(params.row.id)}>
                        <DeleteIcon htmlColor={colors.primary[300]} />
                    </IconButton>
                </Box>
            )
        }
    ];

    const getRowId = (row: any) => {
        return row.registrarId; // Sử dụng một thuộc tính duy nhất làm id cho mỗi hàng
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
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    endIcon={<Add />}
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: `${colors.primary[300]} !important`, color: `${colors.primary[200]} !important`, marginLeft: "80%" }}
                >
                    {t(codeLanguage + '000048')}
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem >
                        <div onClick={handleAddOpen}>{t(codeLanguage + '000049')}</div>
                        <Modal
                            open={addOpenOrClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={{
                                backgroundColor: colors.primary[100], position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: "50%",
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: "20px"
                            }}>
                                <AddEachUsersWithHand closeCard={handleAddClose} addNewUser={handleAddUser} />
                            </Box>
                        </Modal>
                    </MenuItem>

                    <MenuItem>
                        <div onClick={handleAddMultipleOpen}>{t(codeLanguage + '000050')}</div>
                        <Modal
                            open={addMultiple}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: "70%",
                                bgcolor: colors.primary[100],
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: "20px"
                            }}>
                                <AddMultipleComponentWithExcel closeMultipleCard={handleAddMultipleClose} addNewUser={handleAddUser} />
                            </Box>
                        </Modal>

                    </MenuItem>
                </Menu>

                <DataGrid
                    rows={data}
                    columns={columns}
                    slots={{ toolbar: GridToolbar }}
                    // checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={getRowId}
                />
                <Modal
                    open={editopen}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {formId !== null && (
                            <EditUserPopUpScreens
                                editClose={handleEditClose}
                                fid={formId}
                                updateUser={handleUpdateUser}
                            />
                        )}
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default ManageUsers;
