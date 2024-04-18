import {render, screen, fireEvent} from '@testing-library/react';
import AddProjectButton from '../app/[locale]/components/AddProjectButton';
import {addProject} from '../lib/api';

jest.mock('../lib/api', () => ({
    addProject: jest.fn(() => Promise.resolve(1)),
}));

describe('AddProjectButton', () => {
    it('renders correctly', () => {
        render(<AddProjectButton course_id={1}/>);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('calls addProject when button is clicked', async () => {
        const {getByText} = render(<AddProjectButton course_id={1}/>);
        const button = getByText('add_project');

        // Mock window.location.href
        delete window.location;
        window.location = { href: '' };

        await fireEvent.click(button);

        expect(addProject).toHaveBeenCalledWith(1);
        expect(window.location.href).toBe('/project/1/edit');
    });
});