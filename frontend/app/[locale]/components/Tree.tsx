import React from 'react';
import { List } from '@mui/material';
import TreeNode from '@app/[locale]/components/TreeNode';

interface TreeNodeData {
    name: string;
    level?: number;
    isLeaf?: boolean;
    children?: TreeNodeData[];
}

interface TreeNodeDataMap {
    [key: string]: TreeNodeData;
}

function createTreeStructure(paths: string[]): TreeNodeDataMap {
    const tree: TreeNodeDataMap = {};

    paths.forEach((path) => {
        const parts = path.split('/');
        let currentLevel = tree;

        parts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = {
                    name: part,
                    children: {},
                } as TreeNodeData;
            }
            if (index === parts.length - 1) {
                currentLevel[part].isLeaf = true;
            } else {
                currentLevel = currentLevel[part].children as TreeNodeDataMap;
            }
        });
    });

    return tree;
}

function convertToNodes(tree: TreeNodeDataMap, level: number = 0): TreeNodeData[] {
    return Object.values(tree).map((node) => ({
        name: node.name,
        level: level,
        isLeaf: node.isLeaf ?? false,
        children: node.children ? convertToNodes(node.children as TreeNodeDataMap, level + 1) : [],
    }));
}

// Tree component
interface TreeProps {
    paths: string[];
}

const Tree: React.FC<TreeProps> = ({ paths }) => {
    const treeData = createTreeStructure(paths);
    const nodes = convertToNodes(treeData);

    return (
        <List>
            {nodes.map((node) => (
                <TreeNode key={node.name} node={node} />
            ))}
        </List>
    );
};

export default Tree;
