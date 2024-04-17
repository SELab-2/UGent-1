import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import ListView from '../app/[locale]/components/ListView';

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
  test('renders ListView with default props', () => {
    render(
      <ThemeProvider theme={theme}>
        <ListView
          admin={true}
          headers={['name', 'email', 'role']}
          get={'users'}
          action_name={'remove'}
        />
      </ThemeProvider>
    );
    // Add assertions to verify that the component renders correctly
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('renders headers correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <ListView
          admin={true}
          headers={['name', 'email', 'role']}
          get={'users'}
          action_name={'remove'}
        />
      </ThemeProvider>
    );
    // Ensure all headers are rendered
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('role')).toBeInTheDocument();
  });

  test('renders checkboxes when admin is true', () => {
    render(
      <ThemeProvider theme={theme}>
        <ListView
          admin={true}
          headers={['name', 'email', 'role']}
          get={'users'}
          action_name={'remove'}
        />
      </ThemeProvider>
    );
    // Ensure checkboxes are rendered
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });
});
