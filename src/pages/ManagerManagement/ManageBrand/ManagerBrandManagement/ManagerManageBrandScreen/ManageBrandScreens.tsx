import * as React from "react";
import { Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Paper, Divider, Modal, Fade, Backdrop } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import { useTheme, styled } from "@mui/material/styles";
import { useTranslation } from 'react-i18next';
import Swal from "sweetalert2";
import axios from "axios";
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { Brand } from "../../../../../models/ManagerBrandModel";
import { CancelOutlined, CheckCircleOutline, ArrowBack, ArrowForward } from "@mui/icons-material";

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        overflow: 'hidden',
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    // backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.black,
    padding: theme.spacing(2),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    maxHeight: '70vh',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.background.paper,
    },
    '&::-webkit-scrollbar-thumb': {
        // background: theme.palette.primary.gray,
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: theme.palette.primary.dark,
    },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: 12,
    padding: theme.spacing(3),
    boxShadow: theme.shadows[5],
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.success.main,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
}));

const InfoItem = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));

const ImageThumbnail = styled('img')({
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
    },
});

const ModalImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '80vh',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255,255,255,0.3)',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
}));

const ManageBrand: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = React.useState<Brand[]>([]);
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();
    const { t, i18n } = useTranslation();
    const [selectedBrand, setSelectedBrand] = React.useState<any>(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openImageModal, setOpenImageModal] = React.useState(false);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    React.useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.getAllBrandInformation}`;

        axios.get(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    const updatedData = responseData.data.map((brand: Brand) => ({
                        ...brand,
                        actionTaken: brand.brandStatus !== "ACCEPT" || localStorage.getItem(`brandAction_${brand.brandID}`) === 'true'
                    }));

                    // Sort data by createDate in descending order
                    updatedData.sort((a: Brand, b: Brand) => {
                        return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
                    });

                    setData(updatedData);
                    console.log("Data received:", updatedData);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    const handleRowClick = async (params: any) => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.getBrandByID}/${params.row.brandID}`;
            const response = await axios.get(apiUrl);
            if (response.status === 200) {
                setSelectedBrand(response.data.data);
                setOpenDialog(true);
            }
        } catch (error) {
            console.error('Error fetching brand details:', error);
            Swal.fire('Error', 'Failed to fetch brand details', 'error');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const _handleAcceptBrand = async (brandID: string) => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.acceptBrand}`;
            const response = await axios.get(apiUrl + `/${brandID}`)
            console.log("brandID" + brandID);
            if (!response.data) {
                throw new Error('Error accepting brand');
            }
            return response;
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
                throw new Error('Error rejecting brand');
            }
            return response;
        } catch (error) {
            throw error;
        }
    };

    const _hanldeConfirmAccept = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: `Confirm Accept`,
                text: `Are you sure you want to accept this brand`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Yes I want to accept`,
                cancelButtonText: `${t(codeLanguage + '000055')}`,
                customClass: {
                    container: 'swal-on-top'
                }
            });

            if (result.isConfirmed) {
                const response = await _handleAcceptBrand(id);
                if (response.status === 200) {
                    Swal.fire(
                        `Accept Brand Success`,
                        `Brand Has Been Accepted Successfully`,
                        'success'
                    );
                    localStorage.setItem(`brandAction_${id}`, 'true');
                    handleCloseDialog(); // Close the dialog here
                }
            } else {
                Swal.fire(
                    `Cancel Accept Brand`,
                    `You Cancelled Accept Brand`,
                    'error'
                );
                handleCloseDialog(); // Close the dialog here
            }
        } catch (error: any) {
            console.error('Error:', error);
            Swal.fire(
                'Error',
                `${error.message || 'Unknown error'}`,
                'error'
            );
            handleCloseDialog(); // Close the dialog here
        }
    };

    const _hanldeConfirmDeny = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: `Confirm Reject`,
                text: `Are you sure you want to reject this brand`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Yes I want to reject`,
                cancelButtonText: `${t(codeLanguage + '000055')}`,
                customClass: {
                    container: 'swal-on-top'
                }
            });

            if (result.isConfirmed) {
                const response = await _handleDenyBrand(id);
                if (response.status === 200) {
                    Swal.fire(
                        `Reject Brand Success`,
                        `Brand Has Been Rejected Successfully`,
                        'success'
                    );
                    localStorage.setItem(`brandAction_${id}`, 'true');
                    handleCloseDialog(); // Close the dialog here
                }
            } else {
                Swal.fire(
                    `Cancel Reject Brand`,
                    `You Cancelled Reject Brand`,
                    'error'
                );
                handleCloseDialog(); // Close the dialog here
            }
        } catch (error: any) {
            console.error('Error:', error);
            Swal.fire(
                'Error',
                `${error.message || 'Unknown error'}`,
                'error'
            );
            handleCloseDialog(); // Close the dialog here
        }
    };

    const handleImageClick = (imageUrl: string) => {
        const index = selectedBrand.images.findIndex((img: any) => img.imageUrl === imageUrl);
        setCurrentImageIndex(index);
        setOpenImageModal(true);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % selectedBrand.images.length
        );
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + selectedBrand.images.length) % selectedBrand.images.length
        );
    };

    const handleCloseImageModal = () => {
        setOpenImageModal(false);
    };

    const columns: GridColDef[] = [
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            headerAlign: "left",
            renderCell: (params) => params.row.user.email,
        },
        {
            field: "brandName",
            headerAlign: "left",
            headerName: "Brand Name",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    <Box
                        component="img"
                        src={params.row.user.imageUrl}
                        alt={params.row.brandName}
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            mr: 2
                        }}
                    />
                    {params.row.brandName}
                </Box>
            )
        },
        {
            field: "accountNumber",
            headerName: "Account Number",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "phoneNumber",
            headerName: "Phone Number",
            flex: 1,
            renderCell: (params) => params.row.user.phoneNumber,
        },
        {
            flex: 1,
            field: "createDate",
            headerName: "Date Create"
        },
        {
            field: "brandStatus",
            headerName: "Brand Status",
            renderCell: (params) => (
                <Box
                    sx={{
                        backgroundColor: params.value === 'ACCEPT' ? '#e8f5e9' : '#ffebee',
                        color: params.value === 'ACCEPT' ? '#4caf50' : '#f44336',
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
                            backgroundColor: params.value === 'ACCEPT' ? '#4caf50' : '#f44336',
                        }}
                    />
                    {params.value}
                </Box>
            )
        },
    ];

    const getRowId = (row: any) => `${row.brandID}-${row.brandName}-${row.brandStatus}`;

    const getBrandStatusStyle = (status: any) => {
        switch (status) {
            case 'REJECT':
                return {
                    backgroundColor: '#FFEBEE',
                    color: '#D32F2F'
                };
            case 'ACCEPT':
                return {
                    backgroundColor: '#E8F5E9',
                    color: '#388E3C'
                };
            case 'PENDING':
                return {
                    backgroundColor: '#FFF3E0',
                    color: '#F57C00'
                };
            default:
                return {
                    backgroundColor: '#E0E0E0',
                    color: '#757575'
                };
        }
    };

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
                    }, '& .MuiDataGrid-row:nth-of-type(odd)': {
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
                    onRowClick={handleRowClick}
                />
            </Box>

            <StyledDialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <StyledDialogTitle>
                    Brand Details
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
                    >
                        <CancelOutlined sx={{ color: "red" }} />
                    </IconButton>
                </StyledDialogTitle>
                <StyledDialogContent>
                    {selectedBrand && (
                        <StyledPaper elevation={3}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <SectionTitle variant="h6">Brand Information</SectionTitle>
                                    <InfoItem><strong>Brand ID:</strong> {selectedBrand.brandID}</InfoItem>
                                    <InfoItem><strong>Brand Name:</strong> {selectedBrand.brandName}</InfoItem>
                                    <InfoItem>
                                        <strong>Brand Status:</strong>{" "}
                                        <Box
                                            component="span"
                                            sx={{
                                                display: 'inline-block',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                ...getBrandStatusStyle(selectedBrand.brandStatus)
                                            }}
                                        >
                                            {selectedBrand.brandStatus}
                                        </Box>
                                    </InfoItem>
                                    <InfoItem><strong>Create Date:</strong> {selectedBrand.createDate}</InfoItem>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <SectionTitle variant="h6">User Information</SectionTitle>
                                    <InfoItem><strong>Email:</strong> {selectedBrand.user.email}</InfoItem>
                                    <InfoItem><strong>Full Name:</strong> {selectedBrand.user.fullName}</InfoItem>
                                    <InfoItem><strong>Phone Number:</strong> {selectedBrand.user.phoneNumber}</InfoItem>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <SectionTitle variant="h6">Bank Information</SectionTitle>
                                    <InfoItem><strong>Bank Name:</strong> {selectedBrand.bankName}</InfoItem>
                                    <InfoItem><strong>Account Number:</strong> {selectedBrand.accountNumber}</InfoItem>
                                    <InfoItem><strong>Account Name:</strong> {selectedBrand.accountName}</InfoItem>
                                </Grid>
                                <Grid item xs={12}>
                                    <SectionTitle variant="h6">Address</SectionTitle>
                                    <InfoItem>{`${selectedBrand.address}, ${selectedBrand.ward}, ${selectedBrand.district}, ${selectedBrand.province}`}</InfoItem>
                                </Grid>
                                <Grid item xs={12}>
                                    <SectionTitle variant="h6">Images</SectionTitle>
                                    <Box display="flex" flexWrap="wrap" gap={2}>
                                        {selectedBrand.images.map((image: any, index: number) => (
                                            <ImageThumbnail
                                                key={index}
                                                src={image.imageUrl}
                                                alt={`Brand Image ${index + 1}`}
                                                onClick={() => handleImageClick(image.imageUrl)}
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    )}
                </StyledDialogContent>
                <DialogActions sx={{ padding: 2, justifyContent: 'flex-end' }}>
                    <Button
                        onClick={() => _hanldeConfirmAccept(selectedBrand.brandID)}
                        variant="contained"
                        startIcon={<CheckCircleOutline />}
                        sx={{ backgroundColor: "green", '&:hover': { backgroundColor: "darkgreen" } }}
                        disabled={selectedBrand?.brandStatus !== 'PENDING'}
                    >
                        Accept Brand
                    </Button>
                    <Button
                        onClick={() => _hanldeConfirmDeny(selectedBrand.brandID)}
                        variant="contained"
                        startIcon={<CancelOutlined />}
                        sx={{ backgroundColor: "red", '&:hover': { backgroundColor: "darkred" } }}
                        disabled={selectedBrand?.brandStatus !== 'PENDING'}
                    >
                        Reject Brand
                    </Button>
                </DialogActions>
            </StyledDialog>
            <Modal
                open={openImageModal}
                onClose={handleCloseImageModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openImageModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                            outline: 'none',
                            borderRadius: 4,
                            textAlign: 'center',
                            width: '95%',
                            maxWidth: '1200px',
                            height: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            position="relative"
                            width="100%"
                            height="calc(100% - 80px)"
                            sx={{
                                backgroundColor: 'rgba(0,0,0,0.03)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ModalImage
                                src={selectedBrand?.images[currentImageIndex]?.imageUrl}
                                alt="Enlarged brand image"
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                }}
                            />
                            <NavigationButton
                                onClick={handlePreviousImage}
                                sx={{
                                    left: 20,
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                                }}
                            >
                                <ArrowBack />
                            </NavigationButton>
                            <NavigationButton
                                onClick={handleNextImage}
                                sx={{
                                    right: 20,
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                                }}
                            >
                                <ArrowForward />
                            </NavigationButton>
                        </Box>
                        <Box sx={{
                            height: '80px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'background.default',
                            borderTop: '1px solid rgba(0,0,0,0.1)',
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Image {currentImageIndex + 1} of {selectedBrand?.images.length}
                            </Typography>
                            <Button
                                onClick={handleCloseImageModal}
                                variant="contained"
                                sx={{
                                    backgroundColor: "#EA580C",
                                    '&:hover': { backgroundColor: "#D04A08" },
                                    px: 4,
                                    py: 1,
                                    borderRadius: 2,
                                }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <style>
                {`
                    .swal-on-top {
                        z-index: 9999 !important;
                    }
                `}
            </style>
        </Box>
    );
};

export default ManageBrand;