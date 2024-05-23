import {act, fireEvent, render, screen} from '@testing-library/react';
import AccountMenu from '../app/[locale]/components/AccountMenu';
import React from "react";
import * as api from "@lib/api";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

jest.mock('../lib/api', () => ({
    getUserData: jest.fn(() => Promise.resolve({first_name: 'First', last_name: 'Last'})),
    APIError: function () {
        this.message = '';
    }
}));


describe('AccountMenu', () => {
    it('name is displayed properly', async () => {
        await act(async () => {
            render(<AccountMenu/>);
        });

        // make sure the name is displayed correctly
        expect(await screen.findByText('First Last')).toBeInTheDocument();
    });

    it('opens the menu when button is clicked', async () => {
        await act(async () => {
            render(<AccountMenu/>);
        });

        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('menu')).toBeVisible();
    });


    it('closes the menu when an item is clicked', async () => {
        await act(async () => {
            render(<AccountMenu/>);
        });

        fireEvent.click(screen.getByRole('button'));
        const menu = screen.getByRole('menu');
        expect(menu).toBeVisible();
    });


    it('logs out when the logout button is clicked', async () => {
        await act(async () => {
            render(<AccountMenu/>);
        });

        const originalLocation = window.location;
        delete window.location;
        window.location = {...originalLocation, href: ''};

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByRole('menuitem', {name: 'logout'}));

        expect(window.location.href).not.toBe(originalLocation);

        window.location = originalLocation;
    });

    it('goes to profile page when profile button clicked', async () => {
        await act(async () => {
            render(<AccountMenu/>);
        });

        const originalLocation = window.location;
        delete window.location;
        window.location = {...originalLocation, href: ''};

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByRole('menuitem', {name: 'my_profile'}));

        expect(window.location.href).toBe('/profile');

        window.location = originalLocation;
    });

    it('test for API error', async () => {
        const error = new api.APIError();
        error.message = "Test error message";
        (api.getUserData as jest.Mock).mockRejectedValueOnce(error);

        await act(async () => {
            render(<AccountMenu/>);
        });

    });

});

