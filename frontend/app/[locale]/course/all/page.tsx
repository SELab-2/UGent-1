import React from 'react'
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import ListView from '@app/[locale]/components/ListView';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Box, Button} from "@mui/material";


const i18nNamespaces = ['common']

export default async function AllCoursesPage({params: {locale}}: { params: { locale: any } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    const headers = [t('name'), t('description'), t('open'), t('join/leave')]
    const headers_backend = ['name', 'description', 'open', 'join/leave']

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <Box width={'100%'} style={{padding: 20}}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowBackIcon/>}
                    href={`/${locale}/home`}
                >
                    {t('back_to') + ' ' + t('home') + ' ' + t('page')}
                </Button>
                <ListView
                    admin={true}
                    headers={headers}
                    headers_backend={headers_backend}
                    sortable={[true, false, false, false]}
                    get={'courses'}
                    action_name={'join_course'}
                    action_text={t('join_course')}
                    search_text={t("search_course")}
                />
            </Box>
        </TranslationsProvider>
    )
}