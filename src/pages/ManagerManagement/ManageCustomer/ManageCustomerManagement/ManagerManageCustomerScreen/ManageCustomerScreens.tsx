import { Box, Button, IconButton, Menu, MenuItem, Modal } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import { useTheme } from "@mui/material";
import * as React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";
import EditCustomerPopUpScreens from "../ManagerEditCustomer/EditCustomerPopUpScreens";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { ExpertTailoring } from "../../../../../models/ManagerExpertTailoringModel";
import { ExpertTailoringEdit } from "../../../../../models/ManagerExpertTailoringModel";

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

const ManageCustomer: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<ExpertTailoring[]>([]);

    // set formid to pass it to component edit Material
    const [formId, setFormId] = React.useState<ExpertTailoringEdit | null>(null);

    // Open Edit PopUp when clicking on the edit icon
    const [editopen, setEditOpen] = React.useState<boolean>(false);
    const _handleEditOpen = () => setEditOpen(true);
    const _handleEditClose = () => setEditOpen(false);

    // open or close the add modal
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const _handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const _handleClose = () => {
        setAnchorEl(null);
    };

    // close open pop up
    const [addOpenOrClose, setAddOpenOrClose] = React.useState<boolean>(false)

    const _handleAddOpen = () => {
        setAddOpenOrClose(true);
    }

    const _handleAddClose = () => {
        setAddOpenOrClose(false)
    }

    // close open pop up
    const [addMultiple, setAddMultiple] = React.useState<boolean>(false)

    const _handleAddMultipleOpen = () => {
        setAddMultiple(true);
    }

    const _handleAddMultipleClose = () => {
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
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.manager + functionEndpoints.manager.getAllExpertTailoring}`;

        axios.get(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
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

    // Thêm người dùng mới vào danh sách
    const _handleAddExpertTailoring = (addNewExpertTailoring: ExpertTailoring) => {
        setData(prevData => [...prevData, addNewExpertTailoring]);
    }

    // Cập nhật người dùng trong danh sách
    const _handleUpdateMaterial = (updatedExpertTailoring: ExpertTailoringEdit) => {
        setData(prevData => prevData.map((ExpertTailoring: any) => ExpertTailoring.expertTailoringID === updatedExpertTailoring.expertTailoringID ? updatedExpertTailoring : ExpertTailoring));
    }

    // EDIT 
    const _handleEditClick = (
        expertTailoringID: string,
        expertTailoringName: string,
        sizeImageUrl: string,
    ) => {
        // Handle edit action
        const ExpertTailoringDataToEdit: ExpertTailoringEdit = {
            expertTailoringID: expertTailoringID,
            expertTailoringName: expertTailoringName,
            sizeImageUrl: sizeImageUrl,
        }
        setFormId(ExpertTailoringDataToEdit);
        _handleEditOpen();
    };

    //DELETE OR UPDATE
    const _handleDeleteClick = async (expertTailoringID: string) => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.manager + functionEndpoints.manager.updateStatusExpertTailoring}`;

            const response = await axios.put(apiUrl + `/${expertTailoringID}`)

            if (!response.data) {
                throw new Error('Error deleting material');
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // confirm 
    const _hanldeConfirmDelete = async (id: number) => {
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
                await _handleDeleteClick(id.toString()); // Ensure id is converted to string if necessary
                Swal.fire(
                    `${t(codeLanguage + '000064')}`,
                    `${t(codeLanguage + '000065')}`,
                    'success'
                );

                // Update the deleted material from the current data list
                setData((prevData: any) =>
                    prevData.map((expertTailoring: any) =>
                        expertTailoring.expertTailoringID === id
                            ? { ...expertTailoring, status: !expertTailoring.status }
                            : expertTailoring
                    )
                );
            } else {
                Swal.fire(
                    `${t(codeLanguage + '000066')}`,
                    `${t(codeLanguage + '000067')}`,
                    'error'
                );
            }
        } catch (error: any) {
            console.error('Error:', error);
            Swal.fire(
                'Error',
                `${error.message || 'Unknown error'}`,
                'error'
            );
        }
    };

    const columns: GridColDef[] = [
        {
            field: "expertTailoringName",
            headerName: "ExpertTailoring Name",
            flex: 1,
        },
        {
            field: "sizeImageUrl",
            headerName: "Size Image Url",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            headerAlign: "left",
            align: "left",
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => _handleEditClick(params.row.expertTailoringID, params.row.expertTailoringName, params.row.sizeImageUrl)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => _hanldeConfirmDelete(params.row.expertTailoringID)}>
                        <DeleteIcon htmlColor={colors.primary[300]} />
                    </IconButton>
                </Box>
            )
        }
    ];

    const getRowId = (row: any) => `${row.expertTailoringID}-${row.expertTailoringName}-${row.sizeImageUrl}`;

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

                <DataGrid
                    rows={data}
                    columns={columns}
                    slots={{ toolbar: GridToolbar }}
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
                            <EditCustomerPopUpScreens
                                editClose={_handleEditClose}
                                fid={formId}
                                updateExpertTailoring={_handleUpdateMaterial}
                            />
                        )}
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default ManageCustomer;