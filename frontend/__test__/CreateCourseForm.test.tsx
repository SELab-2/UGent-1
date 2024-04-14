import {render, screen} from '@testing-library/react';
import CreateCourseForm from '../app/[locale]/components/CreateCourseForm';
import React from "react";
import EditCourseForm from "@app/[locale]/components/EditCourseForm";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('CreateCourseForm', () => {

    it('renders correctly', () => {
        render(<CreateCourseForm/>);
    });

    it('check boxes', () => {
       render(<CreateCourseForm/>);

        // check if the name label was rendered properly
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

        // check if the description label was rendered properly
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();

        // check if the save button was rendered properly
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});
