import React from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Button, IconButton, Toolbar, Typography} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavBar = () => {
    const doLogout = (): void => {
        // Implement CAS login logic here
        window.location.href = backend_url + "/auth/logout";
    };

    return (
        <AppBar position="fixed">
            <Toolbar sx={{justifyContent: 'space-between', left: 0, right: 0}}>
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
                <IconButton>
                    <NotificationsIcon style={{color: 'white', fontSize: '30px'}}/>
                </IconButton>
                <IconButton>
                    <AccountCircleIcon style={{color: 'white', fontSize: '30px'}}/>
                </IconButton>
                <div>
                    <Button
                        onClick={doLogout}
                        fullWidth
                        variant="contained"
                        color="secondary"
                    >
                        Log out
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
