import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusButton from '@app/[locale]/components/StatusButton';

jest.mock('@mui/icons-material/Check', () => () => <div data-testid="check-icon" />);
jest.mock('@mui/icons-material/HelpOutline', () => () => <div data-testid="help-icon" />);
jest.mock('@mui/x-date-pickers/icons', () => ({ ClearIcon: () => <div data-testid="clear-icon" /> }));

describe('StatusButton', () => {
    let files: any[];
    let setFiles: jest.Mock;

    beforeEach(() => {
        files = ['+', '~', '-'];
        setFiles = jest.fn((newFiles) => {
            files = newFiles;
        });
    });

    it('renders the initial status correctly', () => {
        render(<StatusButton files={files} setFiles={setFiles} fileIndex={0} />);
        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('cycles through statuses on click', () => {
        render(<StatusButton files={files} setFiles={setFiles} fileIndex={0} />);

        // Click to change status
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByTestId('help-icon')).toBeInTheDocument();
        expect(setFiles).toHaveBeenCalledWith(['~', '~', '-']);

        // Click to change status again
        fireEvent.click(screen.getByRole('button'));
        expect(setFiles).toHaveBeenCalledWith(['-', '~', '-']);

        // Click to change status back to initial
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
        expect(setFiles).toHaveBeenCalledWith(['+', '~', '-']);
    });

    it('renders correct status for fileIndex 1', () => {
        render(<StatusButton files={files} setFiles={setFiles} fileIndex={1} />);
        expect(screen.getByTestId('help-icon')).toBeInTheDocument();
    });

    it('renders correct status for fileIndex 2', () => {
        render(<StatusButton files={files} setFiles={setFiles} fileIndex={2} />);
    });

    it('handles an empty file state correctly', () => {
        files = ['', '~', '-'];
        render(<StatusButton files={files} setFiles={setFiles} fileIndex={0} />);

        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
        expect(setFiles).toHaveBeenCalledWith(['+', '~', '-']);
    });
});
