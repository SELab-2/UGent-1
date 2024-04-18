import {render} from '@testing-library/react';
import EditCourseButton from '../app/[locale]/components/EditCourseButton';
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('EditCourseButton', () => {
    it('renders correctly', () => {
        const {getByText} = render(<EditCourseButton course_id={1}/>);

        // check that the button was rendered properly
        expect(getByText('edit_course')).toBeInTheDocument();
    });
});