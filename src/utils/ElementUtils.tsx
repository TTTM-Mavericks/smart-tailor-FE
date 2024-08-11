import { NotificationInterface } from "../models/NotificationModel";
import { blackColor, greenColor, primaryColor, redColor, whiteColor, yellowColor } from "../root/ColorSystem";

export const __handlegetRatingStyle = (rating: any) => {
    if (rating < 0) {
        return 'rating-red';
    } else if (rating >= 1 && rating < 3) {
        return 'rating-orange';
    } else if (rating >= 3 && rating < 5) {
        return 'rating-yellow';
    } else if (rating >= 5) {
        return 'rating-green';
    } else {
        return 'rating-default'; // default class if rating doesn't match any condition
    }
};

export const __handlegetStatusBackgroundBoolean = (value: any) => {
    if (value) {
        return { backgroundColor: greenColor, color: whiteColor, fontSize: 12, paddingTop: -5, paddingBottom: -5 }
    } else return { backgroundColor: primaryColor, color: whiteColor, fontSize: 12, paddingTop: -5, paddingBottom: -5 }
};

const capitalizeFirstLetter = (string: string): string => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Function to determine the article 'a' or 'an'
const getArticle = (type: string): string => {
    const lowercaseType = type.toLowerCase();
    return ['a', 'e', 'i', 'o', 'u'].includes(lowercaseType.charAt(0)) ? 'an' : 'a';
};

// Example function to generate the notification message
export const generateNotificationMessage = (notification: NotificationInterface): string => {
    const roleName = capitalizeFirstLetter(notification.sender.roleName);
    const action = notification.action.toLowerCase(); // Assuming action is in uppercase
    const type = capitalizeFirstLetter(notification.type);
    const article = getArticle(capitalizeFirstLetter(notification.type));

    return `${roleName} ${action} ${article} ${type}`;
};

