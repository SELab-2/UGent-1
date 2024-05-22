import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import YearStateComponent from '@app/[locale]/components/YearStateComponent';
import {getLastSubmissionFromProject} from "@lib/api";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));


jest.mock('../app/[locale]/components/CourseControls', () => {
    return jest.fn().mockImplementation(() => <div data-testid="mocked-course-controls">Mocked CourseControls</div>);
});

jest.mock('../app/[locale]/components/CoursesGrid', () => {
    return jest.fn().mockImplementation(() => <div data-testid="mocked-courses-grid">Mocked CoursesGrid</div>);
});

// Mock API functions
jest.mock("../lib/api", () => ({
    getCourse: jest.fn(),
    getUserData: jest.fn(),
    getCoursesForUser: jest.fn()
}));

describe('YearStateComponent', () => {
    it('renders correctly', () => {
        act(()=>
        render(<YearStateComponent/>)
        );
    });
});