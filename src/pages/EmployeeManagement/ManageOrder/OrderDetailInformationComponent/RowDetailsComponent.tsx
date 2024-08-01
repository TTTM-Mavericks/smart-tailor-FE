import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Paper, Box, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Avatar, Modal, TextField } from '@mui/material';
import Swal from 'sweetalert2';

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

const RowDetails: React.FC = () => {
    const location = useLocation();
    const [rowData, setRowData] = useState(location.state);
    const [updatedData, setUpdatedData] = useState({ ...rowData });

    const [showModal, setShowModal] = useState<boolean>(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleUpdateFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedData({
            ...updatedData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateConfirm = async () => {
        try {
            const response = await fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_DATA_TEST/' + rowData.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const result = await response.json();
                setRowData(result);
                setShowModal(false);
                Swal.fire({
                    title: 'Updated!',
                    text: 'Your order has been updated.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                throw new Error('Failed to update order');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update order.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Typography variant="h4" color="textPrimary" gutterBottom>
                    Order Details {rowData.id}
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Order Items</Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{rowData.total}</TableCell>
                                                <TableCell>{rowData.total}</TableCell>
                                                <TableCell>{rowData.total}</TableCell>
                                                <TableCell>{rowData.total}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Box mt={2}>
                                    <Typography variant="h6" gutterBottom>Transactions</Typography>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Amount</TableCell>
                                                    <TableCell>Processor</TableCell>
                                                    <TableCell>Processor ID</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>{rowData.total}</TableCell>
                                                    <TableCell>{rowData.total}</TableCell>
                                                    <TableCell>{rowData.total}</TableCell>
                                                    <TableCell>{rowData.total}</TableCell>
                                                    <TableCell>{rowData.total}</TableCell>
                                                    <TableCell>{rowData.total}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Customer</Typography>
                                <Box mb={2} display="flex" alignItems="center">
                                    <Box>
                                        <Typography variant="body2"><strong>Name:</strong> {rowData.name}</Typography>
                                        <Typography variant="body2"><strong>Company:</strong> {rowData.total}</Typography>
                                        <Typography variant="body2"><strong>Address:</strong> {rowData.address}</Typography>
                                        <Typography variant="body2"><strong>City:</strong> {rowData.total}</Typography>
                                        <Typography variant="body2"><strong>Postal Code:</strong> {rowData.total}</Typography>
                                        <Typography variant="body2"><strong>Country:</strong> {rowData.total}</Typography>
                                        <Typography variant="body2"><strong>Email:</strong> {rowData.total}</Typography>
                                    </Box>
                                    <Avatar alt={rowData.customerName} src={"https://controlio.net/i/svg/brand-figure.svg"} style={{ marginLeft: "30%", marginTop: "-50%" }} />
                                </Box>

                                <Typography variant="h6" gutterBottom>Order Details</Typography>
                                <Box mb={2}>
                                    <Typography variant="body2"><strong>Status:</strong> {rowData.total}</Typography>
                                    <Typography variant="body2"><strong>Date Created:</strong> {rowData.total}</Typography>
                                    <Typography variant="body2"><strong>Payment Method:</strong> {rowData.total}</Typography>
                                </Box>

                                <Box mt={2} display="flex" justifyContent="space-between">
                                    <Button variant="contained" onClick={handleOpen} style={{ backgroundColor: "#EC6208" }}>
                                        Update
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Modal
                        open={showModal}
                        onClose={handleClose}
                        aria-labelledby="update-modal-title"
                        aria-describedby="update-modal-description"
                    >
                        <Box sx={style} style={{
                            height: '500px',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            '&::-webkit-scrollbar': {
                                width: 0,
                                backgroundColor: '#f5f5f5',
                            }
                        }}>
                            <Typography id="update-modal-title" variant="h6" component="h2" gutterBottom style={{ color: "black" }}>
                                Update Order
                            </Typography>
                            <TextField
                                label="Product"
                                name="product"
                                value={updatedData.product}
                                onChange={handleUpdateFieldChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Price"
                                name="price"
                                value={updatedData.price}
                                onChange={handleUpdateFieldChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Quantity"
                                name="quantity"
                                value={updatedData.quantity}
                                onChange={handleUpdateFieldChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Total"
                                name="total"
                                value={updatedData.total}
                                onChange={handleUpdateFieldChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Transaction ID"
                                name="transactionId"
                                value={updatedData.transactionId}
                                onChange={handleUpdateFieldChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Date"
                                name="date"
                                value={updatedData.date}
                                onChange={handleUpdateFieldChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Status"
                                name="status"
                                value={updatedData.status}
                                onChange={handleUpdateFieldChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Amount"
                                name="amount"
                                value={updatedData.amount}
                                onChange={handleUpdateFieldChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Processor"
                                name="processor"
                                value={updatedData.processor}
                                onChange={handleUpdateFieldChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Processor ID"
                                name="processorId"
                                value={updatedData.processorId}
                                onChange={handleUpdateFieldChange}
                                fullWidth
                                margin="normal"
                            />

                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button variant="contained" onClick={handleUpdateConfirm} style={{ backgroundColor: "#EC6208" }}>
                                    Update
                                </Button>
                                <Button variant="contained" color="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </Grid>
            </Box>
        </Container>
    );
};

export default RowDetails;
