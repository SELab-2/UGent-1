import {act, render, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseBanner from '../app/[locale]/components/CourseBanner';
import * as api from "@lib/api";
import React from "react";

jest.mock('../lib/api');

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('CourseBanner', () => {

    it('renders course name correctly', async () => {
        (api.getCourse as jest.Mock).mockResolvedValueOnce({
            name: 'Test Course',
            course_id: 1,
            description: "Test Description",
            banner: "?",
            open_course: true,
            invite_token: "token"
        });
        (api.getUserData as jest.Mock).mockResolvedValueOnce({
            role: 1,
            course: [1],
            email: "test",
            first_name: "First",
            last_name: "Last",
            id: 1
        });

        const {getByText} = render(<CourseBanner course_id={1}/>);

        await waitFor(() => {
            expect(getByText('Test Course')).toBeInTheDocument();
        });
    });

    it('renders EditCourseButton for non-student users', async () => {
        (api.getCourse as jest.Mock).mockResolvedValueOnce({
            name: 'Test Course',
            course_id: 1,
            description: "Test Description",
            banner: "?",
            open_course: true,
            invite_token: "token"
        });
        (api.getUserData as jest.Mock).mockResolvedValueOnce({
            role: 1,
            course: [1],
            email: "test",
            first_name: "First",
            last_name: "Last",
            id: 1
        });

        const {getByText} = render(<CourseBanner course_id={1}/>);

        await waitFor(() => {
            expect(getByText('edit_course')).toBeInTheDocument();
        });
    });

    it('does not render EditCourseButton for student users', async () => {
        (api.getCourse as jest.Mock).mockResolvedValueOnce({
            name: 'Test Course',
            course_id: 1,
            description: "Test Description",
            banner: "?",
            open_course: true,
            invite_token: "token"
        });

        // Generate student user here.
        (api.getUserData as jest.Mock).mockResolvedValueOnce({
            role: 3,
            course: [1],
            email: "test",
            first_name: "First",
            last_name: "Last",
            id: 1
        });
        const {queryByText} = render(<CourseBanner course_id={1}/>);
        await waitFor(() => {
            expect(queryByText('edit_course')).not.toBeInTheDocument();
        });
    });

    it('handles APIError', async () => {
        const error = new api.APIError();
        error.message = "Test error message";
        (api.getCourse as jest.Mock).mockRejectedValueOnce(error);

        render(<CourseBanner course_id={1}/>);
    });
});