import * as React from "react";
import { Box, Button, IconButton, Menu, MenuItem, Modal } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import { useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";
import EditMaterialPopUpScreens from "./EditMaterial/EditMaterialPopUpScreens";
import AddEachMaterialWithHand from "../AddEachWithHand/AddEachMaterialWithHandScreens";
import { AddExcelMultiple, AddMaterial, ExcelData } from "../../../../models/BrandMaterialExcelModel";
import { Material } from "../../../../models/BrandMaterialExcelModel";
import AddMultipleMaterialWithExcel from "../CRUDMaterialWithExcelTable/AddMultipleInExcelTable/AddMultipleMaterialComponent";
import { UpdateMaterial } from "../../../../models/BrandMaterialExcelModel";
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { UserInterface } from "../../../../models/UserModel";
import Cookies from "js-cookie";
import { greenColor } from "../../../../root/ColorSystem";
const brand_name = "LA LA LISA BRAND"

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

const ManageMaterialComponent: React.FC = () => {


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<Material[]>([]);

    // set formid to pass it to component edit user
    const [formId, setFormId] = React.useState<AddMaterial | null>(null);

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


    let brandAuth: any = null;

    const BRANDROLECHECK = Cookies.get('userAuth');

    if (BRANDROLECHECK) {
        try {
            brandAuth = JSON.parse(BRANDROLECHECK);
            const { userID, email, fullName, language, phoneNumber, roleName, imageUrl, userStatus } = brandAuth;
            // Your code that uses the parsed data
        } catch (error) {
            console.error('Error parsing JSON:', error);
            // Handle the error, perhaps by setting default values or showing an error message
        }
    } else {
        console.error('userAuth cookie is not set');
        // Handle the case when the cookie does not exist
    }


    let brandFromSignUp: any = null
    // Get BrandID from session
    const getBrandFromSingUp = sessionStorage.getItem('userRegister') as string | null;

    if (getBrandFromSingUp) {
        const BRANDFROMSIGNUPPARSE: UserInterface = JSON.parse(getBrandFromSingUp);
        const brandID = BRANDFROMSIGNUPPARSE.userID;
        const brandEmail = BRANDFROMSIGNUPPARSE.email;
        brandFromSignUp = { brandID, brandEmail }
        console.log(brandFromSignUp);

        console.log('Brand ID:', brandID);
        console.log('Brand Email:', brandEmail);
    } else {
        console.error('No user data found in session storage');
    }
    // Get ID When something null
    const getID = () => {
        if (!brandAuth || brandAuth.userID === null || brandAuth.userID === undefined || brandAuth.userID === '') {
            return brandFromSignUp.brandID;
        } else {
            return brandAuth.userID;
        }
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

    React.useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_material + functionEndpoints.material.getAllBrandMaterialByBrandID + `/${getID()}`}`;
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

    // Thêm người dùng mới vào danh sách
    const _handleAddMaterial = (newMaterial: AddMaterial) => {
        setData((prevData: any) => [...prevData, newMaterial]);
    }

    const _handleAddMultipleMaterial = (newMaterial: AddExcelMultiple[]) => {
        setData((prevData: any) => [...prevData, ...newMaterial]);
    }


    // Cập nhật người dùng trong danh sách
    const _handleUpdateMaterial = (updatedMaterial: UpdateMaterial) => {
        setData(prevData => prevData.map((material: any) =>
            material.categoryName === updatedMaterial.categoryName &&
                material.materialName === updatedMaterial.materialName &&
                material.hsCode === updatedMaterial.hsCode ? updatedMaterial : material
        ));
    }

    // EDIT 
    const _handleEditClick = (
        categoryName: string,
        materialName: string,
        hsCode: number,
        unit: string,
        basePrice: number,
        brandPrice: number,
        brandName: string,
    ) => {
        // Handle edit action
        const materialDataToEdit: UpdateMaterial = {
            brandName: brandName,
            categoryName: categoryName,
            materialName: materialName,
            hsCode: hsCode,
            unit: unit,
            basePrice: basePrice,
            brandPrice: brandPrice
        }
        console.log('Category Name:', categoryName);
        console.log('Material Name:', materialName);
        console.log('HS Code:', hsCode);
        console.log('Unit:', unit);
        console.log('Brand Price:', brandPrice);
        console.log('Base Price:', basePrice);
        console.log('Brand Name:', brandName);
        setFormId(materialDataToEdit);
        _handleEditOpen();
    };

    //DELETE OR UPDATE
    const _handleDeleteClick = async (id: number) => {
        // Handle delete action
        try {
            const response = await fetch(`http://localhost:6969/api/v1/brand-material/get-all-brand-material-by-brand-name?brandName=LA LA LISA BRAND`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error deleting material');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }

    }

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
                await _handleDeleteClick(id);
                Swal.fire(
                    `${t(codeLanguage + '000064')}`,
                    `${t(codeLanguage + '000065')}`,
                    'success'
                )
                // Loại bỏ người dùng khỏi danh sách hiện tại
                setData(prevData => prevData.filter(material => material.id !== id));
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
        // { field: "id", headerName: "ID", flex: 0.5 },
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
            field: "hsCode",
            headerName: "HS Code",
            flex: 1,
        },
        {
            field: "basePrice",
            headerName: "Base Price",
            type: "number",
            headerAlign: "left",
            align: "left",
            flex: 1,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 1,
        },
        {
            field: "brandPrice",
            headerName: "Brand Price",
            type: "number",
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
                    <IconButton onClick={() => _handleEditClick(params.row.categoryName, params.row.materialName, params.row.hsCode, params.row.unit, params.row.brandPrice, params.row.basePrice, params.row.brandName)}>
                        <EditIcon htmlColor="#E96208" />
                    </IconButton>
                </Box>
            )
        }
    ];

    const getRowId = (row: any) => `${row.id}-${row.materialName}`;

    return (
        <Box m="20px" sx={{ marginTop: "-6%" }}>
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
                    <h1 style={{ fontWeight: "bolder", fontSize: "20px", marginLeft: "35%" }}>
                        Manage Material Table
                    </h1>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={_handleAddMultipleOpen}
                        endIcon={<Add />}
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: `${greenColor}`, color: `${colors.primary[200]} !important`, marginLeft: "30%" }}
                    >
                        {t(codeLanguage + '000048')}
                    </Button>
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
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "20px"
                        }}>
                            <AddMultipleMaterialWithExcel closeMultipleCard={_handleAddMultipleClose} addNewMaterial={_handleAddMultipleMaterial} />
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
                        // checkboxSelection
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

export default ManageMaterialComponent;
