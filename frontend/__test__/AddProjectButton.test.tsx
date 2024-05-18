import {render, screen, fireEvent} from '@testing-library/react';
import AddProjectButton from '../app/[locale]/components/AddProjectButton';
import {addProject} from '../lib/api';

jest.mock('../lib/api', () => ({
    addProject: jest.fn(() => Promise.resolve(1)),
}));

describe('AddProjectButton', () => {
    it('renders correctly', () => {
        render(<AddProjectButton course_id={1}/>);

        expect(screen.getByRole('link', {name: 'add_project'})).toBeInTheDocument();
    });
});