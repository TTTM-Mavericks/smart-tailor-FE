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

