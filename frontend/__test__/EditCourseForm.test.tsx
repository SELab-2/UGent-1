import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import EditCourseForm from '../app/[locale]/components/EditCourseForm';
import React from "react";
import axios from 'axios';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

jest.mock('axios');

const mockCourse = {
    id: 1,
    name: 'test name',
    description: 'test description',
};

describe('EditCourseForm', () => {
    beforeEach(() => {
        (axios.get as jest.Mock).mockResolvedValue({data: mockCourse});
    });

    it('renders correctly', () => {
        render(<EditCourseForm courseId={mockCourse.id}/>);
    });

    it('check boxes', () => {
       render(<EditCourseForm courseId={mockCourse.id}/>);

        // check if the name label was rendered properly
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

        // check if the description label was rendered properly
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();

        // check if the save button was rendered properly
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('populates form fields with course data', async () => {
        render(<EditCourseForm courseId={mockCourse.id}/>);

        // wait for the course data to be fetched
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // check if the name field was filled correctly
        expect(screen.getByLabelText(/name/i)).toHaveValue(mockCourse.name);

        // check if the description field was filled correctly
        expect(screen.getByLabelText(/description/i)).toHaveValue(mockCourse.description);
    });

    it('submits the form correctly', async () => {
        (axios.put as jest.Mock).mockResolvedValue({});

        render(<EditCourseForm courseId={mockCourse.id}/>);

        // wait for the course data to be fetched
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // fill in the form fields
        fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'new name'}});
        fireEvent.change(screen.getByLabelText(/description/i), {target: {value: 'new description'}});

        // submit the form
        fireEvent.click(screen.getByRole('button'));

        // wait for the form to be submitted
        await waitFor(() => expect(axios.put).toHaveBeenCalled());

        // check if the form was submitted with the correct data
        expect(axios.put).toHaveBeenCalledWith(expect.stringContaining(String(mockCourse.id)), expect.objectContaining({
            name: 'new name',
            description: 'new description'
        }), expect.anything());
    });
});