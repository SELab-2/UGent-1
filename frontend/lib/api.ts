
import axios, { AxiosError } from 'axios';
import { ApiError } from 'next/dist/server/api-utils';

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

enum ErrorType{
    UNKNOWN = "UNKNOWN",
    REQUEST_ERROR = "REQUEST_ERROR",
}

export class APIError{
    message: string | undefined;
    status: number | undefined = 0;
    type: ErrorType = ErrorType.UNKNOWN;
    trace: unknown;
}

export type Course = {
    course_id: number;
    name: string;
    description: string;
}

async function getListRequest(path: string){
    try {
        const response = await axios.get(backend_url + path, {withCredentials: true});
        if (response.status === 200 && Array.isArray(response?.data?.results)) {
            return response.data.results;
        } else if(response?.data?.detail) {
            console.error("Unexpected response structure:", response.data);
            const error : APIError = new APIError();
            error.status = response.status;
            error.message = response.data.detail;
            error.type = ErrorType.UNKNOWN;
            error.trace = undefined;
            throw error;
        }else{
            const error : APIError = new APIError();
            error.status = response.status;
            error.message = response.statusText;
            error.type = ErrorType.UNKNOWN;
            error.trace = undefined;
            throw error;
        }
    } catch (axioserror : AxiosError | unknown) {
        console.error("There was an error fetching the courses:", axioserror);
        const error : APIError = new APIError();
        if(axioserror instanceof AxiosError){
            error.status = axioserror.response?.status;
            error.message = axioserror.message;
            error.type = ErrorType.REQUEST_ERROR;
            error.trace = axioserror;
            throw error;
        }else{
            error.message = "Fetching error";
            error.type = ErrorType.REQUEST_ERROR;
            error.trace = axioserror;
            throw error;
        }
    }
}

export async function getCourses() {
    return (await getListRequest('/courses'));
}