import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import ListView from '../app/[locale]/components/ListView';
import {
    deleteData,
    getArchivedCourses,
    getCourses,
    getGroups_by_project,
    getGroupSubmissions,
    getProject,
    getProjects_by_course,
    getProjectSubmissions,
    getStudents_by_course,
    getTeachers_by_course,
    getUser,
    getUserData,
    getUsers,
    postData,
    getOpenCourses
} from '@lib/api';
import NotesIcon from "@mui/icons-material/Notes";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

jest.mock('../lib/api', () => ({
    deleteData: jest.fn(),
    getArchivedCourses: jest.fn(),
    getCourses: jest.fn(),
    getGroups_by_project: jest.fn(),
    getGroupSubmissions: jest.fn(),
    getProject: jest.fn(),
    getProjects_by_course: jest.fn(),
    getProjectSubmissions: jest.fn(),
    getStudents_by_course: jest.fn(),
    getTeachers_by_course: jest.fn(),
    getUser: jest.fn(),
    getUserData: jest.fn(),
    getUsers: jest.fn(),
    postData: jest.fn(),
    getOpenCourses: jest.fn()
}));


const mockUser = {
    id: 1,
    email: "test@gmail.com",
    first_name: "First",
    last_name: "Last",
    course: [1],
    role: 1,
    picture: "http://localhost:8000/media/profile_pictures/test.png"
};

const mockCourses = [
    {
        course_id: 1,
        name: "Course 1",
        description: "Description for Course 1",
        year: 2023,
        open_course: true,
        banner: null,
    },
    {
        course_id: 2,
        name: "Course 2",
        description: "Description for Course 2",
        year: 2024,
        open_course: false,
        banner: null,
    },
];

const mockProjects = [
    {
        project_id: 1,
        course_id: 1,
        name: "Project 1",
        description: "Description for Project 1",
        deadline: "2023-12-31T23:59:59",
        visible: true,
        max_score: 20,
        number_of_groups: 5,
        group_size: 1,
        file_structure: "file structure",
        conditions: "conditions",
        test_files: null,
    },
    {
        project_id: 2,
        course_id: 1,
        name: "Project 2",
        description: "Description for Project 2",
        deadline: "2024-01-31T23:59:59",
        visible: true,
        max_score: 20,
        number_of_groups: 3,
        group_size: 2,
        file_structure: "file structure",
        conditions: "conditions",
        test_files: null,
    },
];

const mockLastSubmission = {
    submission_id: 1,
    group_id: 1,
    submission_nr: 1,
    file: 'file.pdf',
    timestamp: '2024-05-20',
    output_test: 'output',
};

const headers = ['name',
    <React.Fragment key="description"><NotesIcon
        style={{fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px'}}/>{" " + 'description'}
    </React.Fragment>,
    , 'open',
    <React.Fragment key="joinleave"><MeetingRoomIcon
        style={{fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px'}}/>{" " + 'join_leave'}
    </React.Fragment>];
const headers_backend = ['name', 'description', 'open', 'join/leave']


describe('ListView', () => {
    beforeEach(() => {
        jest.resetAllMocks();

        deleteData.mockResolvedValue({});
        getArchivedCourses.mockResolvedValue(mockCourses);
        getCourses.mockResolvedValue(mockCourses);
        getGroups_by_project.mockResolvedValue([]);
        getGroupSubmissions.mockResolvedValue([]);
        getProject.mockResolvedValue({});
        getProjects_by_course.mockResolvedValue(mockProjects);
        getProjectSubmissions.mockResolvedValue([]);
        getStudents_by_course.mockResolvedValue([]);
        getTeachers_by_course.mockResolvedValue([]);
        getUser.mockResolvedValue(mockUser);
        getUserData.mockResolvedValue({});
        getUsers.mockResolvedValue([]);
        postData.mockResolvedValue({});
        getOpenCourses.mockResolvedValue(mockCourses);
    });


    it('renders without crashing', async () => {
        act(() => {
        render(<ListView
            admin={true}
            headers={headers}
            headers_backend={headers_backend}
            sortable={[true, true, true, true]}
            get={'courses'}
            search_text={"search_course"}
            page_size={5}
            search={true}
        />);});

    });
});
