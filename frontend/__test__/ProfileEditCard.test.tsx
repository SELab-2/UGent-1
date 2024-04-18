import React from 'react';
import {fireEvent, screen, render, waitFor} from '@testing-library/react';
import ProfileEditCard from "@app/[locale]/components/ProfileCard";
import '@testing-library/jest-dom';
import * as api from '@lib/api';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

jest.mock('../lib/api', () => ({
    getUserData: jest.fn(),
    getImage: jest.fn(),
    APIError: jest.fn(),
}));

describe('ProfileEditCard', () => {

    it('renders user name correctly', async () => {
        (api.getUserData as jest.Mock).mockResolvedValueOnce({
            id: 1,
            email: "test@gmail.com",
            first_name: "First",
            last_name: "Last",
            course: [1],
            role: 1,
            picture: "http://localhost:8000/media/profile_pictures/test.png"
        })

        const {getByText} = render(<ProfileEditCard/>);

        await waitFor(() => {
            expect(getByText('First Last')).toBeInTheDocument();
            expect(getByText('test@gmail.com')).toBeInTheDocument();
        })
    })

    it('changes page after clicking save_changes button', async () => {
        const {getByText} = render(<ProfileEditCard/>);
        const button = screen.getByRole('button');

        delete window.location
        window.location = {href: ''};

        await fireEvent.click(button);

        expect(window.location.href).toBe('/profile');
    })
})
