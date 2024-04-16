import {act, fireEvent, render, screen} from '@testing-library/react';
import AccountMenu from '../app/[locale]/components/AccountMenu';
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

jest.mock('../lib/api', () => ({
    getUserData: () => Promise.resolve({first_name: 'First', last_name: 'Last'}),
    APIError: () => {
    }
}));

describe('AccountMenu', () => {
    beforeEach(async () => {
        await act(async () => {
            render(<AccountMenu/>);
        });
    });

    it('name is displayed properly', async () => {
        // make sure the name is displayed correctly
        expect(await screen.findByText('First Last')).toBeInTheDocument();
    });

    it('opens the menu when button is clicked', async () => {
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('menu')).toBeVisible();
    });


    it('closes the menu when an item is clicked', async () => {
        fireEvent.click(screen.getByRole('button'));
        const menu = screen.getByRole('menu');
        expect(menu).toBeVisible();
        fireEvent.click(screen.getByRole('menuitem', {name: 'Settings'}));
        expect(menu).not.toBeVisible();
    });


    it('logs out when the logout button is clicked', async () => {
        const originalLocation = window.location;
        delete window.location;
        window.location = { ...originalLocation, href: '' };

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByRole('menuitem', {name: 'Log out'}));

        expect(window.location.href).toBe('undefined/auth/logout');

        window.location = originalLocation;
    });
});

