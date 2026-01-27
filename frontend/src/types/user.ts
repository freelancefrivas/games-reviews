export interface User {
    id: number;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    email: string;
    nickname: string;
    admin: boolean;
    writer: boolean;
}