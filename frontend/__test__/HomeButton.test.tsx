import {render} from '@testing-library/react';
import HomeButton from '../app/[locale]/components/HomeButton';
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('HomeButton', () => {
    it('renders correctly', () => {
        const {getByText} = render(<HomeButton/>);

        // check that the button was rendered properly
        expect(getByText('Pigeonhole')).toBeInTheDocument();
    });
});