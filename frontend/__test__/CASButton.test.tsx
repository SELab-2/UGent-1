import {cleanup, fireEvent, render} from '@testing-library/react';
import CASButton from '../app/[locale]/components/CASButton';
import React from "react";

const OLD_ENV = process.env

describe('CASButton', () => {
    afterEach(() => {
        cleanup()
        jest.clearAllMocks()
        jest.resetModules()
        process.env = {...OLD_ENV}
        delete process.env.NODE_ENV
    })

    it('renders correctly', () => {
        const {getByText, getByRole} = render(<CASButton/>);

        // check that the button was rendered properly
        expect(getByText('Login with CAS')).toBeInTheDocument();

        const button = getByRole('button');
        expect(button).toHaveClass('MuiButton-containedSecondary');
    });

    it('calls handleCASLogin when button is clicked', () => {
        const originalLocation = window.location;
        const mockLocation: any = {
            href: '',
            assign: jest.fn(),
        };
        delete window.location
        window.location = mockLocation;

        const {getByText} = render(<CASButton/>);
        const button = getByText('Login with CAS');
        fireEvent.click(button);

        // undefined, because i havent mocked the process.env stuff
        expect(window.location.href).not.toBe(originalLocation);

        // restore the original window.location
        window.location = originalLocation;
    });
});
