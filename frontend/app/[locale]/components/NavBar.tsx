'use client'
import React, {useEffect, useState} from 'react';

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
import {APIError, Course, getCourses} from "@lib/api";
import initTranslations from "@app/i18n";
import {any} from "prop-types";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];
const i18nNamespaces = ['common']

const NavBar = () => {
    const [courses, setCourses] = useState<Course[]>([]); // Initialize courses as an empty array
    const [error, setError] = useState<APIError | null>(null);
    const [translations, setTranslations] = useState<{t: ((key: string) => string), resources: any, locale: string, i18nNamespaces: string[]}>
        ({t: (key: string) => key, resources: null, locale: "en", i18nNamespaces: [""]})
    useEffect(() => {
        const fetchCourses = async () => {
            try{
                setCourses(await getCourses());
                console.log(await getCourses());
            }catch(error){
                if(error instanceof APIError) setError(error);
            }

        };

        const fetchTranslations = async () => {
            const url = window.location.pathname;
            const locale = url.split('/')[1];
            const {t, resources} = await initTranslations(locale, i18nNamespaces)
            setTranslations({t, resources, locale, i18nNamespaces})
        }

        fetchTranslations();
        fetchCourses();
    }, []);

    //Function that handles the bottom menu items
    const handleBottomItems = (event: React.MouseEvent<HTMLElement>, button:string) => {
        switch (button) {
            case translations.t('manual'):
                //TODO: Route to manual page(in wiki or separate page?)
                break;
            case translations.t('github'):
                window.location.href = 'https://github.com/SELab-2/UGent-1'
                break;
            case translations.t('my_profile'):
                //TODO: Route to profile page
                break;
            case translations.t('logout'):
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

    //const courses = ["Course1", "Course2", "Course3", "Course4"];

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
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <ListItem key={course.course_id} disablePadding>
                            <ListItemButton>
                                <ListItemText primary={course.name} />
                            </ListItemButton>
                        </ListItem>
                    ))
                ) : (
                    <ListItem>
                        <ListItemText
                            primary={translations.t("no_courses")}
                            sx={{
                                color: 'text.disabled'
                            }}
                        />
                    </ListItem>
                )}
            </List>
            <Divider />
            <List>
                {[translations.t('manual'), translations.t('github'), translations.t('my_profile'), translations.t('logout')].map((text, index) => (
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
