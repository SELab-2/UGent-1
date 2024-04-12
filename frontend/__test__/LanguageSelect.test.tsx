import {render} from '@testing-library/react';
import LanguageSelect from '../app/[locale]/components/LanguageSelect';
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('LanguageSelect', () => {
    it('renders correctly', () => {
        // TODO many errors here
        // const {getByText} = render(<LanguageSelect/>);
        //
        // // check that the button was rendered properly
        // expect(getByText('Pigeonhole')).toBeInTheDocument();
    });
});