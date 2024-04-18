import {render} from '@testing-library/react';
import NavBar from '../app/[locale]/components/NavBar';
import React from "react";
import {useRouter} from 'next/router';

jest.mock('../lib/api', () => ({
    getCourses: jest.fn(),
    getUserData: jest.fn(),
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: any) => key,
        i18n: {language: 'en'}, // Mock i18n object
    }),
}));

describe('NavBar component', () => {
    it('render', async () => {

        // render(<NavBar/>);
    });
});