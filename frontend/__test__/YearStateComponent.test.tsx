import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import YearStateComponent from '@app/[locale]/components/YearStateComponent';
import {getLastSubmissionFromProject} from "@lib/api";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

// Mock API functions
jest.mock("../lib/api", () => ({
    getCourse: jest.fn(),
    getUserData: jest.fn(),
    getCoursesForUser: jest.fn()
}));

describe('YearStateComponent', () => {
    it('renders correctly', () => {
        render(<YearStateComponent/>);
    });
});