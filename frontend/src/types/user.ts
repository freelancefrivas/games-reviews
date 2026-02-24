export enum RoleType {
    ADMIN = 'Admin',
    WRITER = 'Writer',
    EDITOR = 'Editor'
}
export interface User {
    id: number;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    email: string;
    nickname: string;
    role: RoleType;
}