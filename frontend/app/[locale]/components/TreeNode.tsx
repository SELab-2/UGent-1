import React, {useEffect, useState} from 'react';
import {Collapse, IconButton, List, ListItem, ListItemText} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface TreeNodeProps {
    node: {
        name: string;
        level: number;
        isLeaf: boolean;
        children: TreeNodeProps['node'][];
    };
    initiallyOpen?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({node, initiallyOpen = false}) => {
    const [open, setOpen] = useState(initiallyOpen);

    const handleClick = () => setOpen(!open);

    useEffect(() => {
        setOpen(initiallyOpen);
    }, [initiallyOpen]);

    return (
        <>
            <ListItem onClick={handleClick} dense sx={{pl: node.level * 2}}>
                <ListItemText primary={node.name}/>
                {!node.isLeaf && (
                    <IconButton edge="end">
                        {open ? <ExpandLess/> : <ExpandMore/>}
                    </IconButton>
                )}
            </ListItem>
            {!node.isLeaf && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {node.children.map((child) => (
                            <TreeNode key={child.name} node={child} initiallyOpen={false}/>
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

export default TreeNode;
