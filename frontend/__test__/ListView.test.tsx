import {fireEvent, render} from '@testing-library/react';
import ListView from '../app/[locale]/components/ListView';
import React from "react";


describe('ListView', () => {
    it('renders correctly', () => {
        const {getByText, getByRole} = render(<ListView/>);

        // check that the button was rendered properly
        expect(getByText('Select')).toBeInTheDocument();
    });

    it('calls handleCASLogin when button is clicked', () => {
        const originalLocation = window.location;
        const mockLocation: any = {
            href: '',
            assign: jest.fn(),
        };
        delete window.location
        window.location = mockLocation;

        const {getByText} = render(<ListView/>);
        const button = getByText('Login with CAS');
        fireEvent.click(button);

        // undefined, because i havent mocked the process.env stuff
        expect(window.location.href).toBe('undefined/microsoft/to-auth-redirect?next=undefined/home');

        // restore the original window.location
        window.location = originalLocation;
    });
});
