export interface LoginUser {
    access_token: string;
    appConfigurations: Array<any>;
    data: any;
    expires_in: number;
    firstTimeLogin: boolean;
    notifications: object;
    passwordExpiryStatus: object;
    statusCode: number;
    userLocations: Array<any>;
    userPermission: any;
}
