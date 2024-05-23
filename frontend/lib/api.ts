import axios, {AxiosError} from 'axios';
import dayjs from "dayjs";
import {JSZipObject} from "jszip";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

const getCookieValue = (name: string) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)


enum ErrorType {
    UNKNOWN = "UNKNOWN",
    REQUEST_ERROR = "REQUEST_ERROR",
}

enum Role {
    ADMIN = 1,
    TEACHER = 2,
    STUDENT = 3,
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
    open_course: boolean;
    invite_token: string;
    banner: string;
    archived: boolean;
    year: number;
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

export type Submission = {
    submission_id: number;
    group_id: number;
    submission_nr: number;
    file: string;
    timestamp: string;
    output_simple_test: boolean;
    feedback_simple_test: object;
    eval_result : boolean;
    eval_output: string | null;
}

export type UserData = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    course: number[];
    role: Role;
    picture: string;
}

async function getRequest(path: string) {
    try {
        const response = await axios.get(backend_url + path, {withCredentials: true});
        if (response.status === 200 && response?.data) {
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

async function getBlobRequest(path: string) {
    try {
        const response = await axios.get(path,
            {withCredentials: true, responseType: 'blob'});
        if (response.status === 200 && response?.data) {
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

async function getListRequest(path: string) {
    const data = await getRequest(path);
    if (data?.results && Array.isArray(data?.results)) {
        return data.results;
    } else if (data?.detail) {
        console.error("Unexpected response structure: no list returned");
        const error: APIError = new APIError();
        error.message = data?.detail;
        error.type = ErrorType.UNKNOWN;
        error.trace = undefined;
        throw error;
    } else {
        const error: APIError = new APIError();
        error.message = "no list returned";
        error.type = ErrorType.UNKNOWN;
        error.trace = undefined;
        throw error;
    }

}

export async function getUser(id: number, page = 1, pageSize = 5): Promise<User> {
    return (await getRequest(`/users/${id}`));
}

export async function getUsers(page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<User[]> {
    let url = `/users?page=${page}&page_size=${pageSize}`;

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return await getRequest(url);
}

export async function getUsers_by_course(courseId: number, page = 1, pageSize = 5): Promise<User[]> {
    return (await getRequest(`/courses/${courseId}/get_users?page=${page}&page_size=${pageSize}`));
}

export async function getStudents_by_course(courseId: number, page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<User[]> {
    let url = `/courses/${courseId}/get_students?page=${page}&page_size=${pageSize}`;

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return await getRequest(url);
}

export async function getTeachers_by_course(courseId: number, page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<User[]> {
    let url = `/courses/${courseId}/get_teachers?page=${page}&page_size=${pageSize}`;

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return await getRequest(url);
}

export async function getCourse(id: number): Promise<Course> {
    return (await getRequest(`/courses/${id}`));
}

export async function getCourses(page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<Course[]> {
    let url = `/courses?page=${page}&page_size=${pageSize}`;

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return await getRequest(url);
}

export async function getArchivedCourses(page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<Course[]> {
    let url = `/courses/get_archived_courses?page=${page}&page_size=${pageSize}`;

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return await getRequest(url);
}

export async function getOpenCourses(page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<Course[]> {
    let url = `/courses/get_open_courses?page=${page}&page_size=${pageSize}`;

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return await getRequest(url);
}

export async function archiveCourse(id: number): Promise<number> {
    return (await patchData(`/courses/${id}/`, {
        archived: true
    })).course_id;
}

export async function unArchiveCourse(id: number): Promise<number> {
    return (await patchData(`/courses/${id}/`, {
        archived: false
    })).course_id;
}

export async function getCoursesForUser(): Promise<Course[]> {
    let page = 1;
    let results: Course[] = []
    let response = await getRequest(`/courses/get_selected_courses?page=${page}&page_size=${20}`);
    if (response.results.length === 0) return [];
    results = results.concat(response.results);
    while (response.next !== null) {
        page++;
        response = await getRequest(`/courses/get_selected_courses?page=${page}&page_size=${20}`);
        results = results.concat(response.results);
    }
    return results;
}

export async function updateCourse(id: number, data: any): Promise<Course> {
    return (await putData(`/courses/${id}/`, data));
}

export async function updateUserData(id: number, data: any): Promise<UserData> {
    localStorage.setItem('user', JSON.stringify({data: userData, lastcache: "0"}));
    return (await putData(`/users/${id}/`, data));
}

export async function deleteUser(id: number): Promise<void> {
    return (await deleteData(`/users/${id}`));
}

export async function deleteCourse(id: number): Promise<void> {
    return (await deleteData(`/courses/${id}`));
}

export async function getTestFiles(path: string): Promise<Blob> {
    return (await getBlobRequest(path));
}

export async function getImage(path: string): Promise<Blob> {
    return (await getBlobRequest(path));
}

export async function getProject(id: number): Promise<Project> {
    return (await getRequest(`/projects/${id}`));
}

export async function updateProject(id: number, data: any): Promise<Project> {
    return (await putData(`/projects/${id}/`, data));
}

export async function deleteProject(id: number): Promise<void> {
    return (await deleteData(`/projects/${id}`));
}

export async function getProjects(): Promise<Project[]> {
    return (await getListRequest('/projects'));
}

export async function addProject(data: any): Promise<number> {
    return (await postData(`/projects/`, data)).project_id;
}

export async function getProjectsFromCourse(id: number): Promise<Project[]> {
    return (await getListRequest('/courses/' + id + '/get_projects'))
}

export async function getProjectFromSubmission(id: number): Promise<number> {
    return (await getRequest(`/submissions/${id}/get_project`)).project;
}

export async function getTeachersFromCourse(id: number): Promise<User[]> {
    return (await getListRequest('/courses/' + id + '/get_teachers'))
}

export async function getSubmission(id: number): Promise<Submission> {
    return (await getRequest(`/submissions/${id}`));
}

export async function getLastSubmissionFromProject(id: number): Promise<Submission> {
    return (await getRequest(`/projects/${id}/get_last_submission`))
}

export async function getProjects_by_course(courseId: number, page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<Project[]> {
    let url = `/courses/${courseId}/get_projects?page=${page}&page_size=${pageSize}`;

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return await getRequest(url);
}

export async function getGroup(id: number): Promise<Group> {
    return (await getRequest(`/groups/${id}`));
}

export async function checkGroup(id: number) {
    try {
        await axios.get(backend_url + "/projects/" + id + "/get_group/", {withCredentials: true});
        return true;
    } catch (error) {
        return false;
    }
}

export async function getGroups(): Promise<Group[]> {
    return (await getListRequest('/groups'));
}

export async function getGroups_by_project(projectId: number, page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<Group[]> {
    let url = `/projects/${projectId}/get_groups?page=${page}&page_size=${pageSize}`;

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return await getRequest(url);
}

export async function getProjectSubmissions(id: number, page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<Submission[]> {
    let url = `/projects/${id}/get_submissions?page=${page}&page_size=${pageSize}`

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return (await getRequest(url))
}

export async function getGroupSubmissions(id: number, page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<Submission[]> {
    let url = `/projects/${id}/get_group_submissions?page=${page}&page_size=${pageSize}`

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return (await getRequest(url))
}

export async function getLatestSubmissions(id: number, page = 1, pageSize = 5, keyword?: string, orderBy?: string, sortOrder?: string): Promise<Submission[]> {
    let url = `/projects/${id}/get_last_group_submissions?page=${page}&page_size=${pageSize}`

    if (keyword) {
        url += `&keyword=${keyword}`;
    }

    if (orderBy) {
        url += `&order_by=${orderBy}`;
    }

    if (sortOrder) {
        url += `&sort_order=${sortOrder}`;
    }

    return (await getRequest(url))
}

let userData: UserData | undefined = undefined;

export async function getUserData(): Promise<UserData> {
    if(!userData && !localStorage.getItem('user') && window.location.pathname !== "/"){
        await fetchUserData();
    }

    if (userData) {
        return userData;
    }else if(localStorage.getItem('user')){
        const userobj = JSON.parse(localStorage.getItem('user') as string);
        const lastcache : string | undefined = userobj?.lastcache;

        if(lastcache && Date.now() - parseInt(lastcache) < 2 * 60 * 1000){
            console.log(Date.now() - parseInt(lastcache));
            let user : UserData = userobj.data;
            userData = user;
            return user;
        }else{
            return fetchUserData();
        }
    }else {
        return fetchUserData();
    }
}

export async function fetchUserData() : Promise<UserData> {
    try{
        userData = await getRequest('/users/current');
        localStorage.setItem('user', JSON.stringify({data: userData, lastcache: Date.now().toString()}));
        return userData!;
    }catch(e){
        console.error(e);
        window.location.href = "/";
        return userData!;
    }

}

export async function logOut() {
    userData = undefined;
    localStorage.removeItem('user');
    window.location.href = backend_url + "/auth/logout";
}

export async function isLoggedIn() {
    try {
        await getUserData();
        return true;
    } catch (error) {
        return false;
    }
}

export function postForm(path: string) {
    async function formHandler(event: any) {

        axios.defaults.headers.post['X-CSRFToken'] = getCookieValue('csrftoken');
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());
        try {
            await axios.post(backend_url + path, formDataObject, {withCredentials: true});
        } catch (error) {
            const apierror: APIError = new APIError();
            apierror.message = "error posting form";
            apierror.type = ErrorType.REQUEST_ERROR;
            apierror.trace = error;
            throw apierror;
        }
    }

    return formHandler;
}

export async function postData(path: string, data: any) {
    axios.defaults.headers.post['X-CSRFToken'] = getCookieValue('csrftoken');

    try {
        const response = await axios.post(backend_url + path, data, {withCredentials: true});

        if ((response.status === 200 || response.status === 201)) {
            return response?.data;
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
    } catch (error) {
        const apierror: APIError = new APIError();
        apierror.message = "error on post request";
        apierror.type = ErrorType.REQUEST_ERROR;
        apierror.trace = error;
        throw apierror;
    }
}

export async function putData(path: string, data: any) {
    axios.defaults.headers.put['X-CSRFToken'] = getCookieValue('csrftoken');

    try {
        const response = await axios.put(backend_url + path, data, {withCredentials: true});

        if (response.status === 200 && response?.data) {
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
    } catch (error) {
        const apierror: APIError = new APIError();
        apierror.message = "error on put request";
        apierror.type = ErrorType.REQUEST_ERROR;
        apierror.trace = error;
        throw apierror;
    }
}

export async function patchData(path: string, data: any) {
    axios.defaults.headers.patch['X-CSRFToken'] = getCookieValue('csrftoken');

    try {
        const response = await axios.patch(backend_url + path, data, {withCredentials: true});

        if (response.status === 200 && response?.data) {
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
    } catch (error) {
        const apierror: APIError = new APIError();
        apierror.message = "error on put request";
        apierror.type = ErrorType.REQUEST_ERROR;
        apierror.trace = error;
        throw apierror;
    }
}

export async function deleteData(path: string) {
    axios.defaults.headers.delete['X-CSRFToken'] = getCookieValue('csrftoken');

    try {
        const response = await axios.delete(backend_url + path + '/', {withCredentials: true});

    } catch (error) {
        const apierror: APIError = new APIError();
        apierror.message = "error on delete request";
        apierror.type = ErrorType.REQUEST_ERROR;
        apierror.trace = error;
        throw apierror;
    }
}

export async function joinCourseUsingToken(course_id: number, token: string) {
    return (await postData(`/courses/${course_id}/join_course_with_token/${token}/`, {}));
}

type uploadResult = {
    result: string;
    errorcode: string | undefined;
    submission_id: number;
}

export async function uploadSubmissionFile(event: any, project_id: string) : Promise<uploadResult>{
    axios.defaults.headers.get['X-CSRFToken'] = getCookieValue('csrftoken');
    axios.defaults.headers.post['X-CSRFToken'] = getCookieValue('csrftoken');
    event.preventDefault();

    const formData = new FormData(event.target);
    //filter files by key

    for(let file of event.target.fileList.files){
        let path = file.webkitRelativePath;
        if (path.includes("/")) {
            path = path.substring((path.indexOf("/")??0)+1, path.length);
        }
        formData.append(path, file);
    }

    for(let file of event.target.fileList2.files){
        formData.append(file.name, file);
    }

    formData.delete("fileList");
    const formDataObject = Object.fromEntries(formData.entries());
    console.log(formDataObject)
    try {
        let groupres = await axios.get(backend_url + "/projects/" + project_id + "/get_group/", {withCredentials: true});
        const group_id = groupres.data.group_id;
        formDataObject.group_id = group_id;
        const response = await axios.post(backend_url + '/submissions/', formDataObject,
         { withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          });
        return {result: "ok", errorcode: undefined, submission_id: response.data.submission_id};
    } catch (error) {
        const apierror : APIError = new APIError();
        apierror.message = "error posting form";
        apierror.type = ErrorType.REQUEST_ERROR;
        apierror.trace = error;
        console.error(apierror);
        return {result: "error", errorcode: error.response?.data?.errorcode};
    }
}