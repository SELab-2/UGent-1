import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import EditCourseForm from '../app/[locale]/components/EditCourseForm';
import React from "react";
import axios from 'axios';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

jest.mock('axios');

global.fetch = jest.fn(() =>
    Promise.resolve({
        blob: () => Promise.resolve(new Blob()),
        json: () => Promise.resolve({data: 'mocked data'}),
    })
);

jest.mock('next/image', () => {
    return () => <img/>;
});

const mockCourse = {
    id: 1,
    name: 'test name',
    description: 'test description',
    open_course: false,
};

describe('EditCourseForm', () => {
    beforeEach(() => {
        (axios.get as jest.Mock).mockResolvedValue({data: mockCourse});
        (axios.post as jest.Mock).mockResolvedValue({}).mockImplementation(() => Promise.resolve({data: {course_id: mockCourse.id}}));
        (axios.put as jest.Mock).mockResolvedValue({}).mockImplementation(() => Promise.resolve());
        fetch.mockClear();
    });

    it('renders correctly', () => {
        render(<EditCourseForm courseId={mockCourse.id}/>);
    });

    it('check boxes', () => {
        render(<EditCourseForm courseId={mockCourse.id}/>);

        // check if the name input was rendered properly
        expect(screen.getByPlaceholderText(/course name/i)).toBeInTheDocument();

        // check if the description input was rendered properly
        expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();

        // check if the save button was rendered properly
        expect(screen.getByRole('button', {name: /save changes/i})).toBeInTheDocument();

        // check if the cancel button was rendered properly
        expect(screen.getByRole('button', {name: /cancel/i})).toBeInTheDocument();
    });

    it('fills form fields with course data', async () => {
        render(<EditCourseForm courseId={mockCourse.id}/>);

        // wait for the course data to be fetched
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // check if the name field was filled correctly
        expect(screen.getByText("course name")).toHaveValue(mockCourse.name);

        // check if the description field was filled correctly
        expect(screen.getByPlaceholderText(/description/i)).toHaveValue(mockCourse.description);

        // check if the access select field was filled correctly
        expect(screen.getByTestId('access')).toHaveValue(mockCourse.open_course.toString());
    });

    it('submits the form correctly', async () => {
        const file = new File(['...'], 'test.png', {type: 'image/png'});

        render(<EditCourseForm courseId={mockCourse.id}/>);

        // wait for the course data to be fetched
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // fill in the form fields
        fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'new name'}});
        fireEvent.change(screen.getByLabelText(/description/i), {target: {value: 'new description'}});
        fireEvent.change(screen.getByLabelText(/access/i), {target: {value: 'true'}});
        fireEvent.change(screen.getByLabelText(/select image/i), {target: {files: [file]}});

        // submit the form
        fireEvent.click(screen.getByRole('button', {name: /save changes/i}));

        // wait for the form to be submitted
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        await waitFor(() => expect(axios.put).toHaveBeenCalled());

        // check if the form was submitted with the correct data
        expect(axios.put).toHaveBeenCalledWith(expect.stringContaining(String(mockCourse.id)), expect.anything(), expect.anything());
    });
});