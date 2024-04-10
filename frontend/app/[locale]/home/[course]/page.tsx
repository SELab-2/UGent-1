"use client"
import React from 'react';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import CourseBanner from "@app/[locale]/components/CourseBanner";
import AddProjectButton from "@app/[locale]/components/AddProjectButton";
import {Button} from "@mui/material";
import { joinCourseUsingToken, APIError} from '@lib/api';

const i18nNamespaces = ['common']

export default async function Course({params: {locale, course}, searchParams: {token}}:
                                         { params: { locale: any, course: string }, searchParams: { token: string } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    const project_selected = false

    const desc_mock = "This is a mock description for the course, it should be replaced with the actual course description. It should be a brief description of the course."


    if (token){
        try {
            await joinCourseUsingToken(course, token);
        } catch (error) {
            if (error instanceof APIError) {
                console.error(error.message);
            }
        }
    }


    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <Box sx={{marginTop: '64px', padding: 5}}>
                <CourseBanner/>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'medium',
                        marginTop: 2
                    }}
                >
                    {t('description')}
                </Typography>
                <Typography variant="h6">
                    {desc_mock}
                </Typography>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'medium',
                        marginTop: 2
                    }}
                >
                    {t('projects')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: "calc(100% - 40px)",
                        paddingX: 2,
                    }}
                >
                    <AddProjectButton/>
                    <Button
                        variant="contained"
                        color='secondary'
                        disabled={!project_selected}
                        sx={{
                            width: 'fit-content',
                            color: 'secondary.contrastText',
                        }}
                    >
                        {t("details")}
                    </Button>
                </Box>
                <h1>
                    {course}
                </h1>
            </Box>
            <Footer/>
        </TranslationsProvider>
    )
}