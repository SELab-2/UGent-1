import React from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, IconButton, Toolbar, Typography} from '@mui/material';

const NavBar = () => {
    return (
        <AppBar position="fixed">
            <Toolbar sx={{ justifyContent: 'space-between', left: 0, right: 0 }}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    Pigeonhole
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
