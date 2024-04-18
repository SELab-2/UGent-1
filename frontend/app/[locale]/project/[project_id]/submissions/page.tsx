import NavBar from "@app/[locale]/components/NavBar";
import React from "react";
import ProjectSubmissionsList from "@app/[locale]/components/ProjectSubmissionsList";
import Box from "@mui/material/Box";
import "./submissions_styles.css";
import ProjectReturnButton from "@app/[locale]/project/[project_id]/submissions/ProjectReturnButton";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import initTranslations from "@app/i18n";
import Footer from "@app/[locale]/components/Footer";
import Typography from "@mui/material/Typography";

const i18nNamespaces = ['common']

const SubmissionsPage = async ({params: {locale, project_id}}: {
    params: { locale: any, project_id: number }
}) => {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <Box className={"pageBox"}>
                <Box className={"pageRow"}>
                    <ProjectReturnButton
                        locale={locale}
                        project_id={project_id}
                    />
                </Box>
                <Box className={"pageRow"}>
                    <Typography variant="h3" className={"submissionTitle"}>
                        {t("submissions")}
                    </Typography>
                </Box>
            </Box>
            <ProjectSubmissionsList project_id={project_id}/>
        </TranslationsProvider>
    )
}

export default SubmissionsPage