import React from 'react';
import NavBar from "@app/[locale]/components/NavBar";
import ListView from '@app/[locale]/components/ListView';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import {Box, Button} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const i18nNamespaces = ['common'];

const ArchivePage = async ({params: {locale}}) => {
    const {t, resources} = await initTranslations(locale, i18nNamespaces);
    const headers = [t('name'), t('description'), t('open')];
    const headers_backend = ['name', 'description', 'open'];

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
                    sortable={[true, false, false]}
                    get={'archived_courses'}
                    search_text={t("search_course")}
                />
            </Box>
        </TranslationsProvider>
    );
};

export default ArchivePage;
