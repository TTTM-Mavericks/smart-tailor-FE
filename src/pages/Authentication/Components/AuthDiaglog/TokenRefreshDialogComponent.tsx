import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../../../components/Loading/LoadingComponent';
import { primaryColor, redColor, whiteColor } from '../../../../root/ColorSystem';


const TokenRefreshDialogComponent: React.FC = () => {

    // ---------------UseState Variable---------------//
    const [open, setOpen] = useState(false);
    const [authToken, setAuthToken] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // ---------------Usable Variable---------------//

    // ---------------UseEffect---------------//

    /**
     * Fetch validate token
     */
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            console.log('token', token);
            setAuthToken(token);
            const isValid = isAuthenticated(token);
            if (isValid) {
                setOpen(false);
            } else {
                setOpen(true);
            }

        }
    }, [authToken]);

    // ---------------FunctionHandler---------------//

    /**
     * Recive new token by reseting refresh token
     */
    const __handleRefreshToken = async () => {
        setIsLoading(true);
        try {
            const refreshToken = Cookies.get('refreshToken');
            console.log(refreshToken);
            const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.refreshToken}`, null, refreshToken);
            console.log(response);
            if (response.status === 200) {
                const authToken = response.data.access_token;
                const refreshToken = response.data.refresh_token;
                Cookies.set('token', authToken);
                Cookies.set('refreshToken', refreshToken);
                setIsLoading(false);
                setOpen(false);
            } else {
                console.log(response);
                setIsLoading(false);
                toast.error(`${response.message}`, { autoClose: 4000 });
            }

        } catch (error: any) {
            toast.error(`${error}`, { autoClose: 3000 });
            console.error('Error posting data:', error);
            setIsLoading(false);
        }
    };

    /**
     * Logout
     */
    const __handleLogout = async () => {
        setIsLoading(true);

        try {
            const authToken = Cookies.get('token');
            const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.signout}`, authToken);
            if (response.status === 200) {
                localStorage.clear();
                Cookies.remove('token');
                Cookies.remove('refreshToken');
                setIsLoading(false);
                window.location.href = '/auth/signin'
            } else {
                setIsLoading(false);
                toast.error(`${response.message}`, { autoClose: 4000 });
            }
        } catch (error: any) {
            console.error('Error posting data:', error);
            setIsLoading(false);
            toast.error(`${error}`, { autoClose: 3000 });
        }
    }

    /**
     * Check validate token
     * @param token 
     * @returns 
     */
    const tokenIsValid = (token: string) => {
        try {
            const decoded = jwtDecode(token);
            const expiration = decoded.exp;
            return expiration && expiration > Math.floor(Date.now() / 1000);
        } catch (error) {
            return false;
        }
    };

    /**
     * Check validate token
     * @param token 
     * @returns 
     */
    const isAuthenticated = (token: any) => {

        if (!tokenIsValid(token)) {
            return false;
        } else return true
    }

    return (
        <div style={{}}>
            <div style={{width: '100%', marginTop: -80}}>
                <LoadingComponent isLoading={isLoading} time={5000}></LoadingComponent>
            </div>
            <ToastContainer />
            <Dialog open={open} style={{ position: 'absolute', top: 0 }}>
                <DialogTitle>Session Expiring</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your session is about to expire. Do you want to stay signed in?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={__handleLogout} style={{ color: primaryColor }}  >
                        Logout
                    </Button>
                    <Button onClick={__handleRefreshToken} style={{ backgroundColor: redColor, color: whiteColor }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TokenRefreshDialogComponent;
