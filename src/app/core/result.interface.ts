export interface Result {
    files: Array<Object>;
    message: string;
    last_id: string;
    status: number;
    data: any;
    success: boolean;
    role: 'artist' | 'publicUser';
}
export interface Files {
    filename: string;
    contentType: string;
    metadata: Array<Object>;
}
interface Address {
    street: string
}
export interface UserProfile {
    email: string;
    firstName?: string,
    lastName?: string,
    artBy?: string;
    contactNumber?: string;
    countryCode?: string;
    address?: {
        street: string,
        city: string,
        state: string,
        zip: string,
        country: string
    };
    _id?: null
}