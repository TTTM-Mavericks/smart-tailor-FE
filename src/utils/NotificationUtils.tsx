import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from "../api/ApiConfig";

export const __handleSendNotification = async (bodyRequest: any) => {
    try {
        const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.notification + functionEndpoints.notification.sendNoti}`, bodyRequest);
        if (response.status === 200) {
            console.log(response.data);
            
        } else {
            console.log(response.message);
        }
        console.log(response);
    } catch (error) {
        console.log(error);

    }
}