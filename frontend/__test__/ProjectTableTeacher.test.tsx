import React from 'react';
import {render, screen, fireEvent, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectTableTeacher from '@app/[locale]/components/ProjectTableTeacher'; // Adjust the import path as necessary
import * as api from '@lib/api';

// Mocking the necessary modules
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key // Returns the key as is, which is fine for testing
    }),
}));

jest.mock('../lib/api', () => ({
    getProjectsForCourse: jest.fn(),
    getUserData: jest.fn(),
    APIError: class APIError extends Error {},
}));

describe('ProjectTableTeacher', () => {
    beforeEach(() => {
        api.getProjectsForCourse.mockClear();
        api.getUserData.mockClear();
    });

    it('renders checkboxes once projects are loaded', async () => {
        // Set up your mock to resolve with data
        api.getProjectsForCourse.mockResolvedValue([{ project_id: 1, name: 'Project 1', deadline: '2022-12-01', visible: true }]);

        render(<ProjectTableTeacher course_id={123} />);

        // Use findByRole to wait for the checkbox to appear
        const checkbox = await screen.findByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
    });

    it('does not show AddProjectButton for a role 3 user', async () => {
        api.getUserData.mockResolvedValue({ role: 3 });
        api.getProjectsForCourse.mockResolvedValue([]);

        render(<ProjectTableTeacher course_id={123} />);

        expect(await screen.findByText('no_projects')).toBeInTheDocument();
        expect(screen.queryByText('Add Project')).toBeNull(); // Assuming "Add Project" is the text in AddProjectButton
    });
});
