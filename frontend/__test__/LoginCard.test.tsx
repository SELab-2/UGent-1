import {render, screen} from '@testing-library/react';
import LoginCard from '../app/[locale]/components/LoginCard';
import React from "react";

describe('LoginCard', () => {
    it('renders correctly', () => {
        render(<LoginCard/>);

        // check that the logo was rendered properly
        expect(screen.getByAltText('logo')).toBeInTheDocument();

        // check that the CAS button was rendered properly
        expect(screen.getByText('Login with CAS')).toBeInTheDocument();
    });
});