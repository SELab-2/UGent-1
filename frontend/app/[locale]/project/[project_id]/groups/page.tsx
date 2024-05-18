import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import ListView from '@app/[locale]/components/ListView';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Box } from "@mui/material";
import React from "react";

const i18nNamespaces = ['common']

export default async function GroupPage({ params }: { params: { locale: any, project_id: number } }) {
    const { locale, project_id: projectId } = params; 
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    const headers = [t('group_nr'), t('members'), t('join/leave')];
    const headers_backend = ['group_nr', 'members', 'join/leave'];
    
    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            <Box width={'100%'} style={{padding:20}}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowBackIcon/>}
                    href={`/${locale}/project/${projectId}`}
                >
                    {t("return_project")}
                </Button>
                <ListView
                    admin={true}
                    headers={headers}
                    headers_backend={headers_backend}
                    sortable={[true, false, false]}
                    get_id={projectId}
                    get={'groups'}
                    search_text={t("group_search")}
                />
            </Box>
        </TranslationsProvider>
    );
}
