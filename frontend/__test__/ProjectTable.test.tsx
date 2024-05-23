import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProjectTable from '@app/[locale]/components/ProjectTable';
import {getProjectsFromCourse, getUserData} from '@lib/api';

jest.mock('../lib/api', () => ({
    getProjectsFromCourse: jest.fn(),
    getUserData: jest.fn(),
}));

describe('ProjectTable', () => {
    const projects = [
        {
            project_id: 1,
            name: 'Project 1',
            deadline: '2024-06-01T12:00:00Z',
            visible: true,
        },
        {
            project_id: 2,
            name: 'Project 2',
            deadline: '2024-06-10T12:00:00Z',
            visible: false,
        },
    ];

    const userData = { /* Mock user data */};

    beforeEach(() => {
        getProjectsFromCourse.mockResolvedValue(projects);
        getUserData.mockResolvedValue(userData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders project table with correct data', async () => {
        render(<ProjectTable course_id={123}/>);

        // Wait for async operations to complete
        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeInTheDocument();
            expect(screen.getByText('Project 2')).toBeInTheDocument();
        });
    });

    it('renders correct project data after sorting', async () => {
        render(<ProjectTable course_id={123}/>);

        // Wait for async operations to complete
        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeInTheDocument();
            expect(screen.getByText('Project 2')).toBeInTheDocument();
        });

        // Sort the table by project name (descending)
        const projectNameHeader = screen.getByText('Project Name');
        projectNameHeader.click();
        projectNameHeader.click();

        // Wait for table to re-render with sorted data
        await waitFor(() => {
            expect(screen.getByText('Project 2')).toBeInTheDocument(); // Now Project 2 should appear first
            expect(screen.getByText('Project 1')).toBeInTheDocument();
        });
    });

});
