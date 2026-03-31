

export interface ILogin {
    email: string,
    password: string
}
export interface IChangePasswordPayload {
    currentPassword: string,
    newPassword: string
}
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
}