import {act, render, screen} from '@testing-library/react';
import EditCourseForm from '../app/[locale]/components/EditCourseForm';
import React from "react";
import * as api from "@lib/api";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

jest.mock('../lib/api', () => ({
    getCourses: jest.fn(),
    getUserData: jest.fn(),
    getCourse: jest.fn(),
    getImage: jest.fn(),
}));


global.fetch = jest.fn(() =>
    Promise.resolve({
        blob: () => Promise.resolve(new Blob()),
        json: () => Promise.resolve({data: 'mocked data'}),
    })
);

jest.mock('next/image', () => {
    return () => <img/>;
});

describe('EditCourseForm', () => {
    beforeEach(() => {
        fetch.mockClear();
        (api.getCourse as jest.Mock).mockResolvedValueOnce({
            name: 'Test Course',
            course_id: 1,
            description: "Test Description",
            banner: "?",
            open_course: true,
            invite_token: "token"
        });

    });

    it('renders correctly', async () => {
        await act(async () => {
            render(<EditCourseForm courseId={1}/>);
        });
    });

    it('check boxes', async () => {
        await act(async () => {
            render(<EditCourseForm courseId={1}/>);
        })
        // check if the name input was rendered properly
        expect(screen.getByText("course name")).toBeInTheDocument();

        // check if the description input was rendered properly
        expect(screen.getByText("description")).toBeInTheDocument();

        // check if the save button was rendered properly
        expect(screen.getByRole('button', {name: /save changes/i})).toBeInTheDocument();
    });

    // it('fills form fields with course data', async () => {
    //     render(<EditCourseForm courseId={mockCourse.id}/>);
    //
    //     // wait for the course data to be fetched
    //     await waitFor(() => expect(axios.get).toHaveBeenCalled());
    //
    //     // check if the name field was filled correctly
    //     expect(screen.getByLabelText("course name")).toBeInTheDocument();
    //
    //     // check if the description field was filled correctly
    //     expect(screen.getByLabelText("description")).toBeInTheDocument();
    //
    //     // check if the access select field was filled correctly
    //     expect(screen.getByLabelText('access')).toBeInTheDocument();
    // });
    //
    // it('submits the form correctly', async () => {
    //     const file = new File(['...'], 'test.png', {type: 'image/png'});
    //
    //     render(<EditCourseForm courseId={mockCourse.id}/>);
    //
    //     // wait for the course data to be fetched
    //     await waitFor(() => expect(axios.get).toHaveBeenCalled());
    //
    //     // fill in the form fields
    //     fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'new name'}});
    //     fireEvent.change(screen.getByLabelText(/description/i), {target: {value: 'new description'}});
    //     fireEvent.change(screen.getByLabelText(/access/i), {target: {value: 'true'}});
    //     fireEvent.change(screen.getByLabelText(/select image/i), {target: {files: [file]}});
    //
    //     // submit the form
    //     fireEvent.click(screen.getByRole('button', {name: /save changes/i}));
    //
    //     // wait for the form to be submitted
    //     await waitFor(() => expect(axios.post).toHaveBeenCalled());
    //     await waitFor(() => expect(axios.put).toHaveBeenCalled());
    //
    //     // check if the form was submitted with the correct data
    //     expect(axios.put).toHaveBeenCalledWith(expect.stringContaining(String(mockCourse.id)), expect.anything(), expect.anything());
    // });
});