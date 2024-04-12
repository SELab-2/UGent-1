import {render} from '@testing-library/react';
import AccountMenu from '../app/[locale]/components/AccountMenu';
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('AccountMenu', () => {
    it('renders correctly', () => {
        render(<AccountMenu/>);

    //     Todo add more checks to see if everything rendered correctly with it
    });

});
