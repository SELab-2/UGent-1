import {render} from '@testing-library/react';
import CourseBanner from '../app/[locale]/components/CourseBanner';
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('CourseBanner', () => {
    it('renders correctly', () => {
        const {getByText} = render(<CourseBanner/>);

        // check that the button was rendered properly
        expect(getByText('Sample Course')).toBeInTheDocument();
    });

});
