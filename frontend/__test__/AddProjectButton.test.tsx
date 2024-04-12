import {render} from '@testing-library/react';
import AddProjectButton from '../app/[locale]/components/AddProjectButton';
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('AddProjectButton', () => {
    it('renders correctly', () => {
        const {getByText} = render(<AddProjectButton/>);

        // check that the button was rendered properly
        expect(getByText('add_project')).toBeInTheDocument();
    });

});
