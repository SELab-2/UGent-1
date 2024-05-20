import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import ListView from '@app/[locale]/components/ListView';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})}
));

describe ('ListView', () => {
    it('renders correctly', () => {
        // render(<ListView/>);
    });
});