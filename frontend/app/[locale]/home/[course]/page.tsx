import React from 'react'
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import CourseBanner from "@app/[locale]/components/CourseBanner";

const i18nNamespaces = ['common']

export default async function Course({params: {locale, course}}: { params: { locale: any, course: string } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    const desc_mock = "This is a mock description for the course, it should be replaced with the actual course description. It should be a brief description of the course."

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
                <h1>
                    {course}
                </h1>
            </Box>
            <Footer/>
        </TranslationsProvider>
    )
}