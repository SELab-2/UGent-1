import {render, screen} from '@testing-library/react';
import CreateCourseForm from '../app/[locale]/components/CreateCourseForm';
import React from "react";
import testImage from '../public/ugent_banner.png';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key) => key})
}));

jest.mock('../lib/api');

describe('CreateCourseForm', () => {
    it('renders correctly', () => {
        // render(<CreateCourseForm/>);
    });

});
