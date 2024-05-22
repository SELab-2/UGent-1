import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditUserForm from '../app/[locale]/components/EditUserForm';
import { getUser, updateUserData } from '@lib/api';

jest.mock('../lib/api', () => ({
    getUser: jest.fn(),
    updateUserData: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

describe('EditUserForm', () => {
    const mockUser = {
        first_name: 'John',
        last_name: 'Doe',
        role: 2,
        email: 'john.doe@example.com',
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getUser.mockResolvedValue(mockUser);
        updateUserData.mockResolvedValue({});
    });

    it('fetches and displays user data correctly', async () => {
        render(<EditUserForm userId={1} />);

        await waitFor(() => {
            expect(screen.getByText('user email')).toBeInTheDocument();
            expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
            expect(screen.getByText('teacher')).toBeInTheDocument();
        });
    });

    it('updates user data correctly', async () => {
        render(<EditUserForm userId={1} />);

        // Wait for the user data to be fetched and displayed
        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        // Change the first name
        fireEvent.change(screen.getByDisplayValue('John'), {
            target: { value: 'Jane' },
        });

        // Submit the form
        fireEvent.submit(screen.getByRole('button', { name: 'save changes' }));

        // Check if the updateUserData was called with the updated data
        await waitFor(() => {
            expect(updateUserData).toHaveBeenCalledWith(1, expect.any(FormData));
        });

        const formData = updateUserData.mock.calls[0][1];
        expect(formData.get('first_name')).toBe('Jane');
        expect(formData.get('last_name')).toBe('Doe');
        expect(formData.get('role')).toBe('2');
        expect(formData.get('email')).toBe('john.doe@example.com');
    });
});
