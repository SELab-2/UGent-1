import axios, { AxiosError } from 'axios';

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

const getCookieValue = (name : string) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)



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
    file_structure: string;
    test_files: string;
    conditions: string;
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

export type UserData = {
    id: number;
    emai: string;
    first_name: string;
    last_name: string;
    course: number[];
    role: Role;
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

async function getBlobRequest(path: string){
    try {
        const response = await axios.get(path,
            {withCredentials: true, responseType: 'blob'});
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

export async function updateCourse(id: number, data: any): Promise<Course> {
    return (await putData(`/courses/${id}/`, data));
}

export async function deleteCourse(id: number): Promise<void> {
    return (await deleteData(`/courses/${id}/`));
}

export async function getTestFiles(path: string): Promise<Blob> {
    return (await getBlobRequest(path));
}

export async function getProject(id: number) : Promise<Project>{
    return (await getRequest(`/projects/${id}`));
}

export async function updateProject(id: number, data: any): Promise<Project> {
    return (await putData(`/projects/${id}/`, data));
}

export async function deleteProject(id: number): Promise<void> {
    return (await deleteData(`/projects/${id}/`));
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

let userData : UserData | undefined = undefined;

export async function getUserData() : Promise<UserData>{
    if(userData){
        return userData;
    }else if(localStorage.getItem('user')){
        let user : UserData = JSON.parse(localStorage.getItem('user') as string);
        userData = user;
        return user;
    }else{
        let user : UserData = await getRequest('/users/current');
        localStorage.setItem('user', JSON.stringify(user));
        console.log(user);
        return user;
    }
}

export async function logOut(){
    userData = undefined;
    localStorage.removeItem('user');
    window.location.href = backend_url + "/auth/logout";
}

export async function isLoggedIn(){
    try{
        await getUserData();
        return true;
    }catch(error){
        return false;
    }
}

export function postForm(path : string){
    async function formHandler(event : any){
        
        axios.defaults.headers.post['X-CSRFToken'] = getCookieValue('csrftoken');
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());
        console.log(formDataObject)
        try {
            await axios.post(backend_url + path, formDataObject, { withCredentials: true });
        } catch (error) {
            const apierror : APIError = new APIError();
            apierror.message = "error posting form";
            apierror.type = ErrorType.REQUEST_ERROR;
            apierror.trace = error;
            throw apierror;
        }
    }
    return formHandler;
}

export async function postData(path: string, data: any){
    axios.defaults.headers.post['X-CSRFToken'] = getCookieValue('csrftoken');

    try {
        const response = await axios.post(backend_url + path, data, { withCredentials: true });

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
    } catch (error) {
        const apierror : APIError = new APIError();
        apierror.message = "error on post request";
        apierror.type = ErrorType.REQUEST_ERROR;
        apierror.trace = error;
        throw apierror;
    }
}

export async function putData(path: string, data: any){
    axios.defaults.headers.post['X-CSRFToken'] = getCookieValue('csrftoken');

    try {
        const response = await axios.put(backend_url + path, data, { withCredentials: true });

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
    } catch (error) {
        const apierror : APIError = new APIError();
        apierror.message = "error on put request";
        apierror.type = ErrorType.REQUEST_ERROR;
        apierror.trace = error;
        throw apierror;
    }
}

export async function deleteData(path: string){
    axios.defaults.headers.post['X-CSRFToken'] = getCookieValue('csrftoken');

    try {
        const response = await axios.delete(backend_url + path, { withCredentials: true });

    } catch (error) {
        const apierror : APIError = new APIError();
        apierror.message = "error on delete request";
        apierror.type = ErrorType.REQUEST_ERROR;
        apierror.trace = error;
        throw apierror;
    }
}