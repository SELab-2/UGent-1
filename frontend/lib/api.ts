
import axios, { AxiosError } from 'axios';
import { ApiError } from 'next/dist/server/api-utils';

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

enum ErrorType{
    UNKNOWN = "UNKNOWN",
    REQUEST_ERROR = "REQUEST_ERROR",
}

enum Role{
    ADMIN = 1,
    TEACHER = 2,
    STUDENT = 3,
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

export type Project = {
    project_id: number;
    course_id: number;
    name: string;
    description: string;
    deadline: string;
    visible: boolean;
    max_score: number;
    number_of_groups: number;
    group_size: number;
}

export type User = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    course: number[];
    role: Role;
}

export type Group = {
    group_id: number;
    project_id: number;
    group_nr: number;
    final_score: number | undefined;
    name: string;
    user: number[];

}

async function getRequest(path: string){
    try {
        const response = await axios.get(backend_url + path, {withCredentials: true});
        if (response.status === 200 && response?.data) {
            return response.data;
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

async function getListRequest(path: string){
    const data = await getRequest(path);
    if(data?.results && Array.isArray(data?.results)){
        return data.results;
    }else if(data?.detail) {
        console.error("Unexpected response structure: no list returned");
        const error : APIError = new APIError();
        error.message = data?.detail;
        error.type = ErrorType.UNKNOWN;
        error.trace = undefined;
        throw error;
    }else{
        const error : APIError = new APIError();
        error.message = "no list returned";
        error.type = ErrorType.UNKNOWN;
        error.trace = undefined;
        throw error;
    }
    
}

export async function getCourse(id: number) : Promise<Course>{
    return (await getRequest(`/courses/${id}`));
}

export async function getCourses() : Promise<Course[]>{
    return (await getListRequest('/courses'));
}

export async function getProject(id: number) : Promise<Project>{
    return (await getRequest(`/projects/${id}`));
}

export async function getProjects() : Promise<Project[]>{
    return (await getListRequest('/projects'));
}

export async function getGroup(id: number) : Promise<Group>{
    return (await getRequest(`/groups/${id}`));
}

export async function getGroups() : Promise<Group[]>{
    return (await getListRequest('/groups'));
}