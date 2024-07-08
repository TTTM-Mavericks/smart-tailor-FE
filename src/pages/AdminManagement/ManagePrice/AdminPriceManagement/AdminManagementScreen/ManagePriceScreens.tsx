import { Box, Button, IconButton, Menu, MenuItem, Modal } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import { useTheme } from "@mui/material";
import * as React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";
import { Add } from "@mui/icons-material";
import AddPriceManual from "../../AddManualPrice/AddPriceScreens";
import { useTranslation } from 'react-i18next';
import { Category } from "../../../../../models/AdminCategoryExcelModel";
import axios from "axios";
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { EditLaborQuantity, LaborQuantity } from "../../../../../models/LaborQuantityModel";
import EditPricePopUpScreens from "../AdminEditPrice/EditPricePopUpScreens";

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

const AdminManagePrice: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<LaborQuantity[]>([]);

    // set formid to pass it to component edit Material
    const [formId, setFormId] = React.useState<LaborQuantity | null>(null);

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
    console.log("anchorEl" + anchorEl);

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
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.labor_quantity + functionEndpoints.laborQantity.getAllLaborQuantity}`;

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
    const _handleAddLaborQuantity = (newLaborQuantity: EditLaborQuantity[]) => {
        setData((prevData: any) => [...prevData, newLaborQuantity]);
    }

    // Cập nhật người dùng trong danh sách
    const _handleUpdateLaborQuantity = (updatedLaborquantity: LaborQuantity) => {
        setData(prevData => prevData.map((LaborQuantity: any) => LaborQuantity.laborQuantityID === updatedLaborquantity.laborQuantityID ? updatedLaborquantity : LaborQuantity));
    }

    // EDIT 
    const _handleEditClick = (
        laborQuantityID: string,
        laborQuantityMinQuantity: number,
        laborQuantityMaxQuantity: number,
        laborQuantityMinPrice: number,
        laborQuantityMaxPrice: number
    ) => {
        // Handle edit action
        const LaborQuantityDataToEdit: LaborQuantity = {
            laborQuantityID: laborQuantityID,
            laborQuantityMinQuantity: laborQuantityMinQuantity,
            laborQuantityMaxQuantity: laborQuantityMaxQuantity,
            laborQuantityMinPrice: laborQuantityMinPrice,
            laborQuantityMaxPrice: laborQuantityMaxPrice,
        }
        setFormId(LaborQuantityDataToEdit);
        _handleEditOpen();
    };

    //DELETE OR UPDATE
    // const _handleDeleteClick = async (categoryID: string) => {
    //     try {
    //         const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.category + functionEndpoints.category.updateCategory}`;

    //         const response = await axios.put(apiUrl + `/${categoryID}`)

    //         if (!response.data) {
    //             throw new Error('Error deleting material');
    //         }

    //         return response.data;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    // // confirm 
    // const _hanldeConfirmDelete = async (id: number) => {
    //     try {
    //         const result = await Swal.fire({
    //             title: `${t(codeLanguage + '000061')}`,
    //             text: `${t(codeLanguage + '000062')}`,
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: `${t(codeLanguage + '000063')}`,
    //             cancelButtonText: `${t(codeLanguage + '000055')}`
    //         });

    //         if (result.isConfirmed) {
    //             await _handleDeleteClick(id.toString()); // Ensure id is converted to string if necessary
    //             Swal.fire(
    //                 `${t(codeLanguage + '000064')}`,
    //                 `${t(codeLanguage + '000065')}`,
    //                 'success'
    //             );

    //             // Remove the deleted material from the current data list
    //             setData(prevData => prevData.filter(Material => Material.materialID !== id));
    //         } else {
    //             Swal.fire(
    //                 `${t(codeLanguage + '000066')}`,
    //                 `${t(codeLanguage + '000067')}`,
    //                 'error'
    //             );
    //         }
    //     } catch (error: any) {
    //         console.error('Error:', error);
    //         Swal.fire(
    //             'Error',
    //             `${error.message || 'Unknown error'}`,
    //             'error'
    //         );
    //     }
    // };

    const columns: GridColDef[] = [
        // { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "laborQuantityMinQuantity",
            headerName: "Min Quantity",
            flex: 1,
        },
        {
            field: "laborQuantityMaxQuantity",
            headerName: "Max Quantity",
            flex: 1,
        },
        {
            field: "laborQuantityMinPrice",
            headerName: "Min Price",
            flex: 1,
        },
        {
            field: "laborQuantityMaxPrice",
            headerName: "Max Price",
            flex: 1,
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => _handleEditClick(params.row.laborQuantityID, params.row.laborQuantityMinQuantity, params.row.laborQuantityMaxQuantity, params.row.laborQuantityMinPrice, params.row.laborQuantityMaxPrice)}>
                        <EditIcon />
                    </IconButton>
                    {/* <IconButton onClick={() => _hanldeConfirmDelete(params.row.categoryID)}>
                        <DeleteIcon htmlColor={colors.primary[300]} />
                    </IconButton> */}
                </Box>
            )
        }
    ];

    const getRowId = (row: any) => `${row.laborQuantityID}-${row.laborQuantityMinQuantity}`;


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
                    <MenuItem >
                        <div onClick={_handleAddOpen}>{t(codeLanguage + '000049')}</div>
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
                                <AddPriceManual closeCard={_handleAddClose} addNewLaborQuantity={_handleAddLaborQuantity} />
                            </Box>
                        </Modal>
                    </MenuItem>
                </Menu>

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
                            <EditPricePopUpScreens
                                editClose={_handleEditClose}
                                fid={formId}
                                updateLaborQuantity={_handleUpdateLaborQuantity}
                            />
                        )}
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default AdminManagePrice;
