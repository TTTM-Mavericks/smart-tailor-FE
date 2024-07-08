import { Box, Button, IconButton, Menu, MenuItem, Modal } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import { useTheme } from "@mui/material";
import * as React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";
import EditSizePopUpScreens from "../AdminEditSize/EditSizePopUpScreens";
import { Add } from "@mui/icons-material";
import AddSizeManual from "../../AddManualSize/AddSizeScreens";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { AddSize, Sizes } from "../../../../../models/AdminManageSizeModel";

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

const ManageSizes: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<Sizes[]>([]);

    const [formId, setFormId] = React.useState<Sizes | null>(null);

    const [editOpen, setEditOpen] = React.useState<boolean>(false);
    const _handleEditOpen = () => setEditOpen(true);
    const _handleEditClose = () => setEditOpen(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const _handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const _handleClose = () => {
        setAnchorEl(null);
    };

    const [addOpen, setAddOpen] = React.useState<boolean>(false);
    const _handleAddOpen = () => setAddOpen(true);
    const _handleAddClose = () => setAddOpen(false);

    const [addMultiple, setAddMultiple] = React.useState<boolean>(false);
    const _handleAddMultipleOpen = () => setAddMultiple(true);
    const _handleAddMultipleClose = () => setAddMultiple(false);

    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    React.useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.size + functionEndpoints.size.getAllSize}`;

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

    const _handleAddSize = (newSizes: AddSize[]) => {
        setData((prevData: any) => [...prevData, ...newSizes]);
    };

    const _handleUpdateSize = (updatedSize: Sizes) => {
        setData(prevData => prevData.map(size => {
            if (size.sizeID === updatedSize.sizeID) {
                console.log("Size matched for update:", size);
                return updatedSize;
            }
            return size;
        }));
    }

    const _handleEditClick = (sizeID: string, sizeName: string) => {
        const sizeDataToEdit: Sizes = { sizeID: sizeID, sizeName: sizeName };
        setFormId(sizeDataToEdit);
        _handleEditOpen();
    };

    const _handleDeleteClick = async (sizeName: string) => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.size + functionEndpoints.size.updateSize}`;
            const response = await axios.delete(apiUrl + `/${sizeName}`);

            if (!response.data) {
                throw new Error('Error deleting size');
            }

            setData(prevData => prevData.filter((size) => size.sizeName !== sizeName));
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const _handleConfirmDelete = async (sizeName: string) => {
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
                await _handleDeleteClick(sizeName);
                Swal.fire(
                    `${t(codeLanguage + '000064')}`,
                    `${t(codeLanguage + '000065')}`,
                    'success'
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
        { field: "sizeName", headerName: "Size Name", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => _handleEditClick(params.row.sizeID, params.row.sizeName)}>
                        <EditIcon />
                    </IconButton>
                    {/* <IconButton onClick={() => _handleConfirmDelete(params.row.sizeName)}>
                        <DeleteIcon htmlColor={colors.primary[300]} />
                    </IconButton> */}
                </Box>
            )
        }
    ];

    const getRowId = (row: Sizes) => `${row.sizeID}-${row.sizeName}`;
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
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={_handleClick}
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
                    onClose={_handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={_handleAddOpen}>
                        {t(codeLanguage + '000049')}
                    </MenuItem>
                </Menu>
                <Modal
                    open={addOpen}
                    onClose={_handleAddClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <AddSizeManual closeCard={_handleAddClose} addNewSizes={_handleAddSize} />
                    </Box>
                </Modal>
                <DataGrid
                    rows={data}
                    columns={columns}
                    slots={{ toolbar: GridToolbar }}
                    disableRowSelectionOnClick
                    getRowId={getRowId}
                />
                <Modal
                    open={editOpen}
                    onClose={_handleEditClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {formId !== null && (
                            <EditSizePopUpScreens
                                editClose={_handleEditClose}
                                fid={formId}
                                updateSize={_handleUpdateSize}
                            />
                        )}
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default ManageSizes;
