import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Box, Button} from "@mui/material";
import React from "react";
import ProjectSubmissionsList from "@app/[locale]/components/ProjectSubmissionsList";

const i18nNamespaces = ['common']

export default async function SubmissionsPage({params}: { params: { locale: any, project_id: number } }) {
    const {locale, project_id: projectId} = params;
    const {t, resources} = await initTranslations(locale, i18nNamespaces);

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
                    href={`/${locale}/project/${projectId}`}
                >
                    {t("return_project")}
                </Button>
                <ProjectSubmissionsList
                    project_id={projectId}
                    page_size={10}
                    search={t("submission_search")}
                />
            </Box>
        </TranslationsProvider>
    );
}
