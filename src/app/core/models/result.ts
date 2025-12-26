export interface Result {
    data: any;
    status: string;
    isSuccess: boolean;
    successMessage: string;
    errors: Array<string>;
    validationErrors: Array<any>;
}