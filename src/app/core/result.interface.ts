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