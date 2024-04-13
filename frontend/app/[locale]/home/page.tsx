import React from 'react';
import initTranslations from "../../i18n";
import {Box, Container} from '@mui/material';
import NavBar from '../components/NavBar';
import CourseControls from '../components/CourseControls';
import TranslationsProvider from "../components/TranslationsProvider";
import CoursesGrid from '../components/CoursesGrid';

const HomePage = async ({params: {locale}}: { params: { locale: any } }) => {
    const {t, resources} = await initTranslations(locale, ['common'])

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
            <Box sx={{position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff'}}>
                <Container>
                    <CourseControls/>
                </Container>
            </Box>
            <CoursesGrid/>
        </TranslationsProvider>
    );
};

export default HomePage;
