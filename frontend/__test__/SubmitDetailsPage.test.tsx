import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SubmitDetailsPage from '@app/[locale]/components/SubmitDetailsPage'; // Adjust the import path as needed
import {getProject, fetchUserData, uploadSubmissionFile} from '@lib/api';
import {ThemeProvider} from '@mui/material';
import baseTheme from '@styles/theme';

// Mock the dependencies
jest.mock('../lib/api', () => ({
    getProject: jest.fn(),
    fetchUserData: jest.fn(),
    uploadSubmissionFile: jest.fn(),
}));

jest.mock('../app/[locale]/components/ProjectReturnButton', () => () => <div>ProjectReturnButton</div>);
jest.mock('../app/[locale]/components/Tree', () => () => <div>TreeComponent</div>);

describe('SubmitDetailsPage', () => {
    const projectMock = {
        project_id: 1,
        name: 'Project 1',
        description: 'This is a description for project 1',
        course_id: 1,
    };

    const userMock = {
        course: [1],
    };

    beforeEach(() => {
        getProject.mockResolvedValue(projectMock);
        fetchUserData.mockResolvedValue(userMock);
        uploadSubmissionFile.mockResolvedValue({result: 'ok', submission_id: 1});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component correctly', async () => {
        render(
            <ThemeProvider theme={baseTheme}>
                <SubmitDetailsPage locale="en" project_id={1}/>
            </ThemeProvider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeInTheDocument();
            expect(screen.getByText('This is a description for project 1')).toBeInTheDocument();
            expect(screen.getByText('ProjectReturnButton')).toBeInTheDocument();
        });
    });

    it('handles file and folder uploads', async () => {
        render(
            <ThemeProvider theme={baseTheme}>
                <SubmitDetailsPage locale="en" project_id={1}/>
            </ThemeProvider>
        );

        await waitFor(() => screen.getByText('Project 1'));

        const fileInput = screen.getByText('upload_folders');
        const files = [new File(['content'], 'file1.txt')];

        fireEvent.change(fileInput, {
            target: {files},
        });
    });

    it('submits the form successfully', async () => {
        render(
            <ThemeProvider theme={baseTheme}>
                <SubmitDetailsPage locale="en" project_id={1}/>
            </ThemeProvider>
        );

        await waitFor(() => screen.getByText('Project 1'));

        const fileInput = screen.getByText('upload_folders');
        const files = [new File(['content'], 'file1.txt')];

        fireEvent.change(fileInput, {
            target: {files},
        });

        const submitButton = screen.getByText('submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(uploadSubmissionFile).toHaveBeenCalled();
        });
    });

    it('displays an error message on submission failure', async () => {
        uploadSubmissionFile.mockResolvedValue({result: 'error', errorcode: 'submission_failed'});

        render(
            <ThemeProvider theme={baseTheme}>
                <SubmitDetailsPage locale="en" project_id={1}/>
            </ThemeProvider>
        );

        await waitFor(() => screen.getByText('Project 1'));

        const fileInput = screen.getByText('upload_folders');
        const files = [new File(['content'], 'file1.txt')];

        fireEvent.change(fileInput, {
            target: {files},
        });

        const submitButton = screen.getByText('submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(uploadSubmissionFile).toHaveBeenCalled();
        });
    });


    it('renders project details and handles file input changes', async () => {
        render(<SubmitDetailsPage locale="en" project_id={1}/>);

        await waitFor(() => screen.getByText('Project 1'));

        // Simulate folder input change
        const folderInput = screen.getByText('upload_folders');
        const folderFiles = [new File(['content'], 'folder/file1.txt', {type: 'text/plain'})];

        Object.defineProperty(folderInput, 'files', {
            value: folderFiles,
        });

        fireEvent.change(folderInput);

        // Simulate file input change
        const fileInput = screen.getByText(/files/i);
        const files = [new File(['content'], 'file2.txt', {type: 'text/plain'})];

        Object.defineProperty(fileInput, 'files', {
            value: files,
        });

        fireEvent.change(fileInput);
    });
});
