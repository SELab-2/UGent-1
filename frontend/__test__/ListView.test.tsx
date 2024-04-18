import React from 'react';
import {screen, render, fireEvent, waitFor} from '@testing-library/react';
import {ThemeProvider} from '@mui/material/styles';
import {createTheme} from '@mui/material/styles';
import ListView from '../app/[locale]/components/ListView';

jest.mock('../lib/api', () => ({
   getUsers: jest.fn()
}));
// Define a mock theme object similar to the one used in your application
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f50057',
            contrastText: '#fff',
        },
        background: {
            default: '#f5f5f5',
        },
        text: {
            primary: '#000',
            secondary: '#fff',
        },
    },
    shadows: [
        'none', // Add shadow values as needed
        '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow values as needed
    ],
});

describe('ListView component', () => {
    it('renders ListView with default props', () => {
        render(
            <ThemeProvider theme={theme}>
                <ListView
                    admin={true}
                    headers={['name', 'email']}
                    get={'users'}
                    action_name={'remove'}
                    get_id={1}
                    tablenames={[]}
                    sortable={[true, true]}
                />
            </ThemeProvider>
        );

        //  Assert the buttons have rendered in
        expect(screen.getByRole('button', {name: 'Next'}),).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Prev'}),).toBeInTheDocument();

    });

    it('renders headers correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <ListView
                    admin={true}
                    headers={['name', 'email']}
                    get={'users'}
                    action_name={'remove'}
                    get_id={1}
                    tablenames={[]}
                    sortable={[true, true]}
                />
            </ThemeProvider>
        );
        // Ensure all headers are rendered
        expect(screen.getByText('name')).toBeInTheDocument();
        expect(screen.getByText('email')).toBeInTheDocument();
    });


    it('sorts data when header is clicked', async () => {
        render(
            <ThemeProvider theme={theme}>
                <ListView
                    admin={true}
                    headers={['name', 'email', 'role']}
                    get={'users'}
                    action_name={'remove'}
                    get_id={1}
                    tablenames={[]}
                    sortable={[true, true, false]}
                />
            </ThemeProvider>
        );
        // Simulate a click on the 'name' header
        fireEvent.click(screen.getByText('name'));

    });
});