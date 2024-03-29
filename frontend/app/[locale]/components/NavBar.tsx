'use client'
import React from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, IconButton, Toolbar, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeButton from "./HomeButton";
import LanguageSelect from "./LanguageSelect";
import AccountMenu from "./AccountMenu";
import {useTranslation} from "react-i18next";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

const NavBar = () => {
    const { t } = useTranslation();

    //Function that handles the bottom menu items
    const handleBottomItems = (event: React.MouseEvent<HTMLElement>, button:string) => {
        //TODO: handle bottom menu items
        switch (button) {
            case t('manual'):
                //TODO: Implement manual logic
                break;
            case t('github'):
                window.location.href = 'https://github.com/SELab-2/UGent-1'
                break;
            case t('my_profile'):
                //TODO: Implement my profile logic
                break;
            case t('logout'):
                doLogout();
        }
    };
    const doLogout = (): void => {
        // Implement CAS login logic here
        window.location.href = backend_url + "/auth/logout";
    };

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const courses = ["Course1", "Course2", "Course3", "Course4"];

    const DrawerList = (
        <Box sx={{ width: 250 }}
             role="presentation"
             onClick={toggleDrawer(open)}
             display="flex"
             flexDirection="column"
             justifyContent="space-between"
             overflow='auto'
        >
            <List>
                {courses.map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {[t('manual'), t('github'), t('my_profile'), t('logout')].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={(event) => handleBottomItems(event, text)}>
                            <ListItemIcon>
                                {index === 0 ? <QuestionMarkIcon /> :
                                    index === 1 ? <GitHubIcon /> :
                                        index === 2 ? <AccountCircleIcon /> :
                                            <Logout />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ justifyContent: 'space-between', left: 0, right: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <HomeButton />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <AccountMenu />
                        <LanguageSelect />
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer open={open}
                    onClose={toggleDrawer(false)}
                    sx={{
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { boxSizing: 'border-box' },
                    }}
            >
                <Toolbar />
                {DrawerList}
            </Drawer>
        </>
    );
}

export default NavBar;
