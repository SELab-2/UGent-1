import {render, screen} from '@testing-library/react';
import EditCourseForm from '../app/[locale]/components/EditCourseForm';
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

const mockCourse = {
    id: 1,
    name: 'test name',
    description: 'test description',
};


describe('EditCourseForm', () => {
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
});