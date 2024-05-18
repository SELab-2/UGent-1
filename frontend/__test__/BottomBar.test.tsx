import {render, screen} from '@testing-library/react';
import BottomBar from '../app/[locale]/components/BottomBar';
import React from "react";


describe('BottomBar', () => {
    it('renders correctly', () => {
        render(<BottomBar/>);


        expect(screen.getByText('Contact')).toBeInTheDocument();
        expect(screen.getByText('Privacy')).toBeInTheDocument();
        expect(screen.getByText('Version 0.0.1')).toBeInTheDocument();
    });
});
