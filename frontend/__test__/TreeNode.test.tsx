import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TreeNode from '../app/[locale]/components/TreeNode'; // Adjust the import path accordingly

const mockNode = {
    name: 'Parent Node',
    level: 0,
    isLeaf: false,
    children: [
        {
            name: 'Child Node 1',
            level: 1,
            isLeaf: true,
            children: [],
        },
        {
            name: 'Child Node 2',
            level: 1,
            isLeaf: false,
            children: [
                {
                    name: 'Grandchild Node 1',
                    level: 2,
                    isLeaf: true,
                    children: [],
                },
            ],
        },
    ],
};

const mockPaths = ['path/to/parent', 'path/to/child1', 'path/to/child2', 'path/to/grandchild1'];

describe('TreeNode', () => {
    it('renders correctly', () => {
        render(<TreeNode node={mockNode} initiallyOpen={false} paths={mockPaths} />);

        expect(screen.getByText('Parent Node')).toBeInTheDocument();
        expect(screen.queryByText('Child Node 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Child Node 2')).not.toBeInTheDocument();
    });

    it('toggles the collapse on click', () => {
        render(<TreeNode node={mockNode} initiallyOpen={false} paths={mockPaths} />);

        const parentNode = screen.getByText('Parent Node');
        fireEvent.click(parentNode);

        expect(screen.getByText('Child Node 1')).toBeInTheDocument();
        expect(screen.getByText('Child Node 2')).toBeInTheDocument();

        fireEvent.click(parentNode);
    });

    it('renders child nodes correctly', () => {
        render(<TreeNode node={mockNode} initiallyOpen={true} paths={mockPaths} />);

        expect(screen.getByText('Child Node 1')).toBeInTheDocument();
        expect(screen.getByText('Child Node 2')).toBeInTheDocument();
    });
});
