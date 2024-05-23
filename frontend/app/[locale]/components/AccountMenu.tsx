'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useTranslation} from "react-i18next";
import {APIError, getUserData, UserData} from "@lib/api";
import {useEffect, useState} from "react";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

export default function AccountMenu() {
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<APIError | null>(null);
    const { t } = useTranslation()

    useEffect(() => {


        const fetchCourses = async () => {
            try{
                setUser(await getUserData());
            }catch(error){
                if(error instanceof APIError) setError(error);
            }

        };

        fetchCourses();
    }, []);



    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        //TODO: Handle settings and My profile actions!!
        setAnchorEl(null);
    };

    const toProfile = () => {
        window.location.href = '/profile'
    }

    const handleLogout = () => {
        setAnchorEl(null);
        window.location.href = backend_url + "/auth/logout";
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <Button
                        onClick={handleClick}
                        startIcon={<AccountCircleIcon />}
                        variant="text"
                        sx={{
                            ml: 2,
                            color: "white",
                            '&:hover': {
                                color: 'secondary.main',
                                backgroundColor: 0,
                            },
                            textTransform: "none"
                        }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Typography variant="body1" sx={{ whiteSpace: 'nowrap'}}>{(user?.first_name ?? "------") + " " + (user?.last_name ?? "------")}</Typography>
                    </Button>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                sx= {{
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={toProfile}>
                    <Avatar /> {t('my_profile')}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    {t('settings')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    {t('logout')}
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}