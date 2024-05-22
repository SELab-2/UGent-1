import {act, render, screen, waitFor, fireEvent} from '@testing-library/react';
import EditCourseForm from '../app/[locale]/components/EditCourseForm';
import React from "react";
import * as api from "@lib/api";

// Mock useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

// Mock API functions
jest.mock("../lib/api", () => ({
    getCourse: jest.fn(),
    getImage: jest.fn(),
    postData: jest.fn(),
    updateCourse: jest.fn(),
}));

// Mock next/image component
jest.mock('next/image', () => {
    return () => <img/>;
});

const mockCourse = {
    id: 1,
    name: 'Test Course',
    description: 'Test Description',
    open_course: true,
    year: 2022,
    banner: new Blob([], { type: 'image/png' }),
};

describe('EditCourseForm', () => {
    beforeEach(async () => {
        (api.getCourse as jest.Mock).mockResolvedValue(mockCourse);
        (api.getImage as jest.Mock).mockResolvedValue(new Blob([], { type: 'image/png' }));
    });

    it('renders correctly', async () => {
        await act(async () => {
            render(<EditCourseForm courseId={1}/>);
        });
    });

    it('check boxes', async () => {
        await act(async () => {
            render(<EditCourseForm courseId={1}/>);
        });
        expect(screen.getByText("course name")).toBeInTheDocument();

        expect(screen.getByText("description")).toBeInTheDocument();

        expect(screen.getByText('save changes')).toBeInTheDocument();
    });

    it('fills form fields with course data', async () => {
        await act(async () => {
            render(<EditCourseForm courseId={mockCourse.id}/>);
        });

        await waitFor(() => expect(api.getCourse).toHaveBeenCalled());

        expect(screen.getByDisplayValue(mockCourse.name)).toBeInTheDocument();

        expect(screen.getByDisplayValue(mockCourse.description)).toBeInTheDocument();

        expect(screen.getByDisplayValue(mockCourse.open_course.toString())).toBeInTheDocument();
    });


    it('submits the form correctly', async () => {
        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

        await act(async () => {render(<EditCourseForm courseId={mockCourse.id}/>);});

        await waitFor(() => expect(api.getCourse).toHaveBeenCalled());

        fireEvent.change(screen.getByDisplayValue(mockCourse.name), { target: { value: 'new name' } });
        fireEvent.change(screen.getByDisplayValue(mockCourse.description), { target: { value: 'new description' } });
        fireEvent.change(screen.getByDisplayValue(mockCourse.open_course.toString()), { target: { value: 'true' } });

        const formData = new FormData();
        global.FormData = jest.fn(() => formData) as any;

        const mockFileReader = {
            readAsArrayBuffer: jest.fn(),
            result: new ArrayBuffer(10),
            onload: jest.fn(),
        };
        global.FileReader = jest.fn(() => mockFileReader) as any;

        (api.updateCourse as jest.Mock).mockResolvedValueOnce({ course_id: mockCourse.id });
        (api.postData as jest.Mock).mockResolvedValueOnce({ course_id: mockCourse.id });

        fireEvent.submit(screen.getByText("save changes"));

        await waitFor(() => expect(api.updateCourse).toHaveBeenCalledWith(mockCourse.id, formData));
    });
});
