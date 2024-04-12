import {render, screen} from '@testing-library/react';
import CreateCourseForm from '../app/[locale]/components/CreateCourseForm';
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('CreateCourseForm', () => {
    it('renders correctly', () => {
        render(<CreateCourseForm/>);

        // check if the name label was rendered properly
        expect(screen.getByText('name')).toBeInTheDocument();

        // check if the description label was rendered properly
        expect(screen.getByText('description')).toBeInTheDocument();

        // check if the save button was rendered properly
        expect(screen.getByText('save')).toBeInTheDocument();
    });

});
