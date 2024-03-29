import React from 'react'
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import Box from "@mui/material/Box";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import CourseBanner from "@app/[locale]/components/CourseBanner";

const i18nNamespaces = ['common']

export default async function Course({params: {locale, course}}: { params: { locale: any, course: string } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <Box sx={{marginTop: '64px', padding: 5}}>
                <CourseBanner/>
                <h1>
                    {t('test')}
                </h1>
                <h1>
                    {course}
                </h1>
            </Box>
            <Footer/>
        </TranslationsProvider>
    )
}