import { render, screen } from '@testing-library/react';
import BackButton from '../app/[locale]/components/BackButton';

describe('BackButton', () => {
    it('renders correctly', () => {
        render(<BackButton destination="/home" text="Return"/>);

        // check that the button was rendered properly
        expect(screen.getByText('Return')).toBeInTheDocument();
    });
});