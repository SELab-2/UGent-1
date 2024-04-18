import {render} from '@testing-library/react';
import Footer from '../app/[locale]/components/Footer';
import React from "react";

describe('Footer', () => {
    it('renders correctly', () => {
        render(<Footer/>);
    });
});