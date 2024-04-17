import {render, screen} from '@testing-library/react';
import CreateCourseForm from '../app/[locale]/components/CreateCourseForm';
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(new Blob()),
    json: () => Promise.resolve({ data: 'mocked data' }),
  })
);

jest.mock('next/image', () => {
  return () => <img />;
});

describe('CreateCourseForm', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('renders correctly', () => {
        render(<CreateCourseForm/>);
    });

    it('check boxes', () => {
       render(<CreateCourseForm/>);

        // check if the name label was rendered properly
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

        // check if the description label was rendered properly
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();

        // check if the image upload field was rendered properly
        expect(screen.getByLabelText(/select image/i)).toBeInTheDocument();

        // check if the course access select field was rendered properly
        expect(screen.getByLabelText(/access/i)).toBeInTheDocument();

        // check if the save button was rendered properly
        expect(screen.getByRole('button', {name: /save course/i})).toBeInTheDocument();

        // check if the cancel button was rendered properly
        expect(screen.getByRole('button', {name: /cancel/i})).toBeInTheDocument();

    });
});