'use client'
import React, {useEffect, useState} from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar
} from '@mui/material';
import Link from "next/link";
import GitHubIcon from '@mui/icons-material/GitHub';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConstructionIcon from '@mui/icons-material/Construction';
import HomeButton from "./HomeButton";
import LanguageSelect from "./LanguageSelect";
import AccountMenu from "./AccountMenu";
import {useTranslation} from "react-i18next";
import {APIError, Course, getCoursesForUser, getUserData, UserData} from "@lib/api";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

const NavBar = () => {
    const [courses, setCourses] = useState<Course[]>([]); // Initialize courses as an empty array
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<APIError | null>(null);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCourses(await getCoursesForUser());
                setUser(await getUserData());
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }

        };

        fetchCourses();
    }, []);

    //Function that handles the bottom menu items
    const handleBottomItems = (event: React.MouseEvent<HTMLElement>, button: string) => {
        switch (button) {
            case t('manual'):
                //TODO: Route to manual page(in wiki or separate page?)
                break;
            case t('github'):
                window.location.href = 'https://github.com/SELab-2/UGent-1'
                break;
            case t('my_profile'):
                window.location.href = '/profile'
                break;
            case t('logout'):
                doLogout();
        }
    };

    const handleCourseClick = (course_id: number) => {
        window.location.href = '/course/' + course_id;
    }

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
        <Box sx={{width: 250}}
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
                            <ListItemButton onClick={(event) => handleCourseClick(course.course_id)}>
                                <ListItemText primary={course.name}/>
                            </ListItemButton>
                        </ListItem>
                    ))
                ) : (
                    <ListItem>
                        <ListItemText
                            primary={t("no_courses")}
                            sx={{
                                color: 'text.disabled'
                            }}
                        />
                    </ListItem>
                )}
            </List>
            {user?.role === 1 ? (
                <>
                    <Divider/>
                    <Link href={'/admin'} style={{textDecoration: 'none', color: 'inherit'}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <ConstructionIcon/>
                            </ListItemIcon>
                            <ListItemText primary={t("admin_page")}/>
                        </ListItemButton>
                    </Link>
                </>
            ) : null}
            <Divider/>
            <List>
                {[t('manual'), t('github'), t('my_profile'), t('logout')].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={(event) => handleBottomItems(event, text)}>
                            <ListItemIcon>
                                {index === 0 ? <QuestionMarkIcon/> :
                                    index === 1 ? <GitHubIcon/> :
                                        index === 2 ? <AccountCircleIcon/> :
                                            <Logout/>}
                            </ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar sx={{justifyContent: 'space-between', left: 0, right: 0}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <HomeButton/>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                        <AccountMenu/>
                        <LanguageSelect/>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer open={open}
                    onClose={toggleDrawer(false)}
                    sx={{
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {boxSizing: 'border-box'},
                    }}
            >
                <Toolbar/>
                {DrawerList}
            </Drawer>
        </>
    );
}

export default NavBar;
