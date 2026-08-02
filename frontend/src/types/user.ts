export enum RoleType {
    ADMIN = 'admin',
    WRITER = 'writer',
    EDITOR = 'editor',
    READER = 'reader',
}
export interface User {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
    nickname: string;
    role: RoleType;
    picture: string;
}