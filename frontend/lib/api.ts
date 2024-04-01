import axios, {AxiosError} from 'axios';

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

enum ErrorType {
    UNKNOWN = "UNKNOWN",
    REQUEST_ERROR = "REQUEST_ERROR",
}

export class APIError {
    message: string | undefined;
    status: number | undefined = 0;
    type: ErrorType = ErrorType.UNKNOWN;
    trace: unknown;
}

export type Project = {
    project_id: number;
    course_id: number;
    name: string;
    description: string;
    deadline: string;
    visible: boolean;
    number_of_groups: number;
    group_size: number;
    max_score: number;
    file_structure: string;
}

export async function getObjectByIdRequest(path: string, object_id: number) {
    try {
        const response = await axios.get(backend_url + path + "/" + object_id, {withCredentials: true});
        if (response.status === 200) {
            return response.data;
        } else if (response?.data?.detail) {
            console.error("Unexpected response structure:", response.data);
            const error: APIError = new APIError();
            error.status = response.status;
            error.message = response.data.detail;
            error.type = ErrorType.UNKNOWN;
            error.trace = undefined;
            throw error;
        } else {
            const error: APIError = new APIError();
            error.status = response.status;
            error.message = response.statusText;
            error.type = ErrorType.UNKNOWN;
            error.trace = undefined;
            throw error;
        }
    } catch (axioserror: AxiosError | unknown) {
        console.error("There was an error fetching the object:", axioserror);
        const error: APIError = new APIError();
        if (axioserror instanceof AxiosError) {
            error.status = axioserror.response?.status;
            error.message = axioserror.message;
            error.type = ErrorType.REQUEST_ERROR;
            error.trace = axioserror;
            throw error;
        } else {
            error.message = "Fetching error";
            error.type = ErrorType.REQUEST_ERROR;
            error.trace = axioserror;
            throw error;
        }
    }
}

async function getListRequest(path: string) {
    try {
        const response = await axios.get(backend_url + path, {withCredentials: true});
        if (response.status === 200 && Array.isArray(response?.data?.results)) {
            return response.data.results;
        } else if (response?.data?.detail) {
            console.error("Unexpected response structure:", response.data);
            const error: APIError = new APIError();
            error.status = response.status;
            error.message = response.data.detail;
            error.type = ErrorType.UNKNOWN;
            error.trace = undefined;
            throw error;
        } else {
            const error: APIError = new APIError();
            error.status = response.status;
            error.message = response.statusText;
            error.type = ErrorType.UNKNOWN;
            error.trace = undefined;
            throw error;
        }
    } catch (axioserror: AxiosError | unknown) {
        console.error("There was an error fetching the object list:", axioserror);
        const error: APIError = new APIError();
        if (axioserror instanceof AxiosError) {
            error.status = axioserror.response?.status;
            error.message = axioserror.message;
            error.type = ErrorType.REQUEST_ERROR;
            error.trace = axioserror;
            throw error;
        } else {
            error.message = "Fetching error";
            error.type = ErrorType.REQUEST_ERROR;
            error.trace = axioserror;
            throw error;
        }
    }
}

export async function get_project_by_id(project_id: number) {
    return (await getObjectByIdRequest('/projects', project_id))
}