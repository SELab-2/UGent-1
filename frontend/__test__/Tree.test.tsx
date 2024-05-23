import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tree from '@app/[locale]/components/Tree';

// Mocking the TreeNode component
jest.mock('../app/[locale]/components/TreeNode', () => ({
    __esModule: true,
    default: ({ node }: any) => <div>{node.name}</div>,
}));

describe('Tree', () => {
    it('renders correctly with given paths', () => {
        const paths = [
            'root/branch1/leaf1',
            'root/branch1/leaf2',
            'root/branch2/leaf1',
            'root/branch3'
        ];

        render(<Tree paths={paths} />);

        // Check if the root node is rendered
        expect(screen.getByText('root')).toBeInTheDocument();});
});
