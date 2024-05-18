import {fireEvent, render} from '@testing-library/react';
import CASButton from '../app/[locale]/components/CASButton';
import React from "react";

describe('CASButton', () => {
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
        expect(window.location.href).toBe( "http://localhost:8000/microsoft/to-auth-redirect?next=/redirect/home");

        // restore the original window.location
        window.location = originalLocation;
    });
});
