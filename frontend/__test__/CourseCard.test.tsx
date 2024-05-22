import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import CourseCard from '../app/[locale]/components/CourseCard';
import '@testing-library/jest-dom';

// Mocking the API calls
jest.mock('../lib/api', () => ({
    getProjectsFromCourse: jest.fn(),
    getLastSubmissionFromProject: jest.fn(),
}));

describe('CourseCard', () => {
    const mockCourse = {
        course_id: 1,
        name: 'Test Course',
        description: "test description",
        open_course: true,
        invite_token: "token",
        year: 2024,
        archived: false,
        banner: "banner"
    };


    const mockProjects = [
        {
            project_id: 1,
            course_id: mockCourse,
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
            course_id: mockCourse,
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

    beforeEach(() => {
        jest.resetAllMocks();
        require('../lib/api').getProjectsFromCourse.mockResolvedValue(mockProjects);
        require('../lib/api').getLastSubmissionFromProject.mockResolvedValue(mockLastSubmission);
    });

    it('renders correctly', async () => {
        render(<CourseCard params={{course: mockCourse}}/>);

        // Check if course name is rendered
        expect(screen.getByText('Test Course')).toBeInTheDocument();

        // Check if 'projects' title is rendered
        expect(screen.getByText('projects')).toBeInTheDocument();
    });

    it('displays no projects message when there are no projects', async () => {
        require('../lib/api').getProjectsFromCourse.mockResolvedValue([]);

        render(<CourseCard params={{course: mockCourse}}/>);

        await waitFor(() => {
            // Check if no projects message is displayed
            expect(screen.getByText('no_projects')).toBeInTheDocument();
        });
    });



    it('mouse enter and leave', () => {
        render(<CourseCard params={{course: mockCourse}}/>);

        const cardMedia = screen.getByText('Test Course').closest('.MuiCardMedia-root');

        // Hover over the card media
        fireEvent.mouseEnter(cardMedia);

        // Unhover the card media
        fireEvent.mouseLeave(cardMedia);
    });

    it('redirects to the correct URL on card media click', () => {
        render(<CourseCard params={{course: mockCourse}}/>);

        const box = screen.getByText('Test Course');

        // Mock window.location.href
        delete window.location;
        window.location = {href: ''};

        // Click on the Box inside the CardMedia
        fireEvent.click(box);

        // Check if window.location.href is updated correctly
        expect(window.location.href).toBe(`/course/${mockCourse.course_id}`);
    });


});
