import { Box, Button, IconButton, Menu, MenuItem, Modal, Typography } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import { useTheme } from "@mui/material";
import * as React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";
import EditMaterialPopUpScreens from "../AdminEditMaterial/EditMaterialPopUpScreens";
import { Add, RestoreFromTrashOutlined, RestoreFromTrashSharp, UndoOutlined } from "@mui/icons-material";
import AddEachMaterialsWithHand from "../../AddEachWithHand/AddEachMaterialWithHandScreens";
import AddMultipleComponentWithExcel from "../../AddMultipleMaterialWithExcel/AddMultipleMaterialComponent";
import { useTranslation } from 'react-i18next';
import { AddExcelMaterial, AddMaterial, ExcelData, Material } from "../../../../../models/AdminMaterialExcelModel";
import axios from "axios";
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { height, margin } from "@mui/system";
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

const ManageMaterials: React.FC = () => {
    // ---------------UseState Variable---------------//
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<Material[]>([]);
    const [formId, setFormId] = React.useState<Material | null>(null);
    const [editopen, setEditOpen] = React.useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [addOpenOrClose, setAddOpenOrClose] = React.useState<boolean>(false)
    const [addMultiple, setAddMultiple] = React.useState<boolean>(false)
    const { t, i18n } = useTranslation();

    // ---------------Usable Variable---------------//
    const open = Boolean(anchorEl);
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // ---------------UseEffect---------------//
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    /**
     * Get All Material
     */
    React.useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.material + functionEndpoints.material.getAllMaterial}`;

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

    // ---------------FunctionHandler---------------//

    /**
     * Open
     * @returns 
     */
    const _handleEditOpen = () => setEditOpen(true);

    /**
     * Close
     * @returns 
     */
    const _handleEditClose = () => setEditOpen(false);

    /**
     * Open Dialog
     * @param event 
     */
    const _handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Close Model
     */
    const _handleClose = () => {
        setAnchorEl(null);
    };

    /**
     * Open Dialog
     */
    const _handleAddOpen = () => {
        setAddOpenOrClose(true);
    }

    /**
     * Close Dialog
     */
    const _handleAddClose = () => {
        setAddOpenOrClose(false)
    }

    /**
     * Open Dialog Add With Excel
     */
    const _handleAddMultipleOpen = () => {
        setAddMultiple(true);
    }

    /**
     * Close Dialog Add With Excel
     */
    const _handleAddMultipleClose = () => {
        setAddMultiple(false)
    }

    /**
     * 
     * @param newMaterial 
     */
    const _handleAddMaterial = (newMaterial: AddMaterial) => {
        setData((prevData: any) => [...prevData, newMaterial]);
    }

    /**
 * Add Excel Material to State
 * @param newMaterial Array of ExcelData objects
 */
    const _handleAddExcelMaterial = (newMaterial: AddExcelMaterial[]) => {
        setData((prevData: any) => [...prevData, ...newMaterial]);
    };


    /**
     * 
     * @param updatedMaterial 
     */
    const _handleUpdateMaterial = (updatedMaterial: Material) => {
        setData(prevData => prevData.map(Material => Material.materialID === updatedMaterial.materialID ? updatedMaterial : Material));
    }

    /**
     * 
     * @param materialID 
     * @param categoryName 
     * @param materialName 
     * @param hsCode 
     * @param basePrice 
     * @param unit 
     */
    const _handleEditClick = (
        materialID: string,
        categoryName: string,
        materialName: string,
        hsCode: number,
        basePrice: number,
        unit: string) => {
        const MaterialDataToEdit: Material = {
            materialID: materialID,
            categoryName: categoryName,
            materialName: materialName,
            hsCode: hsCode,
            basePrice: basePrice,
            unit: unit
        }
        setFormId(MaterialDataToEdit);
        _handleEditOpen();
    };

    /**
     * 
     * @param materialID 
     * @returns 
     */
    const _handleUpdateStatus = async (materialID: string) => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.material + functionEndpoints.material.updateStatusMaterial}`;

            const response = await axios.put(apiUrl + `/${materialID}`)

            if (!response.data) {
                throw new Error('Error deleting material');
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * 
     * @param id 
     */
    const _hanldeConfirmUpdateStatus = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: `Are you sure to update status of material`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Yes I want to update status!`,
                cancelButtonText: `${t(codeLanguage + '000055')}`
            });

            if (result.isConfirmed) {
                await _handleUpdateStatus(id.toString()); // Ensure id is converted to string if necessary
                Swal.fire(
                    `Update status of material success`,
                    `Material status update success`,
                    'success'
                );
                // Update the deleted material from the current data list
                setData((prevData: any) =>
                    prevData.map((materialID: any) =>
                        materialID.materialID === id
                            ? { ...materialID, status: !materialID.status }
                            : materialID
                    )
                );
            } else {
                Swal.fire(
                    `Update status of material fail!`,
                    `Material status update fail!`,
                    'error'
                );
            }
        } catch (error: any) {
            console.error('Error:', error);
            Swal.fire(
                `Update status of material fail!`,
                `Material status update fail!`,
                'error'
            );
        }
    };

    /**
     * Create A Grid For Table
     */
    const columns: GridColDef[] = [
        {
            field: "categoryName",
            headerName: "Category Name",
            flex: 1,
        },
        {
            field: "materialName",
            headerName: "Material Name",
            flex: 1,
        },
        {
            field: "basePrice",
            headerName: "Base Price",
            headerAlign: "left",
            align: "left",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 1,
        },
        {
            field: "hsCode",
            headerName: "HS Code",
            flex: 1,
        },
        {
            field: "status",
            headerName: "status",
            flex: 1,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: params.row.status ? '#4caf50' : '#f44336',
                            marginRight: '8px',
                        }}
                    />
                    <Typography
                        variant="caption"
                        sx={{
                            color: params.row.status ? '#4caf50' : '#f44336',
                            fontWeight: 'medium',
                        }}
                    >
                        {params.row.status ? 'Active' : 'Inactive'}
                    </Typography>
                </Box>
            ),
        },

        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => _handleEditClick(params.row.materialID, params.row.categoryName, params.row.materialName, params.row.hsCode, params.row.basePrice, params.row.unit)}>
                        <EditIcon />
                    </IconButton>
                    {params.row.status ? (
                        <IconButton onClick={() => _hanldeConfirmUpdateStatus(params.row.materialID)}>
                            <DeleteIcon htmlColor={colors.primary[300]} />
                        </IconButton>
                    ) : (
                        <IconButton onClick={() => _hanldeConfirmUpdateStatus(params.row.materialID)}>
                            <UndoOutlined htmlColor="green" />
                        </IconButton>
                    )}
                </Box>
            )
        }
    ];

    /**
     * 
     * @param row 
     * @returns 
     */
    const getRowId = (row: any) => `${row.materialID}-${row.categoryName}-${row.materialName}`;

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
                    },
                    '& .MuiDataGrid-toolbarContainer': {
                        padding: '10px',
                        marginLeft: '60%'
                    }
                }}
            >
                <div className="container" style={{ display: "flex", marginTop: "-5%" }}>
                    <h1 style={{ fontWeight: "bolder", fontSize: "20px" }}>
                        Manage Material Table
                    </h1>
                    <div>
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={_handleClick}
                            endIcon={<Add />}
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: `#E96208`, color: `${colors.primary[200]} !important`, marginLeft: "20%" }}
                        >
                            ADD
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
                                <div onClick={_handleAddOpen}>ADD MANUAL</div>
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
                                        <AddEachMaterialsWithHand closeCard={_handleAddClose} addNewMaterial={_handleAddMaterial} />
                                    </Box>
                                </Modal>
                            </MenuItem>

                            <MenuItem>
                                <div onClick={_handleAddMultipleOpen}>{t(codeLanguage + '000050')}</div>
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
                                        borderRadius: "20px",
                                        height: "fit-content"
                                    }}>
                                        <AddMultipleComponentWithExcel closeMultipleCard={_handleAddMultipleClose} addNewMaterial={_handleAddExcelMaterial} />
                                    </Box>
                                </Modal>

                            </MenuItem>
                        </Menu>
                    </div>
                </div>
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
                <Modal
                    open={editopen}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {formId !== null && (
                            <EditMaterialPopUpScreens
                                editClose={_handleEditClose}
                                fid={formId}
                                updateMaterial={_handleUpdateMaterial}
                            />
                        )}
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default ManageMaterials;
