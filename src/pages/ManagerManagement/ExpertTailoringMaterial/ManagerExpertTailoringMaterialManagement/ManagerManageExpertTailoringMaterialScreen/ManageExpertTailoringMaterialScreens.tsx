import { Box, Button, IconButton, Menu, MenuItem, Modal } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import { useTheme } from "@mui/material";
import * as React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";
import EditExpertTailoringMaterialPopUpScreens from "../ManagerEditExpertTailoringMaterial/EditExpertTailoringMaterialPopUpScreens";
import { Add, UndoOutlined } from "@mui/icons-material";
import AddEachExpertTailoringWithHand from "../../AddEachWithHand/AddEachExpertTailoringWithHandScreens";
import AddMultipleExpertTailoringMaterialComponentWithExcel from "../../AddMultipleExpertTailoringMaterialWithExcel/AddMultipleExpertTailoringMaterialComponent";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { AddExpertTailoring, ExpertTailoring } from "../../../../../models/ManagerExpertTailoringModel";
import { ExpertTailoringEdit } from "../../../../../models/ManagerExpertTailoringModel";
import { AddExpertTailoringMaterial, ExpertTailoringMaterial } from "../../../../../models/ManagerExpertTaloringMaterialModel";
import { greenColor } from "../../../../../root/ColorSystem";
import { __getToken } from "../../../../../App";

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

const ManageExpertTailoringMaterial: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<ExpertTailoringMaterial[]>([]);

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
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.expertTailoringMaterial + functionEndpoints.expertTailoringMaterial.getAllExpertTailoringMaterial}`;

        axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${__getToken()}`
            }
        })
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
    const _handleAddExpertTailoring = (addedNewMaterial: AddExpertTailoringMaterial) => {
        setData((prevData: any) => [...prevData, addedNewMaterial]);
    }

    // // Cập nhật người dùng trong danh sách
    // const _handleUpdateMaterial = (updatedExpertTailoring: ExpertTailoringEdit) => {
    //     setData(prevData => prevData.map((ExpertTailoring: any) => ExpertTailoring.expertTailoringID === updatedExpertTailoring.expertTailoringID ? updatedExpertTailoring : ExpertTailoring));
    // }

    // // EDIT 
    // const _handleEditClick = (
    //     expertTailoringID: string,
    //     expertTailoringName: string,
    //     sizeImageUrl: string,
    // ) => {
    //     // Handle edit action
    //     const ExpertTailoringDataToEdit: ExpertTailoringEdit = {
    //         expertTailoringID: expertTailoringID,
    //         expertTailoringName: expertTailoringName,
    //         sizeImageUrl: sizeImageUrl,
    //     }
    //     setFormId(ExpertTailoringDataToEdit);
    //     _handleEditOpen();
    // };

    //DELETE OR UPDATE
    const _handleDeleteClick = async (expertTailoringID: string, materialID: string) => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.expertTailoringMaterial + functionEndpoints.expertTailoringMaterial.updateStatusExpertTailoringMaterial}`;

            const response = await axios.put((apiUrl + `?expertTailoringID=${expertTailoringID}&materialID=${materialID}`), {
                headers: {
                    Authorization: `Bearer ${__getToken()}`
                }
            })

            if (!response.data) {
                throw new Error('Error deleting material');
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // confirm 
    const _hanldeConfirmDelete = async (materialID: string, expertTailoringID: string) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure to update status expert tailoring',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, I want to update',
                cancelButtonText: `${t(codeLanguage + '000055')}`
            });

            if (result.isConfirmed) {
                await _handleDeleteClick(materialID, expertTailoringID); // Ensure id is converted to string if necessary
                Swal.fire(
                    'Updated status expert tailoring',
                    'Updated status success',
                    'success'
                );

                // Update the deleted material from the current data list
                setData((prevData: any) =>
                    prevData.map((expertTailoring: any) =>
                        expertTailoring.expertTailoringID === expertTailoringID
                            ? { ...expertTailoring, status: !expertTailoring.status }
                            : expertTailoring
                    )
                );
            } else {
                Swal.fire(
                    'Updated status expert tailoring fail!',
                    'Updated status fail',
                    'error'
                );
            }
        } catch (error: any) {
            console.error('Error:', error);
            Swal.fire(
                'Updated status expert tailoring fail!',
                'Updated status fail',
                'error'
            );
        }
    };

    const columns: GridColDef[] = [
        {
            field: "expertTailoringID",
            headerName: "ExpertTailoring ID",
            flex: 1,
        },
        {
            field: "expertTailoringName",
            headerName: "ExpertTailoring Name",
            flex: 1,
        },
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
            field: "createDate",
            headerName: "Create Date",
            headerAlign: "left",
            align: "left",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            headerAlign: "left",
            align: "left",
            renderCell: (params) => (
                <Box
                    sx={{
                        backgroundColor: params.value === true ? '#e8f5e9' : '#ffebee',
                        color: params.value === true ? '#4caf50' : '#f44336',
                        borderRadius: '16px',
                        padding: '1px 5px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        height: "50%",
                        marginTop: "10%"
                    }}
                >
                    <Box
                        sx={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                        }}
                    />
                    {params.value === true ? 'ACTIVE' : 'INACTIVE'}
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
                    {params.row.status ? (
                        <IconButton onClick={() => _hanldeConfirmDelete(params.row.expertTailoringID, params.row.materialID)}>
                            <DeleteIcon htmlColor={colors.primary[300]} />
                        </IconButton>
                    ) : (
                        <IconButton onClick={() => _hanldeConfirmDelete(params.row.expertTailoringID, params.row.materialID)}>
                            <UndoOutlined htmlColor="green" />
                        </IconButton>
                    )}
                </Box>
            )
        }
    ];

    const getRowId = (row: any) => `${row.expertTailoringID}-${row.categoryID}-${row.materialID}`;

    return (
        <Box m="20px" style={{ marginTop: "-5%" }}>
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
                <div className="container" style={{ display: "flex", marginTop: "-5%" }}>
                    <h1 style={{ fontWeight: "bolder", fontSize: "20px", marginLeft: "10px" }}>
                        Manage Material Expert Tailoring Table
                    </h1>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={_handleAddOpen}
                        endIcon={<Add />}
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: `${greenColor}`, color: `${colors.primary[200]} !important`, marginLeft: "50%" }}
                    >
                        {t(codeLanguage + '000048')}
                    </Button>
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
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "20px"
                        }}>
                            <AddEachExpertTailoringWithHand closeCard={_handleAddClose} addNewExpertTailoringMaterial={_handleAddExpertTailoring} />
                        </Box>
                    </Modal>
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
                {/* <Modal
                    open={editopen}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {formId !== null && (
                            <EditExpertTailoringMaterialPopUpScreens
                                editClose={_handleEditClose}
                                fid={formId}
                                updateExpertTailoring={_handleUpdateMaterial}
                            />
                        )}
                    </Box>
                </Modal> */}
            </Box>
        </Box >
    );
};

export default ManageExpertTailoringMaterial;
