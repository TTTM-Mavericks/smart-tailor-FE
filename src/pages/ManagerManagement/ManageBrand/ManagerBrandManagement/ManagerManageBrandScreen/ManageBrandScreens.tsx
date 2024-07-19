import * as React from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';
import Swal from "sweetalert2";
import axios from "axios";
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { Brand } from "../../../../../models/ManagerBrandModel";
import { CancelOutlined, CheckCircleOutline } from "@mui/icons-material";

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

const ManageBrand: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<Brand[]>([]);
    const [enabledButtons, setEnabledButtons] = React.useState<Record<string, boolean>>({});
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

    //DELETE OR UPDATE
    const _handleAcceptBrand = async (brandID: string) => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.acceptBrand}`;

            const response = await axios.get(apiUrl + `/${brandID}`)

            if (!response.data) {
                throw new Error('Error deleting material');
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const _handleDenyBrand = async (brandID: string) => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.rejectBrand}`;
            console.log("brandid: " + brandID);

            const response = await axios.get(apiUrl + `/${brandID}`)

            if (!response.data) {
                throw new Error('Error deleting material');
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const _hanldeConfirmAccept = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: `Confirm Accept`,
                text: `Are you sure you want to accept thís brand`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Yes I want to accept`,
                cancelButtonText: `${t(codeLanguage + '000055')}`
            });

            if (result.isConfirmed) {
                await _handleAcceptBrand(id.toString()); // Ensure id is converted to string if necessary
                Swal.fire(
                    `Accept Brand Success`,
                    `Brand Have Been Accept Successfull`,
                    'success'
                );

                setData((prevData: any) =>
                    prevData.map((user: any) =>
                        user.userID === id
                            ? { ...user, userStatus: "REJECT" }
                            : user
                    )
                );
            } else {
                Swal.fire(
                    `Cancel Accept Brand`,
                    `You Cancelled Accept Brand`,
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

    // confirm 
    const _hanldeConfirmDeny = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: `Confirm Reject`,
                text: `Are you sure you want to reject thís brand`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Yes I want to reject`,
                cancelButtonText: `${t(codeLanguage + '000055')}`
            });

            if (result.isConfirmed) {
                await _handleDenyBrand(id.toString()); // Ensure id is converted to string if necessary
                Swal.fire(
                    `Reject Brand Success`,
                    `Brand Have Been Reject Successfull`,
                    'success'
                );

                // Update the deleted material from the current data list
                setData((prevData: any) =>
                    prevData.map((user: any) =>
                        user.userID === id
                            ? { ...user, userStatus: "ACCEPT" }
                            : user
                    )
                );
            } else {
                Swal.fire(
                    `Cancel Reject Brand`,
                    `You Cancelled Reject Brand`,
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

    React.useEffect(() => {
        const initialEnabledButtons: Record<string, boolean> = {};
        data.forEach(row => {
            initialEnabledButtons[row.userID] = false;
        });
        setEnabledButtons(initialEnabledButtons);
    }, [data]);

    const columns: GridColDef[] = [
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "fullName",
            headerName: "Full Name",
            flex: 1,
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
            headerAlign: "left",
            align: "left",
        },
        {
            field: "provider",
            headerName: "Provider",
            headerAlign: "left",
            align: "left",
        },
        {
            field: "userStatus",
            headerName: "Status",
            headerAlign: "left",
            align: "left",
        },
        {
            field: "roleName",
            headerName: "Role",
            headerAlign: "left",
            align: "left",
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                if (params.row.userStatus === "ACTIVE") {
                    return (
                        <Box>
                            <IconButton onClick={() => _hanldeConfirmAccept(params.row.userID)}>
                                <CheckCircleOutline htmlColor="green" />
                            </IconButton>
                            <IconButton onClick={() => _hanldeConfirmDeny(params.row.userID)}>
                                <CancelOutlined htmlColor={colors.primary[300]} />
                            </IconButton>
                        </Box>
                    );
                }
                return null;
            }
        }
    ];

    const getRowId = (row: any) => `${row.userID}-${row.email}-${row.fullName}`;

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
            </Box>
        </Box>
    );
};

export default ManageBrand;
