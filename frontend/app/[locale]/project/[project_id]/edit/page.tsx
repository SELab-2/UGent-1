import NavBar from "../../../components/NavBar"
import BottomBar from "../../../components/BottomBar";
import ProjectEditForm from "@app/[locale]/project/[project_id]/edit/projectEditForm";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import initTranslations from "@app/i18n";
import Footer from "@app/[locale]/components/Footer";

const i18nNamespaces = ['common']

async function ProjectDetailPage({params: {locale, project_id}}: { params: { locale: any, project_id: any } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)
    return (
        <TranslationsProvider locale={locale} namespaces={i18nNamespaces} resources={resources}>
            <NavBar/>
            <ProjectEditForm project_id={project_id} locale={locale}/>
            <Footer/>
        </TranslationsProvider>
    );
}

export default ProjectDetailPage;