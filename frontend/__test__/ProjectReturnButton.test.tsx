import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import ProjectReturnButton from '@app/[locale]/components/ProjectReturnButton';

describe('ProjectReturnButton', () => {
    it('renders correctly', () => {
        render(<ProjectReturnButton/>);
    });
});