import axios, {AxiosError} from 'axios';
import {ApiError} from 'next/dist/server/api-utils';

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

export type Course = {
    course_id: number;
    name: string;
    description: string;
}

export type User = {
    id: number;
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    role: number,
    course: Course[],
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
        console.error("There was an error fetching the courses:", axioserror);
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

async function add_course_to_user_request(user_id: number, course_id: number) {
    try {
        const response = await axios.post(
            `${backend_url}/users/${user_id}/add_course_to_user`, 
            { course_id: course_id }, 
            { withCredentials: true }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            const error: APIError = new APIError();
            error.status = response.status;
            error.message = response.statusText;
            error.type = ErrorType.UNKNOWN;
            error.trace = undefined;
            throw error;
        }
    } catch (axioserror: AxiosError | unknown) {
        console.error("There was an error fetching the courses:", axioserror);
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

async function remove_course_from_user_request(user_id: number, course_id: number) {
    try {
        const response = await axios.delete(
            `${backend_url}/users/${user_id}/remove_course_from_user/${course_id}`, 
            { withCredentials: true }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            const error: APIError = new APIError();
            error.status = response.status;
            error.message = response.statusText;
            error.type = ErrorType.UNKNOWN;
            error.trace = undefined;
            throw error;
        }
    } catch (axioserror: AxiosError | unknown) {
        console.error("There was an error fetching the courses:", axioserror);
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

export async function getCourses() {
    return (await getListRequest('/courses'));
}

export async function getUsers() {
    return (await getListRequest('/users'));
}

export async function add_course_to_user(user_id: number, course_id: number) {
    return (await add_course_to_user_request(user_id, course_id));
}

export async function remove_course_from_user(user_id: number, course_id: number) {
    return (await remove_course_from_user_request(user_id, course_id));
}