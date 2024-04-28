import NavBar from "@app/[locale]/components/NavBar"
import ProjectEditForm from "@app/[locale]/project/[project_id]/edit/projectEditForm";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import initTranslations from "@app/i18n";

const i18nNamespaces = ['common']

async function ProjectAddPage({params: {locale, course_id}}: { params: { locale: any, course_id: number } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)
    return (
        <TranslationsProvider locale={locale} namespaces={i18nNamespaces} resources={resources}>
            <NavBar/>
            <ProjectEditForm project_id={null} add_course_id={course_id}/>
        </TranslationsProvider>
    );
}

export default ProjectAddPage;