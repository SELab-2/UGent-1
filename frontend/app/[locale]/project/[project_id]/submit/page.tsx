import React from 'react';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import AddButton from "@app/[locale]/components/AddButton";

import DropZone from "@app/[locale]/project/[project_id]/submit/Dropzone";

const i18nNamespaces = ['common']

export default async function Course({params: {locale, course_id}, searchParams: {token}}:
                                         { params: { locale: any, course_id: string }, searchParams: { token: string } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    const project_selected = false

    const desc_mock = "TODO: zet hier indieninstructies van het project, en misschien ook nog groepnummer, ook vorige indieningen een samenvatting ofzo"
    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <Box sx={{marginTop: '64px', padding: 5}}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'medium',
                        marginTop: 2
                    }}
                >
                    {t('submit_project')}
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
                    {t('files')}
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
                    <AddButton translationkey='add_file_folder'/>
                </Box>

                <DropZone>

                </DropZone>

                <h1>
                    {course_id}
                </h1>
            </Box>

            <Footer/>
        </TranslationsProvider>
    )
}
