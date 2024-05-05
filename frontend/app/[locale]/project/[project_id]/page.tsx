import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import ProjectDetailsPage from "@app/[locale]/components/ProjectDetailsPage";

const i18nNamespaces = ['common']

const ProjectPage = async ({params: {locale, project_id}}: {
    params: { locale: any, project_id: number }
}) => {
    const {t, resources} = await initTranslations(locale, i18nNamespaces);

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <ProjectDetailsPage
                locale={locale}
                project_id={project_id}
            />
        </TranslationsProvider>
    )
}

export default ProjectPage;