import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CopyToClipboardButton from '@app/[locale]/components/CopyToClipboardButton'; // Adjust the import path as necessary
import '@testing-library/jest-dom/extend-expect';

// Mock the useTranslation hook from react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            if (key === "copy") return "Copy";
            if (key === "copied_to_clipboard") return "Copied to clipboard!";
            return key;
        }
    }),
}));

// Mock navigator.clipboard
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(),
    },
});

describe('CopyToClipboardButton', () => {
    it('copies text to clipboard and shows confirmation message when clicked', async () => {
        const text = "Test text to copy";

        render(<CopyToClipboardButton text={text} />);

        // Find button by aria-label or tooltip text
        const button = screen.getByRole('button', { name: /copy/i });
        fireEvent.click(button);

        // Assert clipboard writeText was called with the right text
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);

        // Assert Snackbar is visible with correct message
        expect(screen.getByText(/copied to clipboard!/i)).toBeInTheDocument();
    });
});
