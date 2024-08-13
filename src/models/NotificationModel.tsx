import { UserInterface } from "./UserModel";

export interface NotificationInterface {
    notificationID: string;
    sender: UserInterface;
    recipient: UserInterface;
    action: string;
    type: string;
    targetID: string;
    message: string;
    status: boolean;
    createDate: string;
    lastModifiedDate: string | null;
}